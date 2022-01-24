<template>
    <div ref="monitorContainer" class="monitor">
        <!-- Parent Container for Graph and Spinner -->
        <div class="relative">
            <!-- Graph Container -->
            <div ref="graphContainer" style="width: 100%; height: 1000px"></div>
            <!-- Spinner -->
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
    import G6 from '@antv/g6'

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
        emits: ['select'],
        setup(props, { emit }) {
            /** DATA */
            // const { graphData, selectedPod } = toRefs(props)
            // const selectedRunName = computed(() => graphData.value.name)
            const graphContainer = ref(null)
            const graph = ref(null)
            const data = ref({
                nodes: [
                    {
                        id: '0',
                        label: '0',
                    },
                    {
                        id: '1',
                        label: '1',
                    },
                    {
                        id: '2',
                        label: '2',
                    },
                    {
                        id: '3',
                        label: '3',
                    },
                    {
                        id: '4',
                        label: '4',
                        comboId: 'A',
                    },
                    {
                        id: '5',
                        label: '5',
                        comboId: 'B',
                    },
                    {
                        id: '6',
                        label: '6',
                        comboId: 'A',
                    },
                    {
                        id: '7',
                        label: '7',
                        comboId: 'C',
                    },
                    {
                        id: '8',
                        label: '8',
                        comboId: 'C',
                    },
                    {
                        id: '9',
                        label: '9',
                        comboId: 'A',
                    },
                    {
                        id: '10',
                        label: '10',
                        comboId: 'B',
                    },
                    {
                        id: '11',
                        label: '11',
                        comboId: 'B',
                    },
                ],
                edges: [
                    {
                        source: '0',
                        target: '1',
                    },
                    {
                        source: '0',
                        target: '2',
                    },
                    {
                        source: '1',
                        target: '4',
                    },
                    {
                        source: '0',
                        target: '3',
                    },
                    {
                        source: '3',
                        target: '4',
                    },
                    {
                        source: '2',
                        target: '5',
                    },
                    {
                        source: '1',
                        target: '6',
                    },
                    {
                        source: '1',
                        target: '7',
                    },
                    {
                        source: '3',
                        target: '8',
                    },
                    {
                        source: '3',
                        target: '9',
                    },
                    {
                        source: '5',
                        target: '10',
                    },
                    {
                        source: '5',
                        target: '11',
                    },
                ],
                combos: [
                    {
                        id: 'A',
                        label: 'combo A',
                        style: {
                            fill: '#C4E3B2',
                            stroke: '#C4E3B2',
                        },
                    },
                    {
                        id: 'B',
                        label: 'combo B',
                        style: {
                            stroke: '#99C0ED',
                            fill: '#99C0ED',
                        },
                    },
                    {
                        id: 'C',
                        label: 'combo C',
                        style: {
                            stroke: '#eee',
                            fill: '#eee',
                        },
                    },
                ],
            })

            const render = () => {
                data.value.nodes.forEach((node) => {
                    switch (node.ComboId) {
                        case 'A':
                            node.style = {
                                fill: '#C4E3B2',
                                stroke: '#aaa',
                            }
                            break
                        case 'B':
                            node.style = {
                                fill: '#99C0ED',
                                stroke: '#aaa',
                            }
                            break
                        case 'C':
                            node.style = {
                                fill: '#eee',
                                stroke: '#aaa',
                            }
                            break
                        default:
                            node.style = {
                                fill: '#FDE1CE',
                                stroke: '#aaa',
                            }
                            break
                    }
                })

                graph.value = new G6.Graph({
                    container: graphContainer.value,
                    fitView: true,
                    fitViewPadding: 30,
                    animate: true,
                    groupByTypes: false,
                    modes: {
                        default: [
                            'drag-combo',
                            'drag-node',
                            'drag-canvas',
                            {
                                type: 'collapse-expand-combo',
                                relayout: false,
                            },
                        ],
                    },
                    layout: {
                        type: 'dagre',
                        sortByCombo: false,
                        ranksep: 10,
                        nodesep: 10,
                    },
                    defaultNode: {
                        size: [60, 30],
                        type: 'rect',
                        anchorPoints: [
                            [0.5, 0],
                            [0.5, 1],
                        ],
                    },
                    defaultEdge: {
                        type: 'line',
                    },
                    defaultCombo: {
                        type: 'rect',
                        style: {
                            fillOpacity: 0.1,
                        },
                    },
                })
                graph.value.data(data)
                graph.value.render()
            }

            onMounted(() => {
                // if (graph.value) graph.value.dispose()
                render()
            })

            return {
                graph,
                graphContainer,
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
