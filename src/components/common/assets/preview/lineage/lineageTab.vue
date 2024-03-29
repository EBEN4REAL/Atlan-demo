<template>
    <div class="flex flex-col h-full" style="height: calc(100% - 84px)">
        <LineageImpactModal
            v-if="guid"
            :key="guid"
            v-model:visible="showImpactedAssets"
            :guid="guid"
            :is-base-on-graph="false"
            style="z-index: 600"
        />
        <div class="flex items-center justify-between px-5 pt-4 pb-2">
            <span class="flex items-center">
                <PreviewTabsIcon
                    :icon="tab.icon"
                    :image="tab.image"
                    :emoji="tab.emoji"
                    height="h-4"
                    class="mb-0.5"
                />
                <span class="ml-1 font-semibold text-gray-500">Lineage</span>
            </span>

            <template
                v-if="
                    !['Process', 'ColumnProcess', 'BIProcess'].includes(
                        selectedAsset.typeName
                    )
                "
            >
                <div
                    class="flex items-center cursor-pointer text-primary"
                    v-if="isWithGraph"
                    @click="showImpactedAssets = true"
                    :disabled="!allEntities?.downstream?.length"
                >
                    <AtlanIcon icon="External" class="mr-1" /> Download Impact
                </div>

                <router-link v-else :to="getLineagePath(selectedAsset)">
                    <div class="flex items-center cursor-pointer text-primary">
                        <AtlanIcon icon="External" class="mr-1" /> View Graph
                    </div>
                </router-link>
            </template>
        </div>

        <RaisedTab
            v-model:active="direction"
            class="mx-5 mt-0"
            :data="streams"
        />

        <LineageList v-if="computedAssets.length" :assets="computedAssets" />
        <div
            v-else-if="isUpLoading || isDownLoading"
            class="flex items-center justify-center flex-grow"
        >
            <AtlanLoader class="h-10" />
        </div>
        <ErrorView v-else-if="!isUpReady || !isDownReady" />
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

    import EmptyView from '@common/empty/index.vue'
    import ErrorView from '@common/error/discover.vue'
    import RaisedTab from '@/UI/raisedTab.vue'
    import LineageImpactModal from './lineageImpactModal.vue'
    import LineageList from './list/index.vue'

    // Types
    import { assetInterface } from '~/types/assets/asset.interface'
    import { MinimalAttributes } from '~/constant/projection'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'

    // Services
    import useLineageService from '~/services/meta/lineage/lineage_service'
    import PreviewTabsIcon from '~/components/common/icon/previewTabsIcon.vue'
    import useAssetStore from '~/store/asset'

    export default defineComponent({
        name: 'LineagePreviewTab',
        components: {
            LineageList,
            EmptyView,
            LineageImpactModal,
            RaisedTab,
            ErrorView,
            PreviewTabsIcon,
        },
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
            tab: {
                type: Object,
                required: false,
            },
        },
        setup(props) {
            /** DATA */
            const { selectedAsset } = toRefs(props)
            const showImpactedAssets = ref(false)
            const { getLineagePath } = useAssetInfo()
            const assetTypesLengthMap = ref({})

            const route = useRoute()

            const { useFetchLineage } = useLineageService()

            const depth = ref(1)
            const query = ref('')

            const filters = ref(['Table', 'View', 'Column', 'Bi Dashboard'])

            const direction = ref('BOTH')

            /** COMPUTED */
            const guid = computed(() => selectedAsset.value.guid)
            const assetName = computed(
                () =>
                    selectedAsset.value.displayText ||
                    selectedAsset.value.attributes.name
            )

            const discoveryStore = useAssetStore()

            const processPreference = computed(() => {
                if (discoveryStore?.preferences?.displayProcess) {
                    return discoveryStore?.preferences?.displayProcess
                }
                return false
            })

            const defaultLineageConfig = computed(() => ({
                depth: depth.value,
                guid: guid.value,
                hideProcess: ['Process', 'ColumnProcess', 'BIProcess'].includes(
                    selectedAsset.value.typeName
                )
                    ? false
                    : !processPreference.value,
                allowDeletedProcess: false,
                entityFilters: {
                    attributeName: '__state',
                    operator: 'eq',
                    attributeValue: 'ACTIVE',
                },
                attributes: MinimalAttributes,
            }))

            const {
                data: UpStreamLineage,
                isLoading: isUpLoading,
                isReady: isUpReady,
                mutate: mutateUpstream,
            } = useFetchLineage(
                computed(() => ({
                    ...defaultLineageConfig.value,
                    direction: 'INPUT',
                })),
                true
            )

            const {
                data: DownStreamLineage,
                isLoading: isDownLoading,
                isReady: isDownReady,
                mutate: mutateDownstream,
            } = useFetchLineage(
                computed(() => ({
                    ...defaultLineageConfig.value,
                    direction: 'OUTPUT',
                })),
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
                    label: ['Process', 'ColumnProcess', 'BIProcess'].includes(
                        selectedAsset.value.typeName
                    )
                        ? 'Inputs'
                        : 'Upstream',
                    count: allEntities.value.upstream.length,
                },
                {
                    key: 'DOWNSTREAM',
                    label: ['Process', 'ColumnProcess', 'BIProcess'].includes(
                        selectedAsset.value.typeName
                    )
                        ? 'Output'
                        : 'Downstream',
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
            provide('currentDepth', depth)
            provide('updateFilters', updateFilters)
            provide('assetTypesLengthMap', assetTypesLengthMap)

            /** WATCHERS */
            watch([depth, guid, processPreference], () => {
                mutateUpstream()
                mutateDownstream()
            })

            /** LIFECYCLE */
            return {
                guid,
                assetName,
                query,
                assetTypesLengthMap,
                streams,
                direction,
                depth,
                getLineagePath,
                showImpactedAssets,
                isWithGraph,
                allEntities,
                computedAssets,
                isUpLoading,
                isDownLoading,
                isUpReady,
                isDownReady,
                UpStreamLineage,
                DownStreamLineage,
            }
        },
    })
</script>
