<template>
    <div ref="workflowContainer" class="workflow">
        <!-- Graph Container -->
        <div
            ref="graphContainer"
            style="width: calc(100vw - 420px); height: 1000px"
        ></div>

        <!-- Minimap Container -->
        <div ref="minimapContainer" class="workflow-minimap"></div>
    </div>
</template>

<script lang="ts">
    /** PACKAGES */
    import { defineComponent, ref, onMounted, toRefs, watch } from 'vue'

    /** COMPOSABLES */
    import useCreateGraph from './useCreateGraph'
    import useComputeGraph from './useComputeGraph'

    export default defineComponent({
        name: 'WorkflowGraph',
        props: {
            graphData: {
                type: Object,
                required: true,
            },
        },
        setup(props) {
            /** DATA */
            const graphContainer = ref(null)
            const minimapContainer = ref(null)
            const workflowContainer = ref(null)
            const graph = ref(null)
            const { graphData } = toRefs(props)

            /** METHODS */
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
                useComputeGraph(graph, graphLayout, graphData, reload)
            }

            watch(graphData, () => {
                initialize(true)
            })

            /** LIFECYCLE */
            onMounted(() => {
                initialize()
            })

            return {
                minimapContainer,
                workflowContainer,
                graphContainer,
            }
        },
    })
</script>

<style lang="less">
    .workflow {
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

        &-node {
            border-radius: 100%;
            height: 64px;
            width: 64px;
            display: inline-flex;
            justify-content: center;
            align-items: center;
            background-color: white;
            font-size: 30px;
            font-weight: 800;
            color: #ffffff;

            &.succeeded {
                background-color: #1abe93;
                border: 2px solid #1abe93;
            }
            &.failed {
                background-color: #e86d76;
                border: 2px solid #e86d76;
            }
        }
    }

    .node-desc {
        @apply relative text-gray-700;

        &__item {
            @apply fixed z-50 text-center;
            font-size: 16px;
            bottom: -4rem;
            left: -2.4rem;
            font-weight: 500;
            overflow: hidden;
            text-overflow: ellipsis;
            // white-space: nowrap;
            width: 9.5rem;
            height: 4rem;
        }
    }
</style>
