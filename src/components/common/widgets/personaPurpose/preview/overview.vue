<template>
    <div class="p-5">
        <div class="flex items-center text-sm font-bold text-gray-600">
            <AtlanIcon icon="Overview" class="mb-1 mr-2" />Overview
        </div>
        <div class="flex mt-6">
            <div class="flex-1">
                <div class="text-gray-600">User and Groups</div>
                <div
                    v-if="activeTab === 'persona'"
                    class="mt-2 text-sm font-bold text-primary"
                >
                    {{ userGroup }}
                </div>

                <div
                    v-if="activeTab === 'purpose'"
                    class="mt-2 text-sm font-bold text-primary"
                >
                    {{ userGroupPurpose }}
                </div>
            </div>
            <div class="flex-1">
                <div class="text-gray-600">Assets</div>
                <div v-if="isLoading"><AtlanLoader class="w-4 h-4" /></div>
                <div v-else class="mt-2 text-sm font-bold text-primary">
                    {{ getCountString(totalAsset) }}
                </div>
            </div>
        </div>
        <div class="mt-7">
            <div class="text-gray-600">Description</div>
            <div class="mt-2 text-base text-gray-800">
                {{ item.description || 'No description' }}
            </div>
        </div>
        <div v-if="activeTab === 'purpose'" class="mt-7">
            <div class="text-gray-600">Classifications</div>
            <div
                v-if="!listClassifications.length"
                class="mt-2 text-sm text-gray-800"
            >
                No classification attached
            </div>
            <div v-else class="flex gap-2 mt-2">
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
            <div class="text-gray-600">Connections</div>
            <div class="flex flex-col gap-2 p-2 mt-2 bg-gray-100 rounded-lg">
                <div
                    v-for="connection in connections"
                    :key="connection?.connectorName"
                    class="bg-white rounded-lg px-2.5 py-1.5 text-sm text-gray-800 flex"
                >
                    <img class="w-4 h-4 mr-2" :src="connection?.imgPath" />
                    {{ connection?.connectorName }}
                </div>
                <div v-if="!connections?.length" class="text-sm text-gray-600">
                    No connection
                </div>
            </div>
        </div>
        <div class="mt-7">
            <div class="text-gray-600">Readme</div>
            <ReadmeView :max-height="180" :readme="item.readme" />
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, computed, toRefs, ref } from 'vue'

    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import { useDiscoverList } from '~/composables/discovery/useDiscoverList'
    import { getCountString } from '~/utils/number'
    import ReadmeView from '~/components/common/readmeView/index.vue'
    import { mergeArray } from '~/utils/array'
    import useTypedefData from '~/composables/typedefs/useTypedefData'
    import ClassificationPill from '@/common/pills/classification.vue'
    import Popover from '@/common/popover/classification/index.vue'

    export default defineComponent({
        name: 'PersonaPurposeOverview',
        components: { ReadmeView, ClassificationPill, Popover },
        props: {
            item: {
                type: Object,
                required: true,
            },
            globalState: {
                type: Array,
                required: true,
            },
            activeTab: {
                type: String,
                required: true,
            },
        },
        emits: [],
        setup(props) {
            const { classificationList } = useTypedefData()
            const { item, globalState, activeTab } = toRefs(props)
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
            // const globalState = ref(['persona', item.value.id])
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
            const { getConnectorImageMap } = useAssetInfo()
            const userGroupPurpose = computed(() => {
                let userPurposes = []
                let groupPurposes = []
                const { metadataPolicies, dataPolicies } = item.value
                dataPolicies?.forEach((el) => {
                    userPurposes = [...userPurposes, ...el.users]
                    groupPurposes = [...groupPurposes, ...el.groups]
                })
                metadataPolicies?.forEach((el) => {
                    userPurposes = [...userPurposes, ...el.users]
                    groupPurposes = [...groupPurposes, ...el.groups]
                })
                if (
                    !userPurposes.includes('all-users') &&
                    userPurposes.length
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
                if (userPurposes.includes('all-users')) {
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
            const getUniqueTypeIcons = () => {
                const result = []
                const unique = []
                const metadataPolicies = item.value?.metadataPolicies || []
                const dataPolicies = item.value?.dataPolicies || []
                const policies = [...metadataPolicies, ...dataPolicies]
                if (policies.length > 0) {
                    policies
                        .map((policy) => policy.assets[0])
                        .forEach((asset) => {
                            if (asset.startsWith('default')) {
                                const connectorName = asset.split('/')[1]
                                const imgPath =
                                    getConnectorImageMap.value[connectorName]
                                if (!unique.includes(imgPath)) {
                                    result.push({
                                        imgPath,
                                        connectorName,
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
            return {
                userGroup,
                connections,
                totalAsset,
                getCountString,
                isLoading,
                userGroupPurpose,
                listClassifications,
            }
        },
    })
</script>

<style lang="less"></style>
