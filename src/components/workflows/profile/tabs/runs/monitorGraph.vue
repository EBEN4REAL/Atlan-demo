<template>
    <div ref="monitorContainer" class="h-full monitor">
        <div
            :class="
                isFullscreen
                    ? 'absolute bottom-7 right-5 z-10 shadow-sm p-2 bg-white border'
                    : 'absolute bottom-4 right-5 z-10 shadow-sm p-2 bg-white border'
            "
        >
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
                    v-if="graphData?.phase === 'Running'"
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
                    v-if="graphData?.phase === 'Running'"
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
                    {{ currZoom * 100 }}%
                </div>
            </div>
        </div>

        <!-- <div
            v-if="!isGraphRendered"
            class="absolute top-0 left-0 flex items-center justify-center w-full h-full bg-gray-100 bg-opacity-50"
        >
            <AtlanIcon icon="Loader" class="h-5 animate-spin" />
        </div> -->
        <!-- Parent Container for Graph and Spinner -->
        <div class="relative h-full">
            <!-- Graph Container -->
            <div ref="graphContainer" style="width: 100%; height: 100%"></div>
            <!-- Spinner -->
        </div>

        <Drawer
            v-model:visible="drawerVisible"
            :selected-pod="selectedPod"
            :selected-run="graphData"
        ></Drawer>

        <!-- Monitor Controls -->
    </div>
</template>

<script lang="ts">
    /** PACKAGES */
    import {
        defineComponent,
        ref,
        toRefs,
        watch,
        computed,
        Ref,
        onMounted,
        nextTick,
    } from 'vue'
    import { DagreLayout } from '@antv/layout'
    import { Graph } from '@antv/x6'
    import { until } from '@vueuse/core'

    /** COMPOSABLES */
    import useCreateGraph from './useCreateGraph'
    import useComputeGraph from './useComputeGraph2'
    import useTransformGraph from './useTransformGraph'
    import useControlGraph from './useControlGraph'

    import Drawer from './drawer/drawer.vue'
    import useEventGraph from './useEventGraph'
    import useUpdateGraph from './useUpdateGraph'

    export default defineComponent({
        name: 'MonitorGraph',
        components: {
            Drawer,
        },
        props: {
            graphData: {
                type: Object,
                required: true,
            },
        },
        emits: ['refresh'],
        setup(props, { emit }) {
            /** DATA */
            const { graphData } = toRefs(props)

            const selectedPod = ref({})
            const selectedRunName = computed(() => graphData.value.name)
            const graphContainer = ref(null)
            const minimapContainer = ref(null)
            const monitorContainer = ref(null)
            const graph: Ref<Graph> = ref(null)
            const graphLayout: Ref<DagreLayout> = ref(null)
            const currZoom = ref(0.5)
            const showMinimap = ref(false)
            const isFullscreen = ref(false)
            const isRunning = ref(true)

            const expandedNodes = ref([])
            const drawerVisible = ref(false)

            const ns = ref([])
            const ed = ref([])
            const baseNodeId = computed(() => graphData?.value?.metadata?.name)

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
                baseNodeId
            )

            const { highlightNode } = useUpdateGraph(graph)

            const onFullscreen = () => {
                isFullscreen.value = !isFullscreen.value
                fullscreen(monitorContainer)
            }

            const setGraphData = async () => {
                isGraphRendered.value = false

                const { nodes, edges } = useComputeGraph(
                    graph,
                    graphLayout,
                    graphData
                )
                // TODO: Remove debug variables ns and ed
                ns.value = nodes.value
                ed.value = edges.value
            }

            // initialize
            const initialize = async () => {
                if (graph.value) graph.value.dispose()

                isGraphRendered.value = false

                useCreateGraph(
                    graph,
                    graphContainer,
                    minimapContainer,
                    graphLayout
                )
                graph.value.zoom(currZoom.value, { absolute: true })

                setGraphData()

                useEventGraph({
                    graph,
                    currZoom,
                    isGraphRendered,
                    drawerVisible,
                    selectedPod,
                })

                await until(isGraphRendered).toBe(true)
                handleRecenter()
            }

            watch(
                graphData,
                async () => {
                    // initialize()
                    setGraphData()

                    if (selectedPod.value?.id && drawerVisible.value) {
                        const podNode = graph.value.getCellById(
                            selectedPod.value?.id
                        )

                        if (podNode) selectedPod.value = podNode?.data

                        await until(isGraphRendered).toBe(true)
                        highlightNode(podNode, true)
                    }
                },
                { deep: true }
            )

            watch(baseNodeId, async () => {
                await until(isGraphRendered).toBe(true)
                handleRecenter()
            })

            /** LIFECYCLE */
            onMounted(async () => {
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
                showMinimap,
                isFullscreen,
                isRunning,
                zoom,
                onFullscreen,
                onRetryRun,
                onStopRun,
                initialize,
                handleRefresh,
                isGraphRendered,
                handleRecenter,
                graph,

                expandedNodes,
                graphLayout,
                drawerVisible,
                selectedPod,

                ns,
                ed,
            }
        },
    })
</script>

<style lang="less">
    .x6-node foreignObject > body {
        background: transparent !important;
    }

    .bg-success-run {
        background-color: #eeffef;
    }

    .bg-error-run {
        background-color: #f9dcd2;
    }

    .node-selected {
        &.Succeeded {
            @apply ring ring-green-300;
        }

        &.Failed,
        &.Error {
            @apply ring ring-red-200;
        }

        &.Running {
            @apply ring ring-primary-focus;
        }

        &.Pending,
        &.Omitted,
        &.Skipped,
        &.Queued {
            @apply ring ring-gray-300;
        }
    }
    .x6-node-selected .node.success {
    }
    .x6-node-selected .node.failed {
        border-color: #ff4d4f;
        border-radius: 2px;
        box-shadow: 0 0 0 4px #fedcdc;
    }

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
            width: 190px;
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
