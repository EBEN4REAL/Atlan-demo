<template>
    <div
        ref="lineageContainer"
        class="relative w-full overflow-hidden hide-scrollbar lineage"
        style="height: 82vh"
    >
        <div
            v-if="!isComputeDone"
            class="flex items-center justify-center bg-white w-100"
            style="height: 80vh"
        >
            <div>
                <a-spin tip="Rendering graph..." />
            </div>
        </div>

        <a-spin
            v-if="loaderCords.x"
            :style="`position: absolute; left: ${loaderCords.x - 25}px; top: ${
                loaderCords.y - 148
            }px; z-index: 999`"
        />

        <!-- Graph Container -->
        <div style="display: flex">
            <div ref="graphContainer" style="flex: 1"></div>
        </div>
        <!-- Lineage Header -->
        <LineageHeader
            v-if="isComputeDone"
            :base-entity-guid="lineage.baseEntityGuid"
            :highlighted-node="highlightedNode"
            :is-cyclic="false"
            :graph="graph"
            @show-add-lineage="onShowAddLineage($event)"
        />

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

        <!-- Add Lineage -->
        <LineageAdd
            v-if="graph"
            :visible="showAddLineage"
            style="z-index: 600"
            @cancel="showAddLineage = false"
        />
        <AssetDrawer
            :data="selectedAsset"
            :show-drawer="isDrawerVisible"
            :show-mask="false"
            :drawer-active-key="drawerActiveKey"
            @close-drawer="onCloseDrawer"
            @update="handleDrawerUpdate"
        />
    </div>
</template>

<script lang="ts">
    /** PACKAGES */
    import {
        defineComponent,
        ref,
        onMounted,
        onUnmounted,
        provide,
        toRefs,
        inject,
    } from 'vue'
    /** COMPONENTS */
    import LineageHeader from './lineageHeader.vue'
    import LineageFooter from './lineageFooter.vue'
    import LineageAdd from './lineageAdd.vue'
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
            LineageAdd,
            AssetDrawer,
        },
        props: {
            lineage: {
                type: Object,
                required: true,
            },
        },
        setup(props, { emit }) {
            /** INJECTIONS */
            const control = inject('control')
            const baseEntity = inject('baseEntity')
            const selectedAsset = inject('selectedAsset')
            const config = inject('config')

            /** DATA */
            const isDrawerVisible = ref(false)
            const { lineage } = toRefs(props)
            const graphHeight = ref(0)
            const graphWidth = ref(0)
            const resetSelections = ref(false)
            const graphContainer = ref(null)
            const minimapContainer = ref(null)
            const lineageContainer = ref(null)
            const graph = ref(null)
            const graphLayout = ref({})
            const showAddLineage = ref(false)
            const showMinimap = ref(false)
            const searchItems = ref([])
            const assetGuidToHighlight = ref('')
            const highlightedNode = ref('')
            const loaderCords = ref({})
            const currZoom = ref('...')
            const isComputeDone = ref(false)
            const drawerActiveKey = ref('Info')

            /** METHODS */
            // onSelectAsset
            const onSelectAsset = (
                item,
                highlight = false,
                openDrawer = true
            ) => {
                if (openDrawer) isDrawerVisible.value = true
                control('selectedAsset', item)
                control('selectedAssetGuid', item.guid)
                if (highlight) assetGuidToHighlight.value = item.guid
            }

            const onCloseDrawer = () => {
                isDrawerVisible.value = false
                resetSelections.value = true
            }

            const handleDrawerUpdate = (asset) => {
                control('selectedAsset', asset)
            }
            // initialize
            const initialize = async () => {
                // useGraph
                useCreateGraph(
                    graph,
                    graphLayout,
                    graphContainer,
                    minimapContainer,
                    graphWidth,
                    graphHeight
                )

                // useComputeGraph
                await useComputeGraph(
                    graph,
                    graphLayout,
                    lineage,
                    searchItems,
                    currZoom,
                    isComputeDone,
                    emit
                )

                // useEventGraph
                useEventGraph(
                    graph,
                    baseEntity,
                    assetGuidToHighlight,
                    highlightedNode,
                    loaderCords,
                    currZoom,
                    resetSelections,
                    config,
                    drawerActiveKey,
                    onSelectAsset,
                    onCloseDrawer
                )
            }

            /** PROVIDERS */
            provide('searchItems', searchItems)
            provide('onSelectAsset', onSelectAsset)

            // onShowAddLineage
            const onShowAddLineage = () => {
                showAddLineage.value = true
            }

            /** LIFECYCLE */
            onMounted(async () => {
                graphHeight.value = window.outerHeight
                graphWidth.value = window.outerWidth

                if (graph.value) graph.value.dispose()
                await initialize()
                if (selectedAsset.value?.guid) {
                    const highlight =
                        selectedAsset.value.guid !== baseEntity.value.guid
                    if (!highlight) return
                    onSelectAsset(selectedAsset.value, highlight)
                }
            })

            onUnmounted(() => {
                isComputeDone.value = false
                // removedNodes.value = {}
                if (graph.value) graph.value.dispose()
            })

            return {
                isDrawerVisible,
                selectedAsset,
                baseEntity,
                graph,
                showMinimap,
                showAddLineage,
                lineageContainer,
                graphContainer,
                minimapContainer,
                currZoom,
                highlightedNode,
                assetGuidToHighlight,
                isComputeDone,
                loaderCords,
                graphHeight,
                graphWidth,
                drawerActiveKey,
                onShowAddLineage,
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
    .node-added-shadow {
        box-shadow: 0 2.8px 2.2px rgba(0, 179, 138, 0.12),
            0 6.7px 5.3px rgba(0, 179, 138, 0.12),
            0 12.5px 10px rgba(0, 179, 138, 0.12),
            0 22.3px 17.9px rgba(0, 179, 138, 0.12),
            0 41.8px 33.4px rgba(0, 179, 138, 0.12),
            0 100px 80px rgba(0, 179, 138, 0.12);
    }
    .l-m20px {
        left: -20px;
    }

    .r-m20px {
        right: -20px;
    }

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
            bottom: 1rem;
            left: 1.5rem;
            position: absolute;
            z-index: 9;
            background: #ffffff;

            &__item {
                display: flex;
                align-items: center;
                margin-bottom: 0.8rem;

                &:last-child {
                    margin-bottom: 0;
                }

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

        // Process Nodes
        &-process {
            border: 1px solid #e6e6eb;
            border-radius: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #ffffff;
            width: 60px;
            height: 60px;
            cursor: pointer;

            &.isHighlightedNode {
                border: 1px solid #5277d7;
            }
            &.isHighlightedNodePath {
                border: 1px solid #5277d7;
            }

            & > .process-icon {
                color: #64748b;
            }

            &.isGrayed > .process-icon {
                color: #b6b9c5;
            }
        }

        // Non-Process Nodes
        &-node {
            padding: 10px 8px 0px 10px;
            font-size: 16px;
            border: 1px solid #e6e6eb;
            border-radius: 4px;
            background-color: #ffffff;
            width: 270px;
            height: 70px;
            cursor: pointer;
            outline: 0 !important;
            @apply transition-all duration-300;

            &:hover {
                @apply shadow-lg;
            }

            &__content {
                display: flex;
                align-items: center;
            }

            &.isBase {
                border-top-left-radius: 0;
                border: 1px solid #5277d7 !important;
                background-color: #ffffff !important;

                &.isHighlightedNode {
                    border: 1px solid #5277d7 !important;
                }

                .inscr {
                    position: relative;
                    width: 100%;
                    z-index: 99;
                    display: block;

                    &-item {
                        line-height: 22px;
                        background: #ffffff;
                        color: #5277d7;
                        position: absolute;
                        border: 1px solid #5277d7;
                        border-bottom: 0;
                        top: -37px;
                        padding: 3px 8px 0px 8px;
                        left: -11px;
                        border-top-right-radius: 4px;
                        border-top-left-radius: 4px;
                    }
                }
            }

            & .node-text {
                @apply text-gray-500 font-bold truncate text-base leading-5;
            }

            & .node-meta {
                display: flex;
                align-items: center;
                @apply mt-1;

                &__text {
                    @apply text-base;
                    text-transform: capitalize;
                    color: #6f7590;
                    margin: 0 6px;
                }

                &__source {
                    width: 1rem;
                    height: 1rem;
                    margin-bottom: 0.2rem;
                    margin-right: 2px;
                }
            }
        }

        .isGrayed {
            border: 1px solid #e6e6eb !important;

            .node-text {
                color: #6f7590 !important;

                &.type {
                    color: #6f7590 !important;
                }
            }
        }

        .isHighlightedNode {
            border: 1px solid #5277d7 !important;
            background-color: #f4f6fd !important;
            @apply text-primary;
            & .node-title {
                @apply text-primary;
            }
            & .caret-bg {
                background: linear-gradient(
                    270deg,
                    #f4f6fd 0%,
                    #f4f6fd 84.68%,
                    rgba(255, 255, 255, 0) 103.12%
                ) !important;
            }
        }

        .isHighlightedNodePath {
            border: 1px solid #5277d7;
            background-color: #ffffff;
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
    }
</style>
