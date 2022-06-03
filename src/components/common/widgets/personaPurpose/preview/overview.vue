<template>
    <div class="p-5 overflow-scroll">
        <div class="flex items-center text-sm font-bold text-gray-500">
            <AtlanIcon icon="Overview" class="h-4 mr-2 -mt-1" />
            Overview
        </div>
        <div class="flex mt-4">
            <div class="flex-1">
                <div class="text-sm text-gray-500">User and Groups</div>
                <div
                    v-if="activeTab === 'persona'"
                    class="mt-2 text-sm font-bold cursor-pointer text-primary"
                    @click="$emit('handleChangeTab', 'UsersGroups')"
                >
                    {{ userGroup }}
                </div>

                <div
                    v-if="activeTab === 'purpose'"
                    class="mt-2 text-sm font-bold text-gray-700"
                >
                    {{ userGroupPurpose }}
                </div>
            </div>
            <div class="flex-1">
                <div class="text-sm text-gray-500">Assets</div>
                <div v-if="isLoading"><AtlanLoader class="w-4 h-4" /></div>
                <div
                    v-else
                    class="mt-2 text-sm font-bold cursor-pointer text-primary"
                    @click="$emit('handleChangeTab', 'AssetsView')"
                >
                    {{ getCountString(totalAsset) }}
                </div>
            </div>
        </div>
        <div class="mt-7">
            <div class="text-sm text-gray-500">Description</div>
            <div
                class="mt-2 text-sm"
                :class="item.description ? 'text-gray-800' : 'text-gray-600'"
            >
                {{ item.description || 'No description' }}
            </div>
        </div>
        <div v-if="activeTab === 'purpose'" class="mt-7">
            <div class="text-sm text-gray-500">Classifications</div>
            <div
                v-if="!listClassifications.length"
                class="mt-2 text-sm text-gray-600"
            >
                No classification attached
            </div>
            <div v-else class="flex gap-2 mt-2 overflow-scroll max-h-40">
                <div
                    v-for="(classification, i) in listClassifications"
                    :key="classification.guid"
                    class="flex items-end"
                >
                    <Popover :classification="classification">
                        <ClassificationPill
                            :name="classification.name"
                            :display-name="classification?.displayName"
                            :is-propagated="false"
                            :allow-delete="false"
                            :color="classification.options?.color"
                            :created-by="classification?.createdBy"
                            class="px-2 border border-gray-200"
                        />
                    </Popover>
                </div>
            </div>
        </div>
        <div v-if="item?.type === 'persona'" class="mt-7">
            <div class="text-sm text-gray-500">Connections</div>
            <div
                class="flex flex-col gap-2 p-2 mt-2 overflow-scroll bg-gray-100 rounded-lg max-h-44"
            >
                <div
                    v-for="connection in connections"
                    :key="connection?.connectorName"
                    class="bg-white rounded-lg px-2.5 py-1.5 text-sm text-gray-800 flex shadow-connection"
                >
                    <img class="w-4 h-4 mr-2" :src="connection?.imgPath" />
                    {{ connection?.connectorName }}
                </div>
                <div v-if="!connections?.length" class="text-sm text-gray-600">
                    No connection
                </div>
            </div>
        </div>
        <div v-if="glossary.length" class="mt-7">
            <div class="text-sm text-gray-500">Glossary</div>
            <div
                class="flex flex-col gap-2 p-2 mt-2 overflow-scroll bg-gray-100 rounded-lg max-h-44"
            >
                <!-- <GlossaryPopover
                    v-for="glo in glossary"
                    :key="glo?.id"
                    placement="right"
                    trigger="click"
                    :term="glo"
                    :show-drawer-toggle="false"
                > -->
                <router-link
                    v-for="glo in glossary"
                    :key="glo?.id"
                    :to="`/glossary/${glo.guid}/overview`"
                >
                    <div
                        class="bg-white cursor-pointer rounded-lg px-2.5 py-1.5 text-sm text-gray-800 flex shadow-connection"
                    >
                        <AtlanIcon
                            :icon="
                                getEntityStatusIcon(
                                    glo.typeName,
                                    certificateStatus(glo)
                                )
                            "
                            class="mr-2"
                        />
                        {{ glo?.displayText }}
                    </div>
                </router-link>
                <!-- </GlossaryPopover> -->
            </div>
        </div>
        <div class="mt-7">
            <div class="mb-2 text-sm text-gray-500">Readme</div>
            <ReadmeView
                :max-height="170"
                :readme="item.readme"
                @expandedReadme="expandedReadme"
            />
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, computed, toRefs, ref } from 'vue'

    // import GlossaryPopover from '@common/popover/glossary/index.vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import { useDiscoverList } from '~/composables/discovery/useDiscoverList'
    import { getCountString } from '~/utils/number'
    import ReadmeView from '~/components/common/readmeView/index.vue'
    import { mergeArray } from '~/utils/array'
    import useTypedefData from '~/composables/typedefs/useTypedefData'
    import ClassificationPill from '@/common/pills/classification.vue'
    import Popover from '@/common/popover/classification/index.vue'
    import { useConnectionStore } from '~/store/connection'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'
    import useGlossaryStore from '~/store/glossary'
    import useGlossaryData from '~/composables/glossary2/useGlossaryData'

    export default defineComponent({
        name: 'PersonaPurposeOverview',
        components: {
            ReadmeView,
            ClassificationPill,
            Popover,
            // GlossaryPopover,
        },
        props: {
            item: {
                type: Object,
                required: true,
            },
            activeTab: {
                type: String,
                required: true,
            },
        },
        emits: ['handleChangeTab'],
        setup(props) {
            const { classificationList } = useTypedefData()
            const { item, activeTab } = toRefs(props)
            const aggregations = ref(['typeName'])
            const limit = ref(1)
            const offset = ref(0)
            const facets = ref(
                activeTab.value === 'purpose'
                    ? {
                          __traitNames: {
                              classifications: item.value.tags,
                          },
                      }
                    : {}
            )
            const globalState = computed(() =>
                activeTab.value === 'persona' ? ['persona', item.value.id] : []
            )

            const { fetch, isLoading, assetTypeAggregationList } =
                useDiscoverList({
                    isCache: false,
                    limit,
                    offset,
                    aggregations,
                    globalState,
                    facets,
                })
            fetch()

            const totalAsset = computed(() =>
                assetTypeAggregationList.value.reduce(
                    (accumulator, currentValue) =>
                        accumulator + currentValue.count,
                    0
                )
            )
            const { getConnectorImageMap, certificateStatus } = useAssetInfo()
            const userGroupPurpose = computed(() => {
                let userPurposes = []
                let groupPurposes = []
                const { metadataPolicies, dataPolicies } = item.value
                let isAllUser = false
                dataPolicies?.forEach((dataPolicy) => {
                    if (dataPolicy.allUsers) {
                        isAllUser = true
                    }
                    userPurposes = [...userPurposes, ...dataPolicy.users]
                    groupPurposes = [...groupPurposes, ...dataPolicy.groups]
                })
                metadataPolicies?.forEach((metadataPolicy) => {
                    if (metadataPolicy.allUsers) {
                        isAllUser = true
                    }
                    userPurposes = [...userPurposes, ...metadataPolicy.users]
                    groupPurposes = [...groupPurposes, ...metadataPolicy.groups]
                })
                if (
                    !userPurposes.includes('all-users') &&
                    userPurposes.length &&
                    !isAllUser
                ) {
                    const resultUser = [...new Set(userPurposes)].length
                    const resultUserGroups = [...new Set(groupPurposes)].length
                    return `${
                        resultUser
                            ? `${resultUser} ${
                                  resultUser > 1 ? 'users' : 'user'
                              }`
                            : ''
                    }${resultUser && resultUserGroups ? ', ' : ''} ${
                        resultUserGroups
                            ? `${resultUserGroups} ${
                                  resultUserGroups > 1 ? 'groups' : 'group'
                              }`
                            : ''
                    }`
                }
                if (userPurposes.includes('all-users') || isAllUser) {
                    return 'All users'
                }
                return '-'
            })
            const userGroup = computed(() => {
                const users = item.value.users?.length
                const groups = item.value.groups?.length
                return `${
                    users ? `${users} ${users > 1 ? 'users' : 'user'}` : ''
                }${users && groups ? ', ' : ''} ${
                    groups ? `${groups} ${groups > 1 ? 'groups' : 'group'}` : ''
                }`
            })
            const connStore = useConnectionStore()
            const getUniqueTypeIcons = () => {
                const result = []
                const unique = []
                const metadataPolicies = item.value?.metadataPolicies || []
                const dataPolicies = item.value?.dataPolicies || []
                const policies = [...metadataPolicies, ...dataPolicies]
                if (policies.length > 0) {
                    policies
                        .map((policy) => ({
                            connectionId: policy.connectionId,
                            asset: policy.assets[0],
                        }))
                        .forEach(({ asset, connectionId }) => {
                            if (asset.startsWith('default')) {
                                const connectorName = asset.split('/')[1]
                                const imgPath =
                                    getConnectorImageMap.value[connectorName]
                                if (!unique.includes(imgPath)) {
                                    const found = connStore.getList.find(
                                        (conn) => conn.guid === connectionId
                                    )

                                    result.push({
                                        imgPath,
                                        connectorName: `${
                                            asset.split('/').slice(1, 2)[0]
                                        }${
                                            found?.attributes?.name &&
                                            `/${found?.attributes?.name}`
                                        }`,
                                    })
                                    unique.push(imgPath)
                                }
                            }
                        })

                    return result
                }
                return result
            }
            const classifications = computed(() => {
                const arr: any[] = []
                classificationList.value.forEach((cl) => {
                    item.value?.tags?.forEach((name) => {
                        if (name === cl.name) {
                            arr.push({
                                typeName: cl.name,
                                entityGuid: cl.guid,
                                entityStatus: 'ACTIVE',
                                propagate: false,
                                validityPeriods: [],
                                removePropagationsOnEntityDelete: false,
                            })
                        }
                    })
                })
                return arr
            })
            const connections = computed(() => getUniqueTypeIcons())
            const listClassifications = computed(() => {
                const { matchingIdsResult } = mergeArray(
                    classificationList.value,
                    classifications.value,
                    'name',
                    'typeName'
                )

                return matchingIdsResult
            })
            const expandedReadme = () => {
                useAddEvent('governance', activeTab.value, 'readme_expanded', {
                    [`${activeTab.value}_name`]: item.value.name,
                })
            }
            const { list } = useGlossaryStore()
            const glossary = computed(() => {
                if (activeTab.value === 'purpose') {
                    return []
                }
                const glossaryPolicies = item.value?.glossaryPolicies || []
                let glossaries = []
                glossaryPolicies.forEach((glossaryPolicy) => {
                    glossaries = [
                        ...glossaries,
                        ...glossaryPolicy.glossaryQualifiedNames,
                    ]
                })

                const formated = glossaries.map((glossary) =>
                    list.find((item) => item.id === glossary)
                )

                return formated
            })
            const { getEntityStatusIcon } = useGlossaryData()

            return {
                userGroup,
                connections,
                totalAsset,
                getCountString,
                isLoading,
                userGroupPurpose,
                listClassifications,
                expandedReadme,
                glossary,
                getEntityStatusIcon,
                certificateStatus,
            }
        },
    })
</script>

<style lang="less" scoped>
    .shadow-connection {
        box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.05);
    }
</style>
