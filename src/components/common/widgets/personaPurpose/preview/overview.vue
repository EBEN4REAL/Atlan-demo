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
            <ReadmeView :readme="item.readme" />
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, computed, toRefs, ref } from 'vue'

    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import { useDiscoverList } from '~/composables/discovery/useDiscoverList'
    import { getCountString } from '~/utils/number'
    import ReadmeView from '~/components/common/readmeView/index.vue'

    export default defineComponent({
        name: 'PersonaPurposeOverview',
        components: { ReadmeView },
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
            const { item, globalState, activeTab } = toRefs(props)
            const aggregations = ref(['typeName'])
            const limit = ref(1)
            const offset = ref(0)
            // const globalState = ref(['persona', item.value.id])
            const { fetch, isLoading, assetTypeAggregationList } =
                useDiscoverList({
                    isCache: false,
                    limit,
                    offset,
                    aggregations,
                    globalState,
                    facets:
                        activeTab.value === 'purpose'
                            ? {
                                  __traitNames: {
                                      classifications: item.value.tags,
                                  },
                              }
                            : {},
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
            const connections = computed(() => getUniqueTypeIcons())
            return {
                userGroup,
                connections,
                totalAsset,
                getCountString,
                isLoading,
                userGroupPurpose,
            }
        },
    })
</script>

<style lang="less"></style>
