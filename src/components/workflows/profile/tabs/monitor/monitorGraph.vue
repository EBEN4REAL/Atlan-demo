<template>
    <div ref="monitorContainer" class="monitor">
        <!-- Graph Container -->
        <div
            ref="graphContainer"
            style="width: calc(100vw + 45px); height: 1000px"
        ></div>

        <!-- Monitor Controls -->
        <div
            class="monitor-control"
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
                            <span>retry</span>
                        </template>

                        <AtlanIcon
                            icon="Retry"
                            class="outline-none"
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

                <div>
                    <a-tooltip placement="top">
                        <template #title>
                            <span>recenter</span>
                        </template>

                        <AtlanIcon
                            icon="Recenter"
                            class="outline-none"
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
                            icon="FullScreen"
                            class="text-gray-500 outline-none"
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
        name: 'MonitorGraph',
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
            const monitorContainer = ref(null)
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
                fullscreen(monitorContainer)
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

            watch(
                graphData,
                (newVal) => {
                    initialize(true)
                },
                { deep: true }
            )

            /** LIFECYCLE */
            onMounted(() => {
                if (graph.value) graph.value.dispose()
                initialize()
            })

            return {
                minimapContainer,
                monitorContainer,
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
    .monitor {
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

                &:nth-child(1) {
                    margin-right: 0.5rem;
                }
                &:nth-child(2) {
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
            height: 55px;
            width: 190px;
            display: inline-flex;
            align-items: center;
            background-color: #f3f3f3;
            font-size: 16px;
            color: #3e4359;
            border: 1px solid #e6e6eb;
            padding: 0 0.5rem;

            &.Succeeded {
                background-color: #f2ffe7;
                border: 1.5px solid #81c1b3;
            }
            &.Failed {
                background-color: #ffede7;
                border: 1.5px solid #c18181;
            }
            &.Skipped,
            &.Omitted {
                background-color: #f3f3f3;
                border: 1.5px solid #e6e6eb;
            }
        }
    }
</style>
