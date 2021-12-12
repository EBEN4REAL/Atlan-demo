<template>
    <div
        ref="lineageContainer"
        class="relative w-full overflow-hidden hide-scrollbar lineage"
    >
        <div
            v-if="!isComputeDone"
            class="flex items-center justify-center bg-white w-100"
            style="height: 80vh"
        >
            <div>
                <a-spin tip="Rendering graph..." />
            </div>
        </div>

        <a-spin
            v-if="loaderCords.x"
            :style="`position: absolute; left: ${loaderCords.x - 25}px; top: ${
                loaderCords.y - 148
            }px; z-index: 999`"
        />

        <!-- Graph Container -->
        <div style="display: flex">
            <div ref="graphContainer" style="flex: 1"></div>
        </div>
        <!-- Lineage Header -->
        <LineageHeader
            v-if="isComputeDone"
            :base-entity-guid="lineage.baseEntityGuid"
            :highlighted-node="highlightedNode"
            :is-cyclic="false"
            :graph="graph"
            @show-impacted-assets="onShowImpactedAssets($event)"
            @show-add-lineage="onShowAddLineage($event)"
        />

        <!-- Lineage Footer -->
        <LineageFooter
            :graph="graph"
            :lineage-container="lineageContainer"
            :curr-zoom="currZoom"
            :graph-height="graphHeight"
            :graph-width="graphWidth"
            :base-entity-guid="lineage.baseEntityGuid"
            @on-zoom-change="currZoom = $event"
            @on-show-minimap="showMinimap = $event"
        >
            <!-- Minimap Container -->
            <div
                v-show="showMinimap"
                ref="minimapContainer"
                class="minimap"
            ></div>
        </LineageFooter>

        <!-- Impacted Assets -->
        <LineageImpactedAssets
            v-if="graph"
            :visible="showImpactedAssets"
            :graph="graph"
            :guid="highlightedNode"
            style="z-index: 600"
            @cancel="showImpactedAssets = false"
        />

        <!-- Add Lineage -->
        <LineageAdd
            v-if="graph"
            :visible="showAddLineage"
            style="z-index: 600"
            @cancel="showAddLineage = false"
        />
    </div>
</template>

<script lang="ts">
    /** PACKAGES */
    import {
        defineComponent,
        ref,
        onMounted,
        onUnmounted,
        provide,
        toRefs,
        inject,
    } from 'vue'
    /** COMPONENTS */
    import LineageHeader from './lineageHeader.vue'
    import LineageFooter from './lineageFooter.vue'
    import LineageImpactedAssets from './lineageImpactedAssets.vue'
    import LineageAdd from './lineageAdd.vue'
    /** COMPOSABLES */
    import useCreateGraph from './useCreateGraph'
    import useComputeGraph from './useComputeGraph'
    import useEventGraph from './useEventGraph'

    export default defineComponent({
        name: 'LineageGraph',
        components: {
            LineageHeader,
            LineageFooter,
            LineageImpactedAssets,
            LineageAdd,
        },
        props: {
            lineage: {
                type: Object,
                required: true,
            },
        },
        emits: ['preview'],
        setup(props, { emit }) {
            /** INJECTIONS */
            const control = inject('control')
            const showProcess = inject('showProcess')
            const baseEntity = inject('baseEntity')
            const selectedAsset = inject('selectedAsset')

            /** DATA */
            const { lineage } = toRefs(props)
            const graphHeight = ref(0)
            const graphWidth = ref(0)
            const removedNodes = ref([])
            const graphContainer = ref(null)
            const minimapContainer = ref(null)
            const lineageContainer = ref(null)
            const graph = ref(null)
            const graphLayout = ref({})
            const showImpactedAssets = ref(false)
            const showAddLineage = ref(false)
            const showMinimap = ref(false)
            const searchItems = ref([])
            const assetGuidToHighlight = ref('')
            const highlightedNode = ref('')
            const loaderCords = ref({})
            const currZoom = ref('...')
            const isComputeDone = ref(false)

            /** METHODS */
            // onSelectAsset
            const onSelectAsset = (item, highlight = false) => {
                control('selectedAsset', item)
                control('selectedAssetGuid', item.guid)
                if (highlight) assetGuidToHighlight.value = item.guid
            }

            // initialize
            const initialize = async () => {
                // useGraph
                useCreateGraph(
                    graph,
                    graphLayout,
                    graphContainer,
                    minimapContainer,
                    graphWidth,
                    graphHeight
                )

                // useComputeGraph
                await useComputeGraph(
                    graph,
                    graphLayout,
                    lineage,
                    searchItems,
                    currZoom,
                    isComputeDone,
                    emit
                )

                // useEventGraph
                useEventGraph(
                    graph,
                    baseEntity,
                    showProcess,
                    assetGuidToHighlight,
                    highlightedNode,
                    loaderCords,
                    currZoom,
                    onSelectAsset
                )
            }

            /** PROVIDERS */
            provide('searchItems', searchItems)
            provide('onSelectAsset', onSelectAsset)

            // onShowImpactedAssets
            const onShowImpactedAssets = () => {
                showImpactedAssets.value = true
            }

            // onShowAddLineage
            const onShowAddLineage = () => {
                showAddLineage.value = true
            }

            /** LIFECYCLE */
            onMounted(async () => {
                graphHeight.value = window.outerHeight
                graphWidth.value = window.outerWidth

                if (graph.value) graph.value.dispose()
                await initialize()
                if (selectedAsset.value?.guid) {
                    const highlight =
                        selectedAsset.value.guid !== baseEntity.value.guid
                    onSelectAsset(selectedAsset.value, highlight)
                }
            })

            onUnmounted(() => {
                isComputeDone.value = false
                removedNodes.value = {}
                if (graph.value) graph.value.dispose()
            })

            return {
                selectedAsset,
                baseEntity,
                graph,
                showProcess,
                showMinimap,
                showImpactedAssets,
                showAddLineage,
                lineageContainer,
                graphContainer,
                minimapContainer,
                currZoom,
                highlightedNode,
                isComputeDone,
                loaderCords,
                graphHeight,
                graphWidth,
                onShowImpactedAssets,
                onShowAddLineage,
            }
        },
    })
</script>

<style>
    body {
        background: transparent !important;
    }
</style>

<style lang="less">
    .hide-scrollbar {
        /* Hide scrollbar for IE, Edge and Firefox */
        -ms-overflow-style: none; /* IE and Edge */
        scrollbar-width: none; /* Firefox */

        /* Hide scrollbar for Chrome, Safari and Opera */
        &::-webkit-scrollbar {
            display: none;
        }
    }

    .lineage {
        position: relative;

        // Legend
        &-legend {
            bottom: 1rem;
            left: 1.5rem;
            position: absolute;
            z-index: 9;
            background: #ffffff;

            &__item {
                display: flex;
                align-items: center;
                margin-bottom: 0.8rem;

                &:last-child {
                    margin-bottom: 0;
                }

                & > span {
                    font-size: 0.8rem;

                    &:first-child {
                        margin-right: 1rem;
                        width: 2rem;
                        height: 3px;

                        &#upstream {
                            background: #bed9a3;
                        }

                        &#downstream {
                            background: #f1a183;
                        }

                        &#selected {
                            background: #2351cc;
                        }
                    }
                }
            }
        }

        // Control
        &-control {
            @apply absolute bg-white;
            z-index: 9;
            border: unset;
            box-shadow: 0px 9px 32px rgb(0 0 0 / 12%);
            border-radius: 4px;

            &.header {
                top: 1.5rem;
                left: 1.5rem;
            }
            &.footer {
                bottom: 1.5rem;
                right: 1.5rem;
            }
            & > .controls {
                @apply flex items-center flex-1;
                padding: 0.4rem 0.6rem;
            }

            & > .minimap {
                @apply mb-3;

                & .x6-widget-minimap .x6-graph {
                    box-shadow: unset !important;
                }
                & .x6-widget-minimap-viewport {
                    border: 1px solid #9296eb !important;
                }
                & .x6-widget-minimap-viewport-zoom {
                    border: 1px solid #9296eb !important;
                }
            }
        }

        // Process Nodes
        &-process {
            border: 1px solid #e6e6eb;
            border-radius: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #ffffff;
            width: 60px;
            height: 60px;
            cursor: pointer;

            &.isHighlightedNode {
                border: 1px solid #5277d7;
            }
            &.isHighlightedNodePath {
                border: 1px solid #5277d7;
            }

            & > .process-icon {
                color: #64748b;
            }

            &.isGrayed > .process-icon {
                color: #b6b9c5;
            }
        }

        // Non-Process Nodes
        &-node {
            padding: 10px 8px 0px 10px;
            font-size: 16px;
            border: 1px solid #e6e6eb;
            border-radius: 4px;
            background-color: #ffffff;
            width: 270px;
            height: 70px;
            cursor: pointer;
            outline: 0 !important;

            &__content {
                display: flex;
                align-items: center;
            }

            &.isBase {
                border-top-left-radius: 0;
                border: 1px solid #5277d7 !important;
                background-color: #ffffff !important;

                &.isHighlightedNode {
                    border: 1px solid #5277d7 !important;
                }

                .inscr {
                    position: relative;
                    width: 100%;
                    z-index: 99;
                    display: block;

                    &-item {
                        background: #ffffff;
                        color: #5277d7;
                        position: absolute;
                        border: 1px solid #5277d7;
                        border-bottom: 0;
                        top: -37px;
                        padding: 0 8px;
                        left: -11px;
                        border-top-right-radius: 4px;
                        border-top-left-radius: 4px;
                    }
                }
            }

            & .node-text {
                display: flex;
                justify-content: space-between;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                text-transform: lowercase;
                color: #3e4359;
            }

            & .node-meta {
                display: flex;
                align-items: center;

                &__text {
                    text-transform: capitalize;
                    color: #6f7590;
                    margin: 0 0.5rem;
                }

                &__source {
                    width: 1rem;
                    height: 1rem;
                    margin-bottom: 0.2rem;
                }
            }
        }

        .isGrayed {
            border: 1px solid #e6e6eb !important;

            .node-text {
                color: #6f7590 !important;

                &.type {
                    color: #6f7590 !important;
                }
            }
        }

        .isHighlightedNode {
            border: 1px solid #5277d7 !important;
            background-color: #e5ecff !important;
        }

        .isHighlightedNodePath {
            border: 1px solid #5277d7;
            background-color: #ffffff;
        }
    }
</style>
