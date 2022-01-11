<template>
    <div class="flex flex-col h-full" style="height: calc(100% - 84px)">
        <LineageImpactModal
            v-if="guid"
            v-model:visible="showImpactedAssets"
            :guid="guid"
            :asset-name="assetName"
            style="z-index: 600"
        />
        <div class="flex items-center justify-between px-5 pt-4">
            <a-radio-group
                v-model:value="direction"
                button-style="solid"
                size="small"
                @change="handleChangeDirection"
            >
                <a-radio-button value="BOTH" size="small">All</a-radio-button>
                <a-radio-button value="UPSTREAM" size="small"
                    >Upstream
                    <span :class="$style.chip">{{
                        upstreamGuids?.length
                    }}</span>
                </a-radio-button>
                <a-radio-button value="DOWNSTREAM" size="small"
                    >Downstream
                    <span :class="$style.chip">{{
                        downstreamGuids?.length
                    }}</span></a-radio-button
                >
            </a-radio-group>
            <!-- <a-button-group>
                <a-tooltip title="View Impact">
                    <a-button
                        class="flex items-center justify-center"
                        @click="showImpactedAssets = true"
                    >
                        <AtlanIcon icon="ImpactedAssets" />
                    </a-button>
                </a-tooltip>
                <a-tooltip title="View Graph">
                    <a-button class="flex items-center justify-center">
                        <router-link :to="link">
                            <AtlanIcon icon="Minimap" />
                        </router-link>
                    </a-button>
                </a-tooltip>
            </a-button-group> -->
            <router-link :to="link" class="underline text-primary"
                >View Graph</router-link
            >
        </div>
        <Assets
            v-if="selectedGuids.length > 0"
            :selectedGuids="selectedGuids"
            ref="assetList"
        ></Assets>
        <div v-else class="flex items-center justify-center h-full">
            <EmptyView
                empty-screen="EmptyLineageTab"
                desc="Lineage hasn't been generated yet for this asset!"
            ></EmptyView>
        </div>
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
    // import SearchAndFilter from '@/common/input/searchAndFilter.vue'
    // import AssetList from './LineagePreviewTabAssetList.vue'
    // import Preferences from './preferences.vue'

    // import SearchAdvanced from '@/common/input/searchAdvanced.vue'
    // import AggregationTabs from '@/common/tabs/aggregationTabs.vue'
    // import PreferenceSelector from '@/assets/preference/index.vue'

    // import AssetFilters from '@/common/assets/filters/index.vue'
    // import AssetList from '@/common/assets/list/index.vue'
    // import AssetItem from '@/common/assets/list/assetItem.vue'
    import EmptyView from '@common/empty/index.vue'
    import AtlanButton from '@/UI/button.vue'
    import LineageImpactModal from './lineageImpactModal.vue'
    import Assets from './list/index.vue'

    // Types
    import { assetInterface } from '~/types/assets/asset.interface'

    // Services
    import useLineageService from '~/services/meta/lineage/lineage_service'
    import useLineage from '~/composables/discovery/useLineage'
    import { useRoute } from 'vue-router'

    export default defineComponent({
        name: 'LineagePreviewTab',
        components: {
            Assets,
            EmptyView,
            AtlanButton,
            LineageImpactModal,
        },
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
            const showImpactedAssets = ref(false)

            const assetTypesLengthMap = ref({})

            const route = useRoute()

            // const path = computed(() => {
            //     console.log(route)
            //     return route.path
            // })

            const depth = ref(1)
            const query = ref('')
            const assetList = ref(null)

            const filters = ref(['Table', 'View', 'Column', 'Bi Dashboard'])

            const direction = ref('BOTH')

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

            const link = computed(() => {
                const baseUrl = window.location.origin
                const text = `/assets/${guid.value}/lineage`
                return text
            })

            /** COMPUTED */
            const guid = computed(() => selectedAsset.value.guid)
            const assetName = computed(
                () =>
                    selectedAsset.value.displayText ||
                    selectedAsset.value.attributes.name
            )

            const { data, guidList, upstreamGuids, downstreamGuids } =
                useLineage(
                    guid.value,
                    {
                        depth: depth.value,
                        direction: direction.value,
                        hideProcess: true,
                    },
                    guid
                )

            const selectedGuids = ref([])

            watch(data, () => {
                // console.log(guidList.value)
                selectedGuids.value = guidList.value.filter(
                    (guid) => guid !== selectedAsset.value.guid
                )

                // initialFilters.value = {
                //     guidList: guidList.value,
                // }
                // if (assetList.value) {
                //     assetList.value.forceFilterChange(initialFilters.value)
                // }
            })

            const handleChangeDirection = () => {
                console.log(
                    direction,
                    guidList,
                    upstreamGuids.value,
                    downstreamGuids.value
                )
                if (direction.value === 'UPSTREAM') {
                    console.log(upstreamGuids.value, selectedAsset.value.guid)
                    console.log(
                        upstreamGuids.value.filter(
                            (guid) => guid !== selectedAsset.value.guid
                        )
                    )
                    selectedGuids.value = upstreamGuids.value.filter(
                        (guid) => guid !== selectedAsset.value.guid
                    )
                } else if (direction.value === 'DOWNSTREAM') {
                    console.log(downstreamGuids.value, selectedAsset.value.guid)
                    console.log(
                        downstreamGuids.value.filter(
                            (guid) => guid !== selectedAsset.value.guid
                        )
                    )
                    selectedGuids.value = downstreamGuids.value.filter(
                        (guid) => guid !== selectedAsset.value.guid
                    )
                } else {
                    selectedGuids.value = guidList.value.filter(
                        (guid) => guid !== selectedAsset.value.guid
                    )
                }
            }

            // computed(() => ({
            //     depth: depth.value,
            //     guid: guid.value,
            //     direction: 'INPUT',
            // }))
            // const { data: downStreamData } = useLineage(
            //     guid.value,
            //     {
            //         depth: depth.value,
            //         direction: 'OUTPUT',
            //         hideProcess: true,
            //     },
            //     guid
            // )
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
                assetName,
                query,
                filteredLineageList,
                assetTypesLengthMap,
                activeKeys,
                streams,
                totalCount,
                placeholderText,
                isLoading,
                selectedGuids,
                guidList,
                assetList,
                direction,
                handleChangeDirection,
                upstreamGuids,
                downstreamGuids,
                link,
                showImpactedAssets,
            }
        },
    })
</script>

<style lang="less" module>
    .chip {
        @apply self-center text-xs font-bold tracking-wide ml-0;
    }
    :global(.ant-radio-button-wrapper) {
        @apply text-gray-500 inline-flex items-center;
    }
    :global(.ant-radio-button-wrapper-checked) {
        .chip {
            @apply text-white;
        }
    }
</style>
