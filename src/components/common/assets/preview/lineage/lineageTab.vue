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
            <span class="text-base font-bold text-gray-500">Lineage</span>

            <AtlanButton
                v-if="isWithGraph"
                size="sm"
                padding="compact"
                color="minimal"
                class="text-primary"
                :disabled="!downstreamGuids?.length"
                @click="showImpactedAssets = true"
            >
                <AtlanIcon icon="Download" />
                Download Impact
            </AtlanButton>

            <router-link v-else :to="link">
                <AtlanButton
                    size="sm"
                    padding="compact"
                    color="minimal"
                    class="text-primary"
                >
                    <AtlanIcon icon="External" />
                    View Graph
                </AtlanButton>
            </router-link>
        </div>

        <RaisedTab
            v-model:active="direction"
            class="mx-5 mt-4"
            :data="streams"
        />

        <LineageList v-if="computedAssets.length" :assets="computedAssets" />

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
    import { useRoute } from 'vue-router'

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
    import RaisedTab from '@/UI/raisedTab.vue'
    import AtlanButton from '@/UI/button.vue'
    import LineageImpactModal from './lineageImpactModal.vue'
    import LineageList from './list/index.vue'

    // Types
    import { assetInterface } from '~/types/assets/asset.interface'
    import { AssetAttributes, SQLAttributes } from '~/constant/projection'

    // Services
    import useLineageService from '~/services/meta/lineage/lineage_service'

    export default defineComponent({
        name: 'LineagePreviewTab',
        components: {
            LineageList,
            EmptyView,
            AtlanButton,
            LineageImpactModal,
            RaisedTab,
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
            const showImpactedAssets = ref(false)

            const assetTypesLengthMap = ref({})

            const route = useRoute()

            const { useFetchLineage } = useLineageService()

            const depth = ref(21)
            const query = ref('')

            const filters = ref(['Table', 'View', 'Column', 'Bi Dashboard'])

            const direction = ref('BOTH')

            const link = computed(() => {
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

            const defaultLineageConfig = {
                depth: depth.value,
                guid: guid.value,
                hideProcess: true,
                attributes: [...AssetAttributes, ...SQLAttributes],
            }

            const { data: UpStreamLineage, isLoading: isUpLoading } =
                useFetchLineage(
                    { ...defaultLineageConfig, direction: 'INPUT' },
                    true
                )

            const { data: DownStreamLineage, isLoading: isDownLoading } =
                useFetchLineage(
                    { ...defaultLineageConfig, direction: 'OUTPUT' },
                    true
                )

            // useComputeGraph
            const allEntities = computed(() => ({
                upstream: Object.values(
                    UpStreamLineage.value?.guidEntityMap || {}
                ).filter((a) => a.guid !== guid.value),
                downstream: Object.values(
                    DownStreamLineage.value?.guidEntityMap || {}
                ).filter((a) => a.guid !== guid.value),
            }))

            const streams = computed(() => [
                {
                    key: 'BOTH',
                    label: 'All',
                },
                {
                    key: 'UPSTREAM',
                    label: 'Upstream',
                    count: allEntities.value.upstream.length,
                },
                {
                    key: 'DOWNSTREAM',
                    label: 'Downstream',
                    count: allEntities.value.downstream.length,
                },
            ])

            const computedAssets = computed(() => {
                switch (direction.value) {
                    case 'BOTH':
                        return [
                            ...allEntities.value.upstream,
                            ...allEntities.value.downstream,
                        ]
                    case 'UPSTREAM':
                        return allEntities.value.upstream
                    case 'DOWNSTREAM':
                        return allEntities.value.downstream
                    default:
                        return []
                }
            })

            const isWithGraph = computed(() => route.params?.tab === 'lineage')

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
                assetTypesLengthMap,
                streams,
                direction,
                link,
                showImpactedAssets,
                isWithGraph,
                allEntities,
                computedAssets,
            }
        },
    })
</script>
