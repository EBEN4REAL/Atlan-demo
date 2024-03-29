<template>
    <LineageImpactModal
        v-if="guidForImpactedAssets"
        :key="guidForImpactedAssets"
        v-model:visible="showImpactedAssets"
        :guid="guidForImpactedAssets"
        :is-base-on-graph="false"
        style="z-index: 600"
    />
    <div class="flex flex-col">
        <div class="flex items-center">
            <div class="flex items-center h-9">
                <div
                    class="mx-4 cursor-pointer"
                    @click="showSearch = !showSearch"
                >
                    <a-tooltip placement="bottom" :mouse-enter-delay="0.4">
                        <template #title>
                            <span>search graph</span>
                        </template>
                        <AtlanIcon
                            icon="Search"
                            class="outline-none"
                        ></AtlanIcon>
                    </a-tooltip>
                </div>
                <div class="w-px bg-new-gray-200 h-9"></div>
                <div class="mx-4 cursor-pointer" @click="controlImpactedAssets">
                    <a-tooltip placement="bottom" :mouse-enter-delay="0.4">
                        <template #title>
                            <span> View Impacted Assets </span>
                        </template>
                        <AtlanIcon
                            icon="ImpactedAssets"
                            class="outline-none text-new-blue-400"
                        ></AtlanIcon>
                    </a-tooltip>
                </div>
            </div>

            <div v-if="showSearch" class="search">
                <!-- Search Input -->
                <a-input
                    ref="searchBar"
                    class="search-input"
                    :value="query"
                    :enter-button="null"
                    :suffix="null"
                    :placeholder="`Search ${searchItems?.length} assets`"
                    allow-clear
                    @change="setQuery"
                    @blur="onBlur"
                    @focus="onFocus"
                    @keyup.esc="onEsc"
                />
            </div>
        </div>

        <!-- Search Results -->
        <div v-if="showResults && query" class="search-results">
            <div v-if="filteredItems.length" class="search-results__count">
                {{ filteredItems.length }} results found
            </div>
            <div v-else class="flex flex-col items-center p-10">
                <NoResultIllustration />
                <span class="text-sm text-center text-gray"
                    >Sorry, we couldn't find the asset you were looking for
                </span>
            </div>

            <AssetItem
                v-for="(item, index) in filteredItems"
                :key="index"
                :class="{ selected: searchItem === item.guid }"
                :item="item"
                class="search-results__item"
                disable-links
                @click="setSearchItem(item, index)"
            ></AssetItem>
        </div>
    </div>
</template>

<script lang="ts">
    /** VUE */
    import {
        defineComponent,
        Ref,
        ref,
        inject,
        computed,
        watch,
        nextTick,
        onMounted,
    } from 'vue'
    import { useDebounceFn, whenever } from '@vueuse/core'

    /** UTILS */
    import { getNodeSourceImage, getSource } from './util'

    /** COMPOSABLES */
    import useAddEvent from '~/composables/eventTracking/useAddEvent'

    /** COMPONENTS */
    import AssetItem from '@/common/assets/preview/lineage/list/assetItem.vue'
    import NoResultIllustration from '~/assets/images/illustrations/Illustration_no_search_results.svg'
    import LineageImpactModal from '@/common/assets/preview/lineage/lineageImpactModal.vue'

    /** STORE */
    import useLineageStore from '~/store/lineage'
    import useAssetStore from '~/store/asset'

    export default defineComponent({
        name: 'LineageSearch',
        components: { AssetItem, NoResultIllustration, LineageImpactModal },
        emits: ['select'],
        setup(_, { emit }) {
            /** INITIALIZE */
            const lineageStore = useLineageStore()
            const assetStore = useAssetStore()

            /** DATA */
            const query = ref('')
            const searchItem = ref('')
            const showResults = ref(false)
            const searchBar: Ref<null | HTMLInputElement> = ref(null)
            const showSearch = ref(false)
            const hasImpactedAssets = ref(false)
            const showImpactedAssets = ref(false)

            /** INJECTIONS */
            const onSelectAsset = inject('onSelectAsset')

            /** COMPUTED */
            const mergedLineageData = computed(() =>
                lineageStore.getMergedLineageData()
            )
            const baseEntityGuid = computed(
                () => assetStore.getSelectedAsset.guid
            )
            const selectedNodeId = computed(() =>
                lineageStore.getSelectedNodeId()
            )
            const selectedPortId = computed(() =>
                lineageStore.getSelectedPortId()
            )
            const guidForImpactedAssets = computed(() =>
                !selectedPortId.value
                    ? selectedNodeId.value || baseEntityGuid.value
                    : selectedPortId.value
            )
            const isBaseOnGraph = computed(
                () => baseEntityGuid.value === guidForImpactedAssets.value
            )
            const searchItems = computed(() => {
                const d = mergedLineageData.value
                const g = d.guidEntityMap
                const v = Object.values(g)

                return v
            })
            const filteredItems = computed(() => {
                if (!query.value) return []
                return searchItems.value.filter((i) => {
                    if (i.typeName.includes('vpNode')) return false
                    return (i?.displayText || i?.attributes.name)
                        ?.toLowerCase()
                        ?.includes(query.value.toLowerCase())
                })
            })

            /** METHODS */

            /** EVENT DEFINITION */
            // searchEvent
            const sendSearchEvent = useDebounceFn(() => {
                useAddEvent('lineage', 'search', 'changed', {
                    result_count: filteredItems.value.length,
                    search_query: query.value.toLowerCase(),
                })
            }, 600)

            // sendSearchResultClickEvent
            const sendSearchResultClickEvent = useDebounceFn((item, index) => {
                useAddEvent('lineage', 'search_result', 'clicked', {
                    click_index: index,
                    result_count: filteredItems.value.length,
                    asset_type: item.typeName?.toLowerCase(),
                    connector:
                        item.attributes?.connectorName ||
                        item.attributes?.qualifiedName?.split('/')[1],
                })
            }, 600)

            // ImpactAnalysisReportClickedEvent - Analytics Events
            const sendImpactAnalysisClickedEvent = useDebounceFn(
                (node_id, asset_type, connector) => {
                    useAddEvent(
                        'lineage',
                        'impact_analysis_report',
                        'clicked',
                        {
                            node_id,
                            asset_type,
                            connector,
                        }
                    )
                },
                400
            )

            // setQuery
            const setQuery = (e) => {
                // Handle Event - lineage_search_changed
                query.value = e.target.value

                if (e.target.value) sendSearchEvent()
            }

            // setSearchItem
            const setSearchItem = (item, index) => {
                // Handle Event - lineage_search_result_clicked
                sendSearchResultClickEvent(item, index)

                searchItem.value = item.guid
                onSelectAsset(item, true)
                emit('select', item.guid)
            }

            // onBlur
            const onBlur = () => {
                setTimeout(() => {
                    showResults.value = false
                }, 500)

                if (!query.value) showSearch.value = false
            }

            // onFocus
            const onFocus = () => {
                showResults.value = true
            }

            // onEsc
            const onEsc = (e) => {
                e.target.blur()
                showResults.value = false
                showSearch.value = false
            }

            // sourceImg
            const sourceImg = (entity) => {
                const source = getSource(entity)
                return getNodeSourceImage[source]
            }

            // checkImpactedAsset
            // const checkImpactedAsset = () => {
            //     const guid = guidForImpactedAssets.value
            //     const type = !selectedPortId.value ? 'node' : 'port'
            //     const { childrenCounts } =
            //         type === 'node'
            //             ? mergedLineageData.value
            //             : currentPortLineageData.value
            //     const hasDownstreamAssets = childrenCounts[guid].OUTPUT
            //     if (hasDownstreamAssets) hasImpactedAssets.value = true
            //     else hasImpactedAssets.value = false
            // }

            // controlImpactedAssets
            const controlImpactedAssets = () => {
                showImpactedAssets.value = !showImpactedAssets.value

                if (showImpactedAssets.value) {
                    const selectedNode =
                        mergedLineageData.value.guidEntityMap[
                            selectedNodeId.value || baseEntityGuid.value
                        ]

                    // Handle Event - lineage_impact_analysis_report_clicked
                    sendImpactAnalysisClickedEvent(
                        selectedNodeId.value || baseEntityGuid.value,
                        selectedNode?.typeName,
                        selectedNode?.attributes?.qualifiedName?.split('/')[1]
                    )
                }
            }

            /** WATCHERS */
            watch(query, (val) => {
                if (val) showResults.value = true
                else showResults.value = false
            })

            whenever(showSearch, async () => {
                await nextTick()
                searchBar.value?.focus()
            })

            /** LIFECYCLE */

            return {
                query,
                searchItems,
                filteredItems,
                searchItem,
                searchBar,
                showResults,
                showSearch,
                hasImpactedAssets,
                showImpactedAssets,
                selectedNodeId,
                baseEntityGuid,
                guidForImpactedAssets,
                setQuery,
                setSearchItem,
                onBlur,
                onFocus,
                onEsc,
                sourceImg,
                controlImpactedAssets,
                isBaseOnGraph,
            }
        },
    })
</script>

<style lang="less" scoped>
    .search {
        @apply mr-4;
        position: relative;
        z-index: 999;

        &-input {
            width: 13rem !important;
            z-index: 999;
            border: 0 !important;
            padding: 0 !important;
            outline: 0 !important;
            box-shadow: unset !important;
        }

        &-results {
            display: flex;
            flex-direction: column;
            position: absolute;
            background: white;
            width: 100%;
            overflow-y: scroll;
            overflow-x: hidden;
            max-height: 300px;
            border: 1px solid #f1f1f1;
            box-shadow: 0 2rem 2rem rgba(0, 0, 0, 0.08);
            z-index: 999;
            top: 43px;

            &__count {
                padding: 0 16px;
                margin-top: 12px;
                margin-bottom: 3px;
                text-transform: uppercase;
                font-size: 0.8rem;
                opacity: 0.7;
            }

            &__item {
                cursor: pointer;
                &:hover {
                    background: #e7f4ff;
                }
                &.selected {
                    background: #e7f4ff;
                }
            }
        }
    }
</style>
