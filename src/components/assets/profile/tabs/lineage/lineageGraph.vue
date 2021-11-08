<template>
    <div ref="lineageContainer" class="lineage">
        <!-- Graph Loader -->
        <div
            v-if="graphLoading"
            style="position: absolute; left: 45%; top: 45%"
        >
            <AtlanIcon
                icon="Loader"
                class="w-auto h-10 animate-spin"
            ></AtlanIcon>
        </div>

        <!-- Highlight Loader -->
        <div
            v-if="highlightLoadingCords.x"
            :style="`position: absolute; left: ${
                highlightLoadingCords.x - 13
            }px; top: ${highlightLoadingCords.y - 130}px; z-index: 999`"
        >
            <AtlanIcon
                icon="Loader"
                class="w-auto h-10 animate-spin"
            ></AtlanIcon>
        </div>

        <!-- Graph Container -->
        <div
            ref="graphContainer"
            style="width: calc(100vw - 1px); height: 1000px"
        ></div>

        <!-- Lineage Header -->
        <LineageHeader @show-process="onShowProcess($event)" />

        <!-- Minimap Container -->
        <div ref="minimapContainer" class="lineage-minimap"></div>

        <!-- Lineage Legend -->
        <div class="lineage-legend">
            <div class="lineage-legend__item">
                <span id="upstream"></span>
                <span>Upstream</span>
            </div>
            <div class="lineage-legend__item">
                <span id="downstream"></span>
                <span>Downstream</span>
            </div>
            <div class="lineage-legend__item">
                <span id="selected"></span>
                <span>Selected Path</span>
            </div>
        </div>

        <!-- Lineage Controls -->
        <div class="lineage-control">
            <!-- Zoom In -->
            <div class="lineage-control__item">
                <button @click="zoom(0.1)">
                    <fa icon="fal search-plus"></fa>
                </button>
            </div>

            <!-- Full screen -->
            <div class="lineage-control__item">
                <button @click="onFullscreen()">
                    <AtlanIcon
                        v-if="isFullscreen"
                        icon="ExitFullScreen"
                        class="w-auto"
                    ></AtlanIcon>
                    <AtlanIcon
                        v-else
                        icon="FullScreen"
                        class="w-auto"
                    ></AtlanIcon>
                </button>
            </div>

            <!-- Zoom Out -->
            <div class="lineage-control__item">
                <button @click="zoom(-0.1)">
                    <fa icon="fal search-minus"></fa>
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    /** PACKAGES */
    import {
        defineComponent,
        ref,
        onMounted,
        watch,
        provide,
        toRefs,
    } from 'vue'
    /** COMPONENTS */
    import LineageHeader from './lineageHeader.vue'
    /** COMPOSABLES */
    import useCreateGraph from './useCreateGraph'
    import useComputeGraph from './useComputeGraph'
    import useTransformGraph from './useTransformGraph'
    import useHighlight from './useHighlight'

    export default defineComponent({
        name: 'LineageGraph',
        components: { LineageHeader },
        props: {
            lineage: {
                type: Object,
                required: true,
            },
        },
        setup(props) {
            const { lineage } = toRefs(props)

            /** DATA */
            const graphContainer = ref(null)
            const minimapContainer = ref(null)
            const lineageContainer = ref(null)
            const graph = ref(null)
            const highlightLoadingCords = ref({})
            const graphLoading = ref(false)
            const showProcess = ref(false)
            const useCyclic = ref(false)
            const isFullscreen = ref(false)
            const searchItems = ref([])
            const selectedSearchItem = ref('')

            /** METHODS */
            // selectSearchItem
            const selectSearchItem = (guid) => {
                selectedSearchItem.value = guid
            }

            // transform
            const { zoom, fullscreen } = useTransformGraph(graph)
            const onFullscreen = () => {
                isFullscreen.value = !isFullscreen.value
                fullscreen(lineageContainer)
            }

            // initialize
            const initialize = (reload = false) => {
                graphLoading.value = true
                if (reload) graph.value.dispose()

                // useGraph
                const { graphLayout } = useCreateGraph(
                    graph,
                    graphContainer,
                    minimapContainer
                )

                // useComputeGraph
                const { model, edges, nodes, baseEntityGuid } = useComputeGraph(
                    graph,
                    graphLayout,
                    lineage,
                    showProcess,
                    searchItems,
                    reload
                )

                // save cords
                graph.value.on('cell:mousedown', ({ e }) => {
                    highlightLoadingCords.value = { x: e.clientX, y: e.clientY }
                })

                // useHighlight
                const { highlight } = useHighlight(
                    graph,
                    model,
                    edges,
                    nodes,
                    baseEntityGuid,
                    showProcess,
                    highlightLoadingCords,
                    selectedSearchItem
                )

                graphLoading.value = false
            }

            // onShowProcess
            const onShowProcess = (val) => {
                showProcess.value = val
                initialize(true)
            }

            /** PROVIDERS */
            provide('searchItems', searchItems)
            provide('selectSearchItem', selectSearchItem)

            /** LIFECYCLE */
            onMounted(() => {
                watch(lineage, () => {
                    if (graph.value) graph.value.dispose()
                    initialize()
                })
            })

            return {
                showProcess,
                useCyclic,
                lineageContainer,
                graphContainer,
                minimapContainer,
                highlightLoadingCords,
                graphLoading,
                isFullscreen,
                zoom,
                onFullscreen,
                onShowProcess,
            }
        },
    })
</script>

<style lang="less">
    .lineage {
        // Legend
        &-legend {
            position: absolute;
            left: 1.5rem;
            z-index: 9;
            background: #f8f8fd;
            bottom: 0;

            &__item {
                display: flex;
                align-items: center;
                margin-bottom: 0.8rem;

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
            position: absolute;
            right: 1.5rem;
            bottom: 1rem;
            z-index: 9;
            background: white;
            border: 1px solid #e6e6e7;
            border-radius: 5px;
            background: #ffffff;

            &__item {
                padding: 10px;
                border-bottom: 1px solid #e4e4e4;

                &:last-child {
                    border-bottom: unset;
                }

                & > button {
                    background: #ffffff;
                    outline: none;
                    border: unset;
                    padding: unset;
                    margin: unset;
                    display: flex;
                    align-items: center;

                    & > i {
                        color: #495057;
                        font-size: 0.9rem;
                    }
                }
            }
        }

        // Minimap
        &-minimap {
            @apply absolute;
            top: 15px;
            right: 15px;

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

        // Process Nodes
        &-process {
            border: 2px solid #919aab;
            border-radius: 100%;
            height: 32px;
            width: 32px;
            display: inline-flex;
            justify-content: center;
            align-items: center;
            background-color: white;
        }

        // Non-Process Nodes
        &-node {
            padding: 3px 0 3px 6px;
            border: 2px solid #919aab;
            display: flex;
            align-items: center;
            background-color: white;
            font-size: 13px;
            height: 32px;

            &.isBase {
                background-color: #c2cdf1 !important;
                border: 2px solid #2351cc !important;
            }

            &.isBase .node-type__item {
                border: 2px solid #2351cc !important;
            }

            &.isHighlightedNode .node-type__item,
            &.isHighlightedNodePath .node-type__item {
                border: 2px solid #2351cc;
            }
        }

        .node-text {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            text-transform: lowercase;
        }

        .node-source {
            width: 0.8rem;
            height: 0.8rem;
            margin-right: 0.5rem;
        }

        .node-loadstate {
            position: relative;
        }
        .node-loadstate__item {
            border: 2px solid #919aab;
            top: -21px;
            left: 80%;
            font-size: 10px;
            position: fixed;
            z-index: 999;
            padding: 2px 5px;
            text-transform: uppercase;
            background-color: #f8f8fd;
            overflow: hidden;
        }

        .node-type {
            @apply relative;
        }
        .node-type__item {
            border: 2px solid #919aab;
            top: -21px;
            left: 0px;
            font-size: 10px;
            position: fixed;
            z-index: 999;
            padding: 2px 5px;
            text-transform: uppercase;
            background-color: #f8f8fd;
            overflow: hidden;
        }

        .node-isbase {
            @apply relative;
        }
        .node-isbase__item {
            border: 2px solid #2351cc;
            background-color: #2351cc;
            font-weight: 700;
            color: white;
            top: -21px;
            left: 66%;
            font-size: 10px;
            position: fixed;
            z-index: 999;
            padding: 2px 5px;
            text-transform: uppercase;
            overflow: hidden;
        }

        .isHighlightedNode {
            border: 2px solid #2351cc;
            background-color: #c2cdf1;
        }

        .isHighlightedNodePath {
            border: 2px solid #2351cc;
        }
    }
</style>
