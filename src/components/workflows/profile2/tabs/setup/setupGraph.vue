<template>
    <div ref="setupContainer" class="setup">
        <!-- Graph Container -->
        <div
            ref="graphContainer"
            style="width: calc(100vw + 45px); height: 1000px"
        ></div>

        <!-- Setup Controls -->
        <div class="setup-control" :class="isFullscreen ? 'top-7' : 'top-4'">
            <!-- Minimap Container -->
            <div
                v-show="showMinimap"
                ref="minimapContainer"
                class="mb-3 minimap"
            ></div>

            <div class="flex items-center flex-1 controls">
                <div
                    v-auth="access.SUBMIT_WORKFLOW"
                    class="mr-3 cursor-pointer"
                >
                    <a-tooltip placement="top">
                        <template #title>
                            <span>run workflow</span>
                        </template>
                        <AtlanIcon
                            :icon="isWorkflowRunning ? 'Running' : 'Play'"
                            class="outline-none"
                            :class="{
                                'animate-spin block': isWorkflowRunning,
                                'text-gray-300': !isAllowtoRun,
                            }"
                            @click="isAllowtoRun ? onRunWorkflow() : null"
                        />
                    </a-tooltip>
                </div>

                <div
                    v-auth="access.LIST_WORKFLOW_SCHEDULES"
                    class="mr-3 cursor-pointer"
                >
                    <a-tooltip placement="top">
                        <template #title>
                            <span>schedule workflow</span>
                        </template>

                        <AtlanIcon
                            icon="Schedule"
                            class="outline-none"
                            @click="showScheduleModal = true"
                        ></AtlanIcon>
                    </a-tooltip>
                </div>
                <div class="mr-3 cursor-pointer">
                    <a-tooltip placement="top">
                        <template #title>
                            <span>delete workflow</span>
                        </template>

                        <AtlanIcon
                            icon="Delete"
                            class="text-red-400 outline-none"
                            @click="onDeleteWorkflow()"
                        ></AtlanIcon>
                    </a-tooltip>
                </div>

                <a-divider type="vertical" class="mr-4" />

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
                <!-- <div @click="onFullscreen()" class="mr-3 cursor-pointer">
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

        <!-- Schedule Modal -->
        <ScheduleModal
            style="z-index: 600"
            :visible="showScheduleModal"
            :workflow-name="workflow"
            @cancel="showScheduleModal = false"
        />
    </div>
</template>

<script lang="ts">
    /** PACKAGES */
    import { defineComponent, ref, onMounted, toRefs, watch } from 'vue'

    /** COMPONENTS */
    import ScheduleModal from './scheduleModal.vue'

    /** COMPOSABLES */
    import useCreateGraph from './useCreateGraph'
    import useComputeGraph from './useComputeGraph'
    import useHighlight from './useHighlight'
    import useTransformGraph from './useTransformGraph'
    import useControlGraph from './useControlGraph'
    import access from '~/constant/accessControl/map'

    export default defineComponent({
        name: 'SetupGraph',
        components: { ScheduleModal },
        props: {
            workflow: {
                type: String,
                required: true,
            },
            graphData: {
                type: Object,
                required: true,
            },
            isAllowtoRun: {
                type: Boolean,
                required: true,
            },
        },
        setup(props, { emit }) {
            /** DATA */
            const { graphData, workflow, isAllowtoRun } = toRefs(props)
            const graphContainer = ref(null)
            const minimapContainer = ref(null)
            const setupContainer = ref(null)
            const highlightLoadingCords = ref({})
            const graph = ref(null)
            const highlightedNode = ref('')
            const currZoom = ref('...')
            const showMinimap = ref(false)
            const isFullscreen = ref(false)
            const isWorkflowRunning = ref(false)
            const showScheduleModal = ref(false)
            const nodesShared = ref([])
            const emitSelectionShared = ref(null)

            /** METHODS */
            // controls
            const { run, deleteWorkflow } = useControlGraph()
            const onRunWorkflow = () => {
                run(workflow, isWorkflowRunning)
            }
            const onDeleteWorkflow = () => {
                deleteWorkflow(workflow)
            }

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
                nodesShared.value = nodes

                // useHighlight
                const { emitSelection } = useHighlight(
                    graph,
                    nodes,
                    highlightLoadingCords,
                    highlightedNode,
                    emit
                )
                emitSelectionShared.value = emitSelection
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

            onMounted(() => {
                // watch(graphData, () => {
                if (graph.value) graph.value.dispose()
                initialize()
                // })
            })

            return {
                access,
                minimapContainer,
                setupContainer,
                graphContainer,
                currZoom,
                showMinimap,
                isFullscreen,
                isWorkflowRunning,
                showScheduleModal,
                zoom,
                onFullscreen,
                onRunWorkflow,
                onDeleteWorkflow,
                nodesShared,
                emitSelectionShared,
                isAllowtoRun,
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
            width: 190px;
            display: inline-flex;
            justify-content: center;
            align-items: center;
            background-color: #f3f3f3;
            font-size: 16px;
            color: #3e4359;
            border: 1px solid #e6e6eb;
            padding: 0 0.5rem;
            cursor: pointer;

            &.isSelectedNode {
                border: 2px solid #5277d7;
            }
        }
    }
</style>
