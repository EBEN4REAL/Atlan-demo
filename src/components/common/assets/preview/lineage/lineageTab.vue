<template>
    <div>
        <div class="flex items-center justify-between px-5 my-3 gap-x-2">
            <SearchAndFilter
                v-model="query"
                class="flex-grow"
                :placeholder="placeholderText"
                :autofocus="true"
            >
                <template #filter> <Preferences /> </template>
            </SearchAndFilter>
            <router-link
                :to="`/assets/${guid}/lineage`"
                class="w-24 text-xs underline group"
                @click="$event.stopPropagation()"
                >Graph view
                <AtlanIcon
                    icon="External"
                    class="cursor-pointer group-hover:text-primary"
                />
            </router-link>
        </div>
        <a-collapse
            v-model:activeKey="activeKeys"
            :bordered="false"
            :class="$style.filter"
            expand-icon-position="right"
            class="bg-transparent"
        >
            <template #expandIcon="{ isActive }">
                <div class=""></div>
            </template>
            <a-collapse-panel
                v-for="stream in streams"
                :key="stream.key"
                class="bg-transparent"
            >
                <template #header>
                    <div
                        class="flex items-center text-sm font-bold select-none header"
                    >
                        {{ stream.name }}

                        <span class="chip">{{
                            filteredLineageList[stream.key]?.length || 0
                        }}</span>
                    </div>
                </template>

                <div
                    v-if="isLoading[stream.key]"
                    class="flex items-center justify-center px-5 py-4 mt-4"
                >
                    <a-spin size="small" class="mr-2 leading-none" />
                    <span class="text-sm leading-none">
                        Getting lineage data
                    </span>
                </div>
                <AssetList
                    v-else-if="
                        filteredLineageList[stream.key] &&
                        filteredLineageList[stream.key].length > 0
                    "
                    :lineage-list="filteredLineageList[stream.key]"
                />
                <div v-else class="flex flex-col">
                    <AtlanIcon icon="EmptyDiscover" class="w-auto h-32" />
                    <div class="mt-4 text-sm text-center text-gray">
                        No assets found in {{ stream.name }}
                    </div>
                </div>
            </a-collapse-panel>
        </a-collapse>
    </div>
</template>

<script lang="ts">
    // Vue
    import {
        defineComponent,
        ref,
        Ref,
        toRefs,
        watch,
        provide,
        computed,
        PropType,
    } from 'vue'

    // Components
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'
    import AssetList from './LineagePreviewTabAssetList.vue'
    import Preferences from './preferences.vue'

    // Types
    import { assetInterface } from '~/types/assets/asset.interface'

    // Services
    import useLineageService from '~/services/meta/lineage/lineage_service'
    import useLineage from '~/composables/discovery/useLineage'

    export default defineComponent({
        name: 'LineagePreviewTab',
        components: { AssetList, Preferences, SearchAndFilter },
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        setup(props) {
            /** DATA */
            const { selectedAsset } = toRefs(props)
            const activeKeys = ref([])

            const assetTypesLengthMap = ref({})

            const depth = ref(1)
            const query = ref('')

            const filters = ref(['Table', 'View', 'Column', 'Bi Dashboard'])

            const streams = [
                {
                    key: 'upstream',
                    name: 'Upstream',
                },
                {
                    key: 'downstream',
                    name: 'Downstream',
                },
            ]

            /** COMPUTED */
            const guid = computed(() => selectedAsset.value.guid)

            const { data: upstreamData } = useLineage(guid.value)
            // computed(() => ({
            //     depth: depth.value,
            //     guid: guid.value,
            //     direction: 'INPUT',
            // }))
            const { data: downStreamData } = useLineage(guid.value)
            // computed(() => ({
            //     depth: depth.value,
            //     guid: guid.value,
            //     direction: 'OUTPUT',
            // }))

            // useComputeGraph
            const allEntities = computed(() => ({
                // upstream: Object.values(data.value.guidEntityMap.value),
                // downstream: Object.values(
                //     DownStreamLineage.guidEntityMap.value
                // ),
            }))

            const filteredLineageList = computed(() => {
                const lineageMap = {}
                // Object.entries(allEntities.value).forEach(
                //     ([key, assetList]) => {
                //         lineageMap[key] = assetList.filter((et) =>
                //             et.displayText
                //                 .toLowerCase()
                //                 .includes(query.value.toLowerCase())
                //         )
                //     }
                // )
                return lineageMap
            })

            const totalCount = computed(() =>
                Object.values(allEntities.value).reduce(
                    (acc, assetList) => assetList.length + acc,
                    0
                )
            )

            const placeholderText = computed(() => {
                // if (
                //     UpStreamLineage.isLoading.value ||
                //     DownStreamLineage.isLoading.value
                // )
                return 'Loading lineage'

                // return totalCount.value
                //     ? `Search ${totalCount.value} assets`
                //     : 'No assets found'
            })

            const isLoading = computed(() => ({
                // upstream: UpStreamLineage.isLoading.value,
                // downstream: DownStreamLineage.isLoading.value,
            }))

            /** METHODS */
            const updateDepth = (val: number) => {
                depth.value = val
            }
            const updateFilters = (val: Ref<string[]>) => {
                filters.value = val.value
            }

            /** PROVIDERS */
            provide('updateDepth', updateDepth)
            provide('updateFilters', updateFilters)
            provide('assetTypesLengthMap', assetTypesLengthMap)

            /** WATCHERS */
            // watch([depth, guid], () => {
            //     console.log('lineage mutate')
            //     UpStreamLineage.mutate()
            //     DownStreamLineage.mutate()
            // })

            /** LIFECYCLE */
            return {
                guid,
                query,
                filteredLineageList,
                assetTypesLengthMap,
                activeKeys,
                streams,
                totalCount,
                placeholderText,
                isLoading,
            }
        },
    })
</script>

<style scoped>
    .chip {
        @apply px-1 pt-1 pb-0.5 mr-1 ml-3 rounded tracking-wide text-xs font-bold text-primary bg-primary-light;
    }
    :global(.ant-tabs .ant-tabs-right-content) {
        @apply pr-0 !important;
    }
</style>
<style lang="less" module>
    .filter {
        :global(.ant-collapse-item) {
            @apply border-b;
            @apply border-gray-300;
        }

        :global(.ant-collapse-header) {
            @apply px-5 !important;
            @apply py-4 !important;
        }

        :global(.ant-collapse-arrow) {
            font-size: 0.85rem !important;
            right: 20px !important;
        }

        :global(.ant-collapse-content-box) {
            padding-right: 0px;
            padding-left: 0px;
            padding-top: 0px !important;
            @apply pb-4 !important;
        }
    }
</style>
