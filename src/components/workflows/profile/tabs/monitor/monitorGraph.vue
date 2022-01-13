<template>
    <div ref="monitorContainer" class="monitor">
        <!-- Parent Container for Graph and Spinner -->
        <div class="relative">
            <!-- Graph Container -->
            <div
                ref="graphContainer"
                style="width: calc(100vw + 45px); height: 1000px"
            ></div>
            <!-- Spinner -->
            <div
                v-if="!isGraphRendered"
                class="absolute top-0 left-0 flex items-center justify-center w-full h-full bg-gray-100 bg-opacity-50"
            >
                <AtlanIcon icon="Loader" class="h-5 animate-spin" />
            </div>
        </div>

        <!-- Monitor Controls -->
        <div class="monitor-control" :class="isFullscreen ? 'top-7' : 'top-4'">
            <!-- Minimap Container -->
            <div
                v-show="showMinimap"
                ref="minimapContainer"
                class="mb-3 minimap"
            ></div>

            <div class="flex items-center flex-1 controls">
                <div class="mr-3 cursor-pointer" @click="handleRefresh">
                    <a-tooltip placement="top">
                        <template #title>
                            <span>Refresh</span>
                        </template>

                        <AtlanIcon :icon="'Refresh'" class="outline-none" />
                    </a-tooltip>
                </div>
                <div
                    v-if="graphData.phase === 'Running'"
                    class="mr-3 cursor-pointer"
                >
                    <a-tooltip placement="top">
                        <template #title>
                            <span>{{ isRunning ? 'stop' : 'retry' }}</span>
                        </template>

                        <AtlanIcon
                            :icon="isRunning ? 'Stop' : 'Retry'"
                            class="outline-none"
                            @click="isRunning ? onStopRun() : onRetryRun()"
                        ></AtlanIcon>
                    </a-tooltip>
                </div>

                <a-divider
                    v-if="graphData.phase === 'Running'"
                    type="vertical"
                    class="mr-4"
                />

                <div
                    class="mr-3 cursor-pointer"
                    @click="showMinimap = !showMinimap"
                >
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

                <div class="mr-3 cursor-pointer" @click="handleRecenter">
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

                <!-- <div class="mr-3 cursor-pointer" @click="onFullscreen()">
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
                </div> -->
                <div class="mr-3 cursor-pointer" @click="zoom(-0.1)">
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
                <div class="mr-3 cursor-pointer" @click="zoom(0.1)">
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
    import {
        defineComponent,
        ref,
        onMounted,
        toRefs,
        watch,
        computed,
    } from 'vue'

    /** COMPOSABLES */
    import useCreateGraph from './useCreateGraph'
    import useComputeGraph from './useComputeGraph'
    import useHighlight from './useHighlight'
    import useTransformGraph from './useTransformGraph'
    import useControlGraph from './useControlGraph'

    export default defineComponent({
        name: 'MonitorGraph',
        props: {
            graphData: {
                type: Object,
                required: true,
            },
            selectedPod: {
                type: Object,
                required: true,
            },
        },
        setup(props, { emit }) {
            /** DATA */
            const { graphData, selectedPod } = toRefs(props)
            const selectedRunName = computed(() => graphData.value.name)
            const graphContainer = ref(null)
            const minimapContainer = ref(null)
            const monitorContainer = ref(null)
            const highlightLoadingCords = ref({})
            const graph = ref(null)
            const highlightedNode = ref('')
            const currZoom = ref('...')
            const currZoomDec = ref(null)
            const showMinimap = ref(false)
            const isFullscreen = ref(false)
            const isRunning = ref(true)
            const isLoadingRefresh = ref(false)
            const firstNode = ref({})

            // Ref indicating if the all the nodes and edges of the graph
            // have been rendered or not.
            const isGraphRendered = ref(false)

            /** METHODS */
            // controls
            const { retry, stop } = useControlGraph()
            const onRetryRun = () => {
                retry(selectedRunName, isRunning)
            }
            const onStopRun = () => {
                stop(selectedRunName, isRunning)
            }

            // transform
            const { zoom, fullscreen, handleRecenter } = useTransformGraph(
                graph,
                currZoom,
                firstNode
            )
            const onFullscreen = () => {
                isFullscreen.value = !isFullscreen.value
                fullscreen(monitorContainer)
            }

            // initialize
            const initialize = (reload = false) => {
                if (reload) graph.value.dispose()
                isLoadingRefresh.value = true
                isGraphRendered.value = false
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
                    currZoomDec,
                    reload
                )
                firstNode.value = nodes.value[0]
                // useHighlight
                useHighlight(
                    graph,
                    nodes,
                    highlightLoadingCords,
                    highlightedNode,
                    emit,
                    selectedPod.value
                )

                // mousewheel events
                graph.value.on('blank:mousewheel', () => {
                    currZoom.value = `${(graph.value.zoom() * 100).toFixed(0)}%`
                })
                graph.value.on('cell:mousewheel', () => {
                    currZoom.value = `${(graph.value.zoom() * 100).toFixed(0)}%`
                })

                // The graph is rendered asynchronously, so any synchronous
                // interactions need to take place after the render is complete.
                // Once it is complete, change the value of the ref.
                graph.value.on('render:done', () => {
                    isGraphRendered.value = true
                })
                isLoadingRefresh.value = false
            }

            watch(
                graphData,
                () => {
                    // this is causing API runs & archived get hit multiple times
                    // and as a result, view logs toolbar always get override
                    initialize(true)
                },
                { deep: true }
            )

            /** LIFECYCLE */
            onMounted(() => {
                if (graph.value) graph.value.dispose()
                initialize()
            })
            const handleRefresh = () => {
                emit('refresh')
            }
            return {
                minimapContainer,
                monitorContainer,
                graphContainer,
                currZoom,
                currZoomDec,
                showMinimap,
                isFullscreen,
                isRunning,
                zoom,
                onFullscreen,
                onRetryRun,
                onStopRun,
                initialize,
                isLoadingRefresh,
                handleRefresh,
                isGraphRendered,
                handleRecenter,
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
            width: 160px;
            display: inline-flex;
            align-items: center;
            font-size: 16px;
            color: #3e4359;
            padding: 0 0.5rem;
            cursor: pointer;

            &.Succeeded {
                background-color: #f2ffe7;
                border: 1.5px solid #81c1b3;
            }
            &.Failed,
            &.Error {
                background-color: #ffede7;
                border: 1.5px solid #c18181;
            }
            &.Pending,
            &.Running,
            &.Skipped,
            &.Omitted {
                background-color: #f3f3f3;
                border: 1.5px solid #e6e6eb;
                height: 39px;
            }
        }
    }
</style>
