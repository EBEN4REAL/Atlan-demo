<template>
    <div ref="setupContainer" class="setup">
        <!-- Graph Container -->
        <div
            ref="graphContainer"
            style="width: calc(100vw + 45px); height: 1000px"
        ></div>

        <!-- Setup Controls -->
        <div
            class="setup-control"
            :class="isFullscreen ? 'bottom-7' : 'bottom-44'"
        >
            <!-- Minimap Container -->
            <div
                ref="minimapContainer"
                class="mb-3 minimap"
                v-show="showMinimap"
            ></div>

            <div class="flex items-center flex-1 controls">
                <div>
                    <a-tooltip placement="top">
                        <template #title>
                            <span>run workflow</span>
                        </template>
                        <AtlanIcon icon="Play" class="outline-none"></AtlanIcon>
                    </a-tooltip>
                </div>

                <div>
                    <a-tooltip placement="top">
                        <template #title>
                            <span>schedule workflow</span>
                        </template>

                        <AtlanIcon
                            icon="Schedule"
                            class="outline-none"
                        ></AtlanIcon>
                    </a-tooltip>
                </div>
                <div>
                    <a-tooltip placement="top">
                        <template #title>
                            <span>delete workflow</span>
                        </template>

                        <AtlanIcon
                            icon="Delete"
                            class="text-red-400 outline-none"
                        ></AtlanIcon>
                    </a-tooltip>
                </div>

                <a-divider type="vertical" />

                <div @click="showMinimap = !showMinimap">
                    <a-tooltip placement="top">
                        <template #title>
                            <span>{{
                                showMinimap ? 'hide minimap' : 'show minimap'
                            }}</span>
                        </template>

                        <AtlanIcon
                            icon="Minimap"
                            class="outline-none"
                            :class="
                                showMinimap ? 'text-primary' : 'text-gray-500'
                            "
                        ></AtlanIcon>
                    </a-tooltip>
                </div>
                <div @click="onFullscreen()">
                    <a-tooltip placement="top">
                        <template #title>
                            <span>{{
                                isFullscreen ? 'leave fullscreen' : 'fullscreen'
                            }}</span>
                        </template>

                        <AtlanIcon
                            icon="FullScreenBoth"
                            class="outline-none"
                        ></AtlanIcon>
                    </a-tooltip>
                </div>
                <div @click="zoom(-0.1)">
                    <a-tooltip placement="top">
                        <template #title>
                            <span>zoom out</span>
                        </template>

                        <AtlanIcon
                            icon="Minus"
                            class="outline-none"
                        ></AtlanIcon>
                    </a-tooltip>
                </div>
                <div @click="zoom(0.1)">
                    <a-tooltip placement="top">
                        <template #title>
                            <span>zoom in</span>
                        </template>

                        <AtlanIcon
                            icon="Add"
                            class="text-gray-500 outline-none"
                        ></AtlanIcon>
                    </a-tooltip>
                </div>
                <div class="w-8 text-sm text-gray-500 select-none">
                    {{ currZoom }}
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    /** PACKAGES */
    import { defineComponent, ref, onMounted, toRefs, watch } from 'vue'

    /** COMPOSABLES */
    import useCreateGraph from './useCreateGraph'
    import useComputeGraph from './useComputeGraph'
    import useHighlight from './useHighlight'
    import useTransformGraph from './useTransformGraph'

    export default defineComponent({
        name: 'SetupGraph',
        props: {
            graphData: {
                type: Object,
                required: true,
            },
        },
        setup(props, { emit }) {
            /** DATA */
            const graphContainer = ref(null)
            const minimapContainer = ref(null)
            const setupContainer = ref(null)
            const highlightLoadingCords = ref({})
            const graph = ref(null)
            const { graphData } = toRefs(props)
            const highlightedNode = ref('')
            const currZoom = ref('...')
            const showMinimap = ref(false)
            const isFullscreen = ref(false)

            /** METHODS */
            // transform
            const { zoom, fullscreen } = useTransformGraph(graph, currZoom)
            const onFullscreen = () => {
                isFullscreen.value = !isFullscreen.value
                fullscreen(setupContainer)
            }

            // initialize
            const initialize = (reload = false) => {
                if (reload) graph.value.dispose()

                // useGraph
                const { graphLayout } = useCreateGraph(
                    graph,
                    graphContainer,
                    minimapContainer
                )

                // useComputeGraph
                const { nodes } = useComputeGraph(
                    graph,
                    graphLayout,
                    graphData,
                    currZoom,
                    reload
                )

                // useHighlight
                useHighlight(
                    graph,
                    nodes,
                    highlightLoadingCords,
                    highlightedNode,
                    emit
                )

                // mousewheel events
                graph.value.on('blank:mousewheel', () => {
                    currZoom.value = `${(graph.value.zoom() * 100).toFixed(0)}%`
                })
                graph.value.on('cell:mousewheel', () => {
                    currZoom.value = `${(graph.value.zoom() * 100).toFixed(0)}%`
                })
            }

            onMounted(() => {
                watch(graphData, () => {
                    if (graph.value) graph.value.dispose()
                    initialize()
                })
            })

            return {
                minimapContainer,
                setupContainer,
                graphContainer,
                currZoom,
                showMinimap,
                isFullscreen,
                zoom,
                onFullscreen,
            }
        },
    })
</script>

<style lang="less">
    .setup {
        // Control
        &-control {
            @apply absolute bg-white;
            right: 1.5rem;
            z-index: 9;
            border: unset;
            box-shadow: 0px 9px 32px rgb(0 0 0 / 12%);
            border-radius: 4px;
            padding: 0.4rem 0.8rem;

            & > .controls > div {
                margin-right: 1rem;
                cursor: pointer;

                &:nth-child(3) {
                    margin-right: 0.5rem;
                }
                &:nth-child(4) {
                    cursor: auto;
                }

                &:last-child {
                    margin-right: 0;
                }
            }

            & > .minimap {
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

        &-node {
            border-radius: 10px;
            height: 40px;
            width: 180px;
            display: inline-flex;
            justify-content: center;
            align-items: center;
            background-color: #f3f3f3;
            font-size: 20px;
            color: #3e4359;
            border: 1px solid #e6e6eb;

            &.isSelectedNode {
                border: 2px solid #5277d7;
            }
        }
    }
</style>
