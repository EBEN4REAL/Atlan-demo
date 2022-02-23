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

        <!-- Graph Process Loader -->
        <AtlanLoader
            v-if="loaderCords.x"
            class="absolute h-5 opacity-70"
            :style="`left: ${offsetLoaderCords.x}px; top: ${offsetLoaderCords.y}px; z-index: 999`"
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

        <!-- AssetDrawer -->
        <AssetDrawer
            :guid="selectedAssetGuid"
            :show-drawer="isDrawerVisible && selectedAssetGuid"
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
        computed,
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
        setup(_, { emit }) {
            /** INJECTIONS */
            const lineage = inject('lineage')
            const baseEntity = inject('baseEntity')
            const selectedAsset = inject('selectedAsset')
            const preferences = inject('preferences', ref({}))
            const control = inject('control')

            /** DATA */
            const graphHeight = ref(0)
            const graphWidth = ref(0)
            const resetSelections = ref(false)
            const graphContainer = ref(null)
            const minimapContainer = ref(null)
            const lineageContainer = ref({})
            const graph = ref({})
            const graphLayout = ref({})
            const showMinimap = ref(false)
            const searchItems = ref([])
            const assetGuidToHighlight = ref('') // TODO:
            const highlightedNode = ref('')
            const loaderCords = ref({})
            const currZoom = ref('...')
            const isDrawerVisible = ref(false)
            const isComputeDone = ref(false)
            const drawerActiveKey = ref('Overview')
            const selectedTypeInRelationDrawer = ref('__all')
            let removeListeners = () => {}

            /** COMPUTED */
            const selectedAssetGuid = computed(() => selectedAsset.value?.guid)
            const offsetLoaderCords = computed(() => {
                const isFullScr = !!document.fullscreenElement
                return {
                    x: isFullScr
                        ? loaderCords.value.x
                        : (loaderCords.value.x || 0) - 25,
                    y: isFullScr
                        ? loaderCords.value.y
                        : (loaderCords.value.y || 0) - 148,
                }
            })

            /** METHODS */
            // onSelectAsset
            const onSelectAsset = (
                item,
                highlight = false,
                openDrawer = true
            ) => {
                if (openDrawer) isDrawerVisible.value = true
                if (typeof control === 'function')
                    control('selectedAsset', item)
                if (highlight) assetGuidToHighlight.value = item.guid
            }

            // onCloseDrawer
            const onCloseDrawer = () => {
                isDrawerVisible.value = false
                resetSelections.value = true
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
                    searchItems,
                    currZoom,
                    isComputeDone,
                    emit,
                })

                // useEventGraph
                const { registerAllListeners } = useEventGraph({
                    graph,
                    lineage,
                    baseEntity,
                    assetGuidToHighlight,
                    highlightedNode,
                    loaderCords,
                    currZoom,
                    resetSelections,
                    drawerActiveKey,
                    preferences,
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
                removeListeners = registerAllListeners
            }

            /** PROVIDERS */
            provide('searchItems', searchItems)
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
                if (Object.keys(graph.value).length) {
                    if (typeof removeListeners === 'function')
                        removeListeners(true)
                    graph.value.dispose()
                }
            })

            return {
                lineage,
                graph,
                graphHeight,
                graphWidth,
                offsetLoaderCords,
                selectedAssetGuid,
                currZoom,
                showMinimap,
                highlightedNode,
                loaderCords,
                drawerActiveKey,
                isDrawerVisible,
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

            &.isVpNode {
                @apply rounded-full bg-white flex items-center justify-center gap-x-2;
                height: 48px !important;
                padding: unset !important;
            }

            & .popover {
                @apply invisible opacity-0 absolute bottom-16 left-0 py-1 px-2 text-sm;
                @apply delay-75 transition-all;
                @apply rounded-md shadow-md bg-black bg-opacity-70 text-white;
            }

            &.isBase {
                border-top-left-radius: 0;
                border: 1px solid #5277d7 !important;
                background-color: #ffffff !important;

                &.isHighlightedNode {
                    border: 1px solid #5277d7 !important;
                }

                .inscr {
                    line-height: 22px;
                    background: #ffffff;
                    color: #5277d7;
                    position: fixed;
                    border: 1px solid #5277d7;
                    border-bottom: 0;
                    top: -26px;
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
