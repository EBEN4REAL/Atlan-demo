<template>
    <div
        ref="lineageContainer"
        class="overflow-hidden hide-scrollbar lineage"
        style="width: calc(100vw - 420px); height: calc(100vh - 145px)"
    >
        <div
            v-if="!isComputationDone"
            class="flex items-center justify-center bg-white w-100"
            style="height: 80vh"
        >
            <div>
                <a-spin tip="Fetching data..." />
            </div>
        </div>
        <!-- Highlight Loader -->
        <!-- <div
            v-if="highlightLoadingCords.x"
            :style="`position: absolute; left: ${
                highlightLoadingCords.x - 13
            }px; top: ${highlightLoadingCords.y - 130}px; z-index: 999`"
        >
            <a-spin size="large" />
        </div> -->

        <!-- Graph Container -->
        <div ref="graphContainer" style="width: 1440px; height: 1000px"></div>

        <!-- Lineage Header -->
        <LineageHeader
            :selected-node-type="selectedNodeType"
            @show-process="onShowProcess($event)"
            @show-impacted-assets="onShowImpactedAssets($event)"
            @show-add-lineage="onShowAddLineage($event)"
        />

        <!-- Lineage Footer -->
        <LineageFooter
            :graph="graph"
            :lineage-container="lineageContainer"
            :curr-zoom="currZoom"
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
            :graph="graph"
            :guid="highlightedNode"
            style="z-index: 600"
            @cancel="showAddLineage = false"
        />
    </div>
</template>

<script lang="ts">
    /** PACKAGES */
    import { defineComponent, ref, onMounted, provide, toRefs } from 'vue'
    /** COMPONENTS */
    import LineageHeader from './lineageHeader.vue'
    import LineageFooter from './lineageFooter.vue'
    import LineageImpactedAssets from './lineageImpactedAssets.vue'
    import LineageAdd from './lineageAdd.vue'
    /** COMPOSABLES */
    import useCreateGraph from './useCreateGraph'
    import useComputeGraph from './useComputeGraph'
    import useHighlight from './useHighlight'
    import useUpdateGraph from './useUpdateGraph'

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
            /** DATA */
            const { lineage } = toRefs(props)
            const graphContainer = ref(null)
            const minimapContainer = ref(null)
            const lineageContainer = ref(null)
            const graph = ref(null)
            const highlightLoadingCords = ref({})
            const showProcess = ref(false)
            const showImpactedAssets = ref(false)
            const showAddLineage = ref(false)
            const showMinimap = ref(false)
            const useCyclic = ref(false)
            const searchItems = ref([])
            const selectedSearchItem = ref('')
            const selectedNodeType = ref('')
            const highlightedNode = ref('')
            const currZoom = ref('...')
            const isComputationDone = ref(false)
            /** METHODS */
            // selectSearchItem
            const selectSearchItem = (guid) => {
                selectedSearchItem.value = guid
            }

            // initialize
            const initialize = async (reload = false) => {
                const { baseEntityGuid: guid } = lineage.value
                const defaultEntity = lineage.value.guidEntityMap[guid]

                emit('preview', defaultEntity)

                if (reload) graph.value.dispose()

                // useGraph
                const { graphLayout } = useCreateGraph(
                    graph,
                    graphContainer,
                    minimapContainer,
                    showProcess
                )

                // useComputeGraph
                const { baseEntityGuid } = await useComputeGraph(
                    graph,
                    graphLayout,
                    lineage,
                    showProcess,
                    searchItems,
                    currZoom,
                    reload,
                    isComputationDone
                )

                // save cords
                graph.value.on('cell:mousedown', ({ e }) => {
                    highlightLoadingCords.value = { x: e.clientX, y: e.clientY }
                })

                // useHighlight
                useHighlight(
                    graph,
                    baseEntityGuid,
                    showProcess,
                    highlightLoadingCords,
                    highlightedNode,
                    selectedSearchItem,
                    selectedNodeType,
                    emit
                )
            }

            // onShowProcess
            const onShowProcess = (val) => {
                showProcess.value = val
                selectedNodeType.value = ''
                // const { toggleProcessNodes } = useUpdateGraph()
                // toggleProcessNodes(graph)
                initialize(true)
            }

            // onShowImpactedAssets
            const onShowImpactedAssets = () => {
                showImpactedAssets.value = true
            }

            // onShowAddLineage
            const onShowAddLineage = () => {
                showAddLineage.value = true
            }

            /** PROVIDERS */
            provide('searchItems', searchItems)
            provide('selectSearchItem', selectSearchItem)

            /** LIFECYCLE */
            onMounted(() => {
                if (graph.value) graph.value.dispose()
                initialize()
            })

            return {
                graph,
                showProcess,
                showImpactedAssets,
                showAddLineage,
                showMinimap,
                useCyclic,
                lineageContainer,
                graphContainer,
                minimapContainer,
                highlightLoadingCords,
                highlightedNode,
                selectedNodeType,
                currZoom,
                isComputationDone,
                onShowProcess,
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
            border: 2px solid #e6e6eb;
            border-radius: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #ffffff;
            width: 60px;
            height: 60px;
            cursor: pointer;

            &.isHighlightedNode {
                border: 2px solid #5277d7;
            }
            &.isHighlightedNodePath {
                border: 1.75px solid #5277d7;
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
            padding: 4px 8px 3px 8px;
            font-size: 16px;
            border: 2px solid #e6e6eb;
            border-radius: 4px;
            background-color: #ffffff;
            width: 270px;
            height: 60px;
            cursor: pointer;
            outline: 0 !important;

            &__content {
                display: flex;
                align-items: center;
            }

            &.isBase {
                border-top-left-radius: 0;
                border: 1.75px solid #5277d7 !important;
                background-color: #ffffff !important;

                &.isHighlightedNode {
                    border: 1.75px solid #5277d7 !important;
                }

                .inscr {
                    position: relative;
                    width: 100%;
                    z-index: 99;

                    &-item {
                        background: #ffffff;
                        color: #5277d7;
                        position: absolute;
                        border: 1.75px solid #5277d7;
                        border-bottom: 0;
                        top: -33px;
                        padding: 0 8px;
                        left: -10px;
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
            border: 2px solid #e6e6eb !important;
            // background-color: #f3f3f3 !important;

            .node-text {
                color: #6f7590 !important;

                &.type {
                    color: #6f7590 !important;
                }
            }
            // .node-source {
            //     opacity: 0.5;
            // }
        }

        .isHighlightedNode {
            border: 2px solid #5277d7 !important;
            background-color: #f4f6fd !important;
        }

        .isHighlightedNodePath {
            border: 1.75px solid #5277d7;
            background-color: #ffffff;
        }
    }
</style>
