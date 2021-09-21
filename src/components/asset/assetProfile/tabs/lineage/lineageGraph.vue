<template>
    <div>
        <!-- Highlight Loader -->
        <div
            v-if="highlightLoadingCords.x"
            :style="`position: absolute; left: ${
                highlightLoadingCords.x - 40
            }px; top: ${highlightLoadingCords.y - 40}px; z-index: 999`"
        >
            <a-spin size="large" />
        </div>
        <!-- Graph Container -->
        <div ref="container" style="width: 1395px; height: 821px"></div>
        <!-- Minimap Container -->
        <div ref="minimapContainer" class="minimapContainer"></div>
    </div>
</template>

<script lang="ts">
    /** PACKAGES */
    import { defineComponent, ref, onMounted, watch } from 'vue'
    /** DATA */
    import * as lineage from './data/lineage.json'
    /** COMPOSABLES */
    import useCreateGraph from './useCreateGraph'
    import useComputeGraph from './useComputeGraph'
    import useHighlight from './useHighlight'

    export default defineComponent({
        name: 'LineageGraph',
        setup() {
            /** DATA */
            const lineageData = ref(lineage)
            const container = ref(null)
            const minimapContainer = ref(null)
            const graph = ref(null)
            const highlightLoadingCords = ref({})
            const showProcess = ref(false)
            const useCyclic = ref(false)

            /** METHODS */
            // initialize
            const initialize = (reload = false) => {
                if (reload) graph.value.dispose()

                // useGraph
                const { graphLayout } = useCreateGraph(
                    graph,
                    container,
                    minimapContainer
                )

                // useComputeGraph
                const { model, edges, nodes, baseEntityGuid } = useComputeGraph(
                    graph,
                    graphLayout,
                    lineageData,
                    showProcess,
                    reload
                )

                // save cords
                graph.value.on('cell:mousedown', ({ e }) => {
                    highlightLoadingCords.value = { x: e.clientX, y: e.clientY }
                })

                // useHighlight
                useHighlight(
                    graph,
                    model,
                    edges,
                    nodes,
                    baseEntityGuid,
                    showProcess,
                    highlightLoadingCords
                )
            }

            /** WATCHERS */
            watch(useCyclic, (val) => {
                if (val) lineageData.value = lineageCyclic
                else lineageData.value = lineage

                initialize(true)
            })

            /** LIFECYCLE */
            onMounted(() => {
                initialize()
            })

            return {
                showProcess,
                useCyclic,
                container,
                minimapContainer,
                highlightLoadingCords,
            }
        },
    })
</script>

<style>
    .spin {
        position: absolute;
        top: 0;
    }
    .hide {
        opacity: 0;
    }
    .minimapContainer {
        position: absolute;
        top: 15px;
        right: 15px;
    }
    .minimapContainer .x6-widget-minimap .x6-graph {
        box-shadow: unset !important;
    }
    .minimapContainer .x6-widget-minimap-viewport {
        border: 1px solid #9296eb !important;
    }
    .minimapContainer .x6-widget-minimap-viewport-zoom {
        border: 1px solid #9296eb !important;
    }
    .header {
        padding-top: 0.7rem;
        padding-bottom: 0.7rem;
        background-color: #ffffff;
        display: flex;
        padding: 0 1.4rem;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 9;
        align-items: center;
        height: 3rem;
    }
    .header-logo {
        width: auto;
        height: 1.4rem;
        margin-right: 0.5rem;
    }
    .header-items {
        margin-top: 7px;
    }
    .header-items__tagline {
        font-style: italic;
        font-weight: 500;
    }

    .header-items__checkbox {
        margin-left: 10px;
    }

    .footer {
        padding-top: 0.7rem;
        padding-bottom: 0.7rem;
        background-color: #ffffff;
        display: flex;
        padding: 0 1.4rem;
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 9;
        align-items: center;
        height: 3rem;
    }

    .footer div {
        margin-right: 3rem;
    }

    .footer div span {
        font-weight: 600;
    }
</style>
