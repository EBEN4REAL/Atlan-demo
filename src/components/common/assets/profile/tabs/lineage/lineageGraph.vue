<template>
    <div
        ref="lineageContainer"
        class="relative w-full overflow-hidden hide-scrollbar lineage"
        style="height: 82vh"
    >
        <!-- Render Loader -->
        <div
            v-if="!isComputeDone"
            class="flex flex-col items-center justify-center bg-white w-100"
            style="height: 80vh"
        >
            <AtlanLoader class="h-10" />
            <span class="mt-1 text-sm">Rendering graph...</span>
        </div>

        <!-- Graph Container -->
        <div style="display: flex">
            <div ref="graphContainer" style="flex: 1"></div>
        </div>

        <!-- Lineage Header -->
        <LineageHeader v-if="isComputeDone" :graph="graph" />

        <!-- Lineage Footer -->
        <LineageFooter
            :graph="graph"
            :lineage-container="lineageContainer"
            :curr-zoom="currZoom"
            :graph-height="graphHeight"
            :graph-width="graphWidth"
            :base-entity-guid="lineage.baseEntityGuid"
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

        <!-- AssetDrawer -->
        <AssetDrawer
            :watch-guid="true"
            :guid="selectedAsset?.guid || ''"
            :show-mask="false"
            :drawer-active-key="drawerActiveKey"
            :show-close-btn="false"
            @close-drawer="onCloseDrawer"
            @update="handleDrawerUpdate"
        />
    </div>
</template>

<script lang="ts">
    /** VUE */
    import {
        defineComponent,
        ref,
        onMounted,
        onUnmounted,
        provide,
        inject,
    } from 'vue'

    /** COMPONENTS */
    import LineageHeader from './lineageHeader.vue'
    import LineageFooter from './lineageFooter.vue'
    import AssetDrawer from '@/common/assets/preview/drawer.vue'

    /** COMPOSABLES */
    import useCreateGraph from './useCreateGraph'
    import useComputeGraph from './useComputeGraph'
    import useEventGraph from './useEventGraph'

    export default defineComponent({
        name: 'LineageGraph',
        components: {
            LineageHeader,
            LineageFooter,
            AssetDrawer,
        },
        setup() {
            /** INJECTIONS */
            const lineage = inject('lineage')
            const selectedAsset = inject('selectedAsset')
            const preferences = inject('preferences', ref({}))
            const control = inject('control')

            /** DATA */
            const graphHeight = ref(0)
            const graphWidth = ref(0)
            const graphContainer = ref(null)
            const minimapContainer = ref(null)
            const lineageContainer = ref({})
            const graph = ref({})
            const graphLayout = ref({})
            const showMinimap = ref(false)
            const currZoom = ref('...')
            const isComputeDone = ref(false)
            const drawerActiveKey = ref('Overview')
            const guidToSelectOnGraph = ref('')
            const selectedTypeInRelationDrawer = ref('__all')

            /** METHODS */
            // onSelectAsset
            const onSelectAsset = (item, selectOnGraph = false) => {
                if (typeof control === 'function')
                    control('selectedAsset', item)

                if (!item) return

                if (selectOnGraph) guidToSelectOnGraph.value = item?.guid
            }

            // onCloseDrawer
            const onCloseDrawer = () => {
                onSelectAsset(null)
            }

            // handleDrawerUpdate
            const handleDrawerUpdate = (asset) => {
                if (typeof control === 'function')
                    control('selectedAsset', asset)
            }

            // initialize
            const initialize = async () => {
                // useCreateGraph
                useCreateGraph({
                    graph,
                    graphLayout,
                    graphContainer,
                    minimapContainer,
                    graphWidth,
                    graphHeight,
                })

                // useComputeGraph
                const {
                    addSubGraph,
                    renderLayout,
                    mergedLineageData,
                    sameSourceCount,
                    sameTargetCount,
                    nodes,
                    edges,
                } = await useComputeGraph({
                    graph,
                    graphLayout,
                    lineage,
                    currZoom,
                    isComputeDone,
                })

                // useEventGraph
                useEventGraph({
                    graph,
                    currZoom,
                    preferences,
                    guidToSelectOnGraph,
                    mergedLineageData,
                    sameSourceCount,
                    sameTargetCount,
                    nodes,
                    edges,
                    onSelectAsset,
                    onCloseDrawer,
                    addSubGraph,
                    renderLayout,
                })
            }

            /** PROVIDERS */
            provide('onSelectAsset', onSelectAsset)
            provide('selectedTypeInRelation', selectedTypeInRelationDrawer)

            /** LIFECYCLE */
            onMounted(async () => {
                graphHeight.value = window.outerHeight
                graphWidth.value = window.outerWidth

                if (Object.keys(graph.value).length) graph.value.dispose()
                initialize()
            })

            onUnmounted(() => {
                isComputeDone.value = false
                if (Object.keys(graph.value).length) graph.value.dispose()
            })

            return {
                lineage,
                graph,
                graphHeight,
                graphWidth,
                selectedAsset,
                currZoom,
                showMinimap,
                drawerActiveKey,
                isComputeDone,
                lineageContainer,
                graphContainer,
                minimapContainer,
                onCloseDrawer,
                handleDrawerUpdate,
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
    @keyframes ant-line {
        to {
            stroke-dashoffset: -1000;
        }
    }

    .hide-scrollbar,
    .x6-graph-scroller,
    .ant-tabs-content-holder {
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
            bottom: 1.5rem;
            left: 1.5rem;
            position: absolute;
            z-index: 9;
            background: #ffffff;
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
                right: 1.5rem;
            }
            &.footer {
                bottom: 1.5rem;
                right: 1.5rem;
            }
            & > .controls {
                @apply flex items-center flex-1 gap-x-1;

                & .control-item {
                    @apply px-2 py-1 cursor-pointer rounded text-gray-700;

                    &:hover {
                        @apply text-primary;
                    }
                }
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

        // Non-Process Nodes
        &-node {
            font-size: 16px;
            border: 1.5px solid #e0e4eb;
            background-color: #ffffff;
            border-radius: 6px;
            width: 270px;
            cursor: pointer;
            outline: 0 !important;
            z-index: 9999 !important;
            @apply transition-all duration-100;

            &__content {
                padding: 10px 8px 10px 16px;
                z-index: 9999 !important;

                &:hover {
                    border-radius: 5px;
                    background-color: #f6f8fd;
                }
            }

            &__columns {
                background-color: #f9fafb;
                border-top: 1px solid #e0e4eb;
                border-bottom-right-radius: 5px;
                border-bottom-left-radius: 5px;
                z-index: 9999 !important;

                &-cta {
                    @apply pl-4 pr-2 flex justify-between items-center;
                    color: #3c71df;
                    height: 2.5rem;
                    z-index: 9999 !important;

                    &:hover {
                        text-decoration: underline;
                    }
                }

                &-list {
                    @apply bg-white;
                    margin: 0 10px 0px 10px;
                    border: 1px solid #e0e4eb;
                    border-bottom-width: 0px;
                    border-radius: 6px;
                    color: #3e4359 !important;
                    z-index: 9999 !important;

                    & .node-column {
                        @apply pl-3 pr-2 py-2;
                        border: 1px solid transparent;
                        border-bottom: 1px solid #e0e4eb;
                        box-sizing: border-box;
                        margin-top: -1px;
                        z-index: 1;

                        &.selected-port {
                            color: #3c71df;
                            border-color: #3c71df;
                            background-color: #ebf1ff;
                            z-index: 999;

                            &:hover {
                                background-color: #ebf1ff;
                                border-top: 1px solid #3c71df;
                            }
                        }

                        &.highlighted-port {
                            color: #3c71df;
                            border-color: #3c71df;
                            background-color: #ffffff;
                            z-index: 999;

                            &:hover {
                                background-color: #ffffff;
                                border-top: 1px solid #3c71df;
                            }
                        }

                        &:hover {
                            background-color: #f6f8fd;
                            border-top: 1px solid #e0e4eb;
                            z-index: 1;
                        }

                        &:first-child {
                            border-top-right-radius: 5px;
                            border-top-left-radius: 5px;
                        }

                        &:last-child {
                            border-bottom-right-radius: 5px;
                            border-bottom-left-radius: 5px;
                        }
                    }
                }
            }

            &.isVpNode {
                @apply rounded-full bg-white flex items-center justify-center gap-x-2;
                height: 40px !important;
                padding: unset !important;
            }

            & .popover {
                @apply opacity-0 absolute bottom-20 left-0 py-1 px-2 text-xs transition-opacity rounded-md shadow-md bg-black bg-opacity-70 text-white;
            }

            & .ctaPortRight {
                @apply absolute bg-white h-8 w-8 rounded-full flex justify-center items-center;
                border-width: 1.5px;
                border-style: solid;
                border-color: inherit;
                top: 19px !important;
                right: -15px !important;
                z-index: 9999 !important;

                &:hover {
                    background-color: #f6f8fd;
                }
            }

            & .ctaPortLeft {
                @apply absolute bg-white h-8 w-8 rounded-full flex justify-center items-center;
                border-width: 1.5px;
                border-style: solid;
                border-color: inherit;
                top: 19px !important;
                left: -15px !important;
                z-index: 9999 !important;

                &:hover {
                    background-color: #f6f8fd;
                }
            }

            &.isBase {
                border-top-left-radius: 0;
                border: 1.5px solid #3c71df !important;
                background-color: #ffffff !important;

                &.isSelectedNode {
                    border: 1.5px solid #3c71df !important;
                }

                .inscr {
                    line-height: 22px;
                    background: #ffffff;
                    color: #3c71df;
                    position: fixed;
                    border: 1.5px solid #3c71df;
                    border-bottom: 0;
                    top: -27px;
                    padding: 3px 8px 0px 8px;
                    left: 0;
                    border-top-right-radius: 4px;
                    border-top-left-radius: 4px;
                }

                .popover {
                    left: 60px;
                }
            }

            & .node-text {
                @apply text-gray font-bold truncate text-base leading-5;
            }

            & .node-meta {
                display: flex;
                align-items: center;
                @apply mt-1;

                &__text {
                    @apply text-base flex-shrink flex-grow-0 text-gray-500;
                    margin: 0 3px;

                    &.isTypename {
                        @apply flex-shrink-0;
                    }

                    &.isCounter {
                        background: #9ca1a9;
                        color: white;
                        padding: 2px 5px 0px 5px;
                        border-radius: 2px;
                        line-height: 1.3rem;
                        position: fixed;
                        left: 6px;
                        top: -17px;
                    }
                }

                &__source {
                    width: 14px;
                    height: 14px;
                    margin-bottom: 2px;
                }
            }
        }

        .isGrayed {
            border: 1.5px solid #e0e4eb;

            .node-text {
                color: #6f7590 !important;

                &.type {
                    color: #6f7590 !important;
                }
            }
        }

        .isSelectedNode {
            border: 1.5px solid #3c71df !important;
            background-color: #ebf1ff !important;
            color: #3c71df;

            // &:hover {
            //     border: 1.5px solid #3c71df !important;
            //     background-color: #ebf1ff !important;
            //     color: #3c71df;
            // }

            & .node-title {
                color: #3c71df;
            }
            & .caret-bg {
                background: linear-gradient(
                    270deg,
                    #f6f8fd 0%,
                    #f6f8fd 84.68%,
                    rgba(255, 255, 255, 0) 103.12%
                ) !important;
            }
        }

        .isExpandedNode {
            & .lineage-node__columns {
                padding-bottom: 10px !important;
            }
        }

        .isHighlightedNode {
            border: 1.5px solid #3c71df;
            background-color: #ffffff;

            // &:hover {
            //     border: 1.5px solid #3c71df;
            //     background-color: #ffffff;
            // }
        }

        .caret-expanded {
            @apply transform rotate-180;
        }

        .caret-bg {
            background: linear-gradient(
                270deg,
                #ffffff 0%,
                #ffffff 84.68%,
                rgba(255, 255, 255, 0) 103.12%
            );
        }

        .node-columnListLoader {
            position: absolute;
            z-index: 99;
            left: 115px !important;
            top: 15px !important;
        }
    }
</style>
