<template>
    <div class="p-5">
        <div class="flex items-center text-sm font-bold text-gray-600">
            <AtlanIcon icon="Overview" class="mb-1 mr-2" />Overview
        </div>
        <div class="flex mt-6">
            <div class="flex-1">
                <div class="text-gray-600">User and Groups</div>
                <div class="mt-2 text-sm font-bold text-primary">
                    {{ userGroup }}
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
        <div class="mt-7">
            <div class="text-gray-600">Connections</div>
            <div class="flex flex-col gap-2 p-2 mt-2 bg-gray-100 rounded-lg">
                <div
                    v-for="con in connection"
                    :key="con.connectorName"
                    class="bg-white rounded-lg px-2.5 py-1.5 text-sm text-gray-800 flex"
                >
                    <img class="w-4 h-4 mr-2" :src="con.imgPath" />
                    {{ con.connectorName }}
                </div>
                <div v-if="!connection.length" class="text-sm text-gray-600">
                    No connection
                </div>
            </div>
        </div>
        <div class="mt-7">
            <div class="text-gray-600">Readme</div>
            <div class="p-4 bg-gray-100 rounded-lg">
                <div v-if="!item.readme" class="text-sm text-gray-600">
                    No readme
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, computed, toRefs, ref } from 'vue'

    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import { useDiscoverList } from '~/composables/discovery/useDiscoverList'
    import { getCountString } from '~/utils/number'

    export default defineComponent({
        name: 'PersonaOverview',
        components: {},
        props: {
            item: {
                type: Object,
                required: true,
            },
        },
        emits: [],
        setup(props) {
            const { item } = toRefs(props)
            console.log('this', item)
            const aggregations = ref(['typeName'])
            const limit = ref(1)
            const offset = ref(0)
            const globalState = ref(['persona', item.value.id])
            const { fetch, isLoading, assetTypeAggregationList } =
                useDiscoverList({
                    isCache: false,
                    limit,
                    offset,
                    aggregations,
                    globalState,
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
            const connection = computed(() => getUniqueTypeIcons())
            return {
                userGroup,
                connection,
                totalAsset,
                getCountString,
                isLoading,
            }
        },
    })
</script>

<style lang="less"></style>
