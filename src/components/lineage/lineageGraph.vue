/* eslint-disable no-underscore-dangle */
<template>
    <div
        v-if="layoutColumns.length > 0"
        class="w-full h-full component"
        :class="{ 'absolute top-0': !isCyclic }"
    >
        <!-- Lineage Graph -->
        <div
            v-if="!isCyclic"
            ref="lineage_graph_ref"
            class="w-full h-full lineage-graph"
            :class="{
                'cursor-grab': !panStarted,
                'cursor-grabbing': panStarted,
                'cursor-wait': columnsListLoading,
            }"
            @dblclick="_getPath(null)"
        >
            <div
                ref="lineage_graph_container_ref"
                class="flex items-center w-full"
            >
                <div
                    v-for="(layoutColumn, index) in layoutColumns"
                    :key="'layoutColumn' + String(index)"
                >
                    <!-- group starts here -->
                    <div
                        v-for="(group, index) in layoutColumn"
                        :key="'group' + String(index)"
                        class="z-10 mb-16 mr-24 text-xs border"
                        :class="{
                            'w-12': group.type === 'Process',
                            'border-success border-2': group.base,
                            'w-80 bg-white': group.type !== 'Process',
                        }"
                    >
                        <!-- group accordian starts here  -->
                        <a-collapse
                            v-if="group.type !== 'Process'"
                            expand-icon-position="right"
                            :bordered="false"
                            :accordion="true"
                            :expandIcon="handleExpandIcon"
                            activeKey="1"
                        >
                            <a-collapse-panel key="1" :forceRender="true">
                                <!-- header -->
                                <template #header>
                                    <div
                                        :id="group.groupId"
                                        :ref="
                                            (el) => {
                                                el
                                                    ? (refs[group.groupId] = el)
                                                    : refs
                                            }
                                        "
                                        class="flex items-center w-full h-full p-3 text-sm font-bold bg-white "
                                    >
                                        <img
                                            :src="getIcon(group.source)"
                                            class="w-5 h-5 mr-2"
                                        />

                                        <!-- header label -->
                                        <div class="font-bold">
                                            {{
                                                group.source
                                                    .charAt(0)
                                                    .toUpperCase()
                                            }}{{ group.source.slice(1) }}
                                            {{ group.type }}
                                            ({{ group.fields.length }})
                                        </div>
                                    </div>
                                </template>
                                <!-- header ends here -->

                                <!-- group content starts here  -->
                                <div
                                    v-if="group.type !== 'Process'"
                                    class="relative p-0 overflow-hidden"
                                    :style="
                                        _getContentHeight(
                                            group.groupId,
                                            group.fields.length
                                        )
                                    "
                                >
                                    <div
                                        v-for="(node, index) in group.fields"
                                        :key="'node' + String(index)"
                                        class="w-full h-full cursor-pointer"
                                        @click.stop="_getPath(node.guid)"
                                    >
                                        <div
                                            v-if="group.type !== 'Process'"
                                            :id="node.guid"
                                            :ref="
                                                (el) => {
                                                    el
                                                        ? (refs[node.guid] = el)
                                                        : refs
                                                }
                                            "
                                            class="relative flex items-center h-full px-5 text-sm lowercase bg-white border cursor-pointer  hover:border-primary justify-space-between"
                                            :class="{
                                                'bg-success-muted': group.base,
                                                'bg-primary-muted border-primary':
                                                    _isHighlightedNode(
                                                        node.guid
                                                    ),
                                            }"
                                        >
                                            <!-- Node display text -->
                                            <span
                                                class="overflow-hidden  overflow-ellipsis whitespace-nowrap"
                                                :style="{
                                                    width: showColumns
                                                        ? '10rem'
                                                        : '100%',
                                                }"
                                            >
                                                {{ node.displayText }}
                                            </span>
                                            <button
                                                v-if="showColumns"
                                                :class="{
                                                    'cursor-wait':
                                                        columnsListLoading &&
                                                        expandedNodeGroups[
                                                            group.groupId
                                                        ],
                                                }"
                                                @click.stop="
                                                    _fetchColumnsList(
                                                        group.groupId,
                                                        node.guid
                                                    )
                                                "
                                            >
                                                <fa
                                                    v-if="
                                                        expandedNodeGroups[
                                                            group.groupId
                                                        ] === node.guid
                                                    "
                                                    icon="fal minus"
                                                ></fa>
                                                <fa v-else icon="fal plus"></fa>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </a-collapse-panel>
                        </a-collapse>
                        <!-- accordion ends here -->
                        <!-- accordion is not needed if process node -->
                        <div
                            v-if="group.type === 'Process'"
                            class="flex items-center justify-center w-12 p-0 overflow-hidden bg-transparent "
                            :style="
                                _getContentHeight(
                                    group.groupId,
                                    group.fields.length
                                )
                            "
                        >
                            <div
                                v-for="(node, index) in group.fields"
                                :key="'node' + String(index)"
                                class="w-full h-full cursor-pointer"
                                :class="{
                                    'border border-primary': _isHighlightedNode(
                                        node.guid
                                    ),
                                }"
                                :style="
                                    _getItemTopPosition(
                                        group.type,
                                        group.groupId,
                                        index
                                    )
                                "
                                @click.stop="_getPath(node.guid)"
                            >
                                <div
                                    v-if="group.type === 'Process'"
                                    :id="node.guid"
                                    :ref="
                                        (el) => {
                                            el ? (refs[node.guid] = el) : refs
                                        }
                                    "
                                    class="relative flex items-center justify-center w-full h-full bg-transparent cursor-pointer "
                                >
                                    <fa icon="fal cog" class="w-8 h-8"></fa>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Cyclic Lineage Graph Info -->
        <div v-if="isCyclic" class="relative block w-full h-full no-transform">
            <div class="flex items-center justify-center h-full flex-column">
                <!-- <img :src="LineageEmptyIllus" style="width: 32rem" /> -->
                <p class="mb-0">
                    Sorry, we don't support cyclic lineages yet."
                    <br />
                </p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    // Vue
    import {
        defineComponent,
        inject,
        onMounted,
        onBeforeUnmount,
        ref,
        nextTick,
        computed,
    } from 'vue'

    // Util
    import { getIcon } from '~/components/lineage/util'
    // Components
    import LineageColumnList from '~/components/lineage/lineageColumnList.vue'

    // Composables
    import * as useLineageCompute from '~/composables/lineage/useLineageCompute'
    import * as useLineageDOM from '~/composables/lineage/useLineageDOM'
    import * as useLineageLines from '~/composables/lineage/useLineageLines'
    import * as useLineagePanZoom from '~/composables/lineage/useLineagePanZoom'
    import * as useLineageColumns from '~/composables/lineage/useLineageColumns'

    export default defineComponent({
        name: 'LineageGraphComponent',
        components: { LineageColumnList },
        setup() {
            /** INJECTIONS */
            const lineage = inject('lineage')
            const asset = inject('asset')
            const linesWrapper = inject('linesWrapper')
            const setSearchItems = inject('setSearchItems')
            const showProcessNodes = inject('showProcessNodes')
            const direction = inject('direction')

            /** DATA */
            const lineage_graph_ref = ref(null)
            const lineage_graph_container_ref = ref(null)
            const refs = ref({})
            const glGraph = ref({})
            const layoutColumns = ref([])
            const searchItems = ref([])
            const cycles = ref([])
            const selectedPathGuids = ref([])
            const lines = ref([])
            const pathGuid = ref(null)
            const panStarted = ref(false)
            const panZoomInstance = ref({})
            const expandedNodes = ref([])
            const expandedNodeGroups = ref({})
            const columnsListLoading = ref(false)
            const hasLineage = computed(
                () => lineage.value?.relations.length !== 0
            )
            const panelActiveKey = ref('1')
            // const header=computed((type,))
            /** METHODS */

            // _computeGraphRelations
            const _computeGraphRelations = async () => {
                const {
                    glGraph: a,
                    layoutColumns: b,
                    searchItems: c,
                    cycles: d,
                } = useLineageCompute.computeGraphRelations(
                    lineage,
                    'graph',
                    asset,
                    showProcessNodes,
                    direction
                )

                glGraph.value = a
                layoutColumns.value = b
                searchItems.value = c
                cycles.value = d

                // setSearchItems
                setSearchItems(searchItems)

                // getExpandedNodeHeight
                _getExpandedNodeHeight()

                // drawLines
                if (hasLineage.value) {
                    const { lines: f } = useLineageLines.drawLines(
                        refs,
                        linesWrapper
                    )
                    lines.value = f
                }

                // setPanZoomEvent
                await _setPanZoomEvent()

                // centerNode
                _centerNode()
            }

            // restartComputation
            const _restartComputation = () => {
                useLineageCompute.restartComputation(
                    _computeGraphRelations,
                    lines,
                    layoutColumns,
                    glGraph
                )
            }

            // _getPath
            const _getPath = (guid) => {
                useLineageLines.getPath(guid, pathGuid, selectedPathGuids)
                if (pathGuid.value && hasLineage.value) {
                    const { selectedPathGuids: f } =
                        useLineageLines.highlightLines(
                            glGraph,
                            pathGuid,
                            lines,
                            showProcessNodes,
                            direction
                        )
                    selectedPathGuids.value = f
                }
            }

            // _updateLines
            const _updateLines = () => {
                useLineageLines.updateLines(lines)
            }

            // _isHighlightedNode
            const _isHighlightedNode = (guid) => {
                return useLineageLines.isHighlightedNode(
                    guid,
                    selectedPathGuids
                )
            }

            // _centerNode
            const _centerNode = () => {
                useLineageDOM.centerNode(
                    lineage.value.baseEntityGuid,
                    layoutColumns,
                    panZoomInstance
                )
            }

            // _handleZoom
            const _handleZoom = (val) => {
                useLineagePanZoom.handleZoom(val, panZoomInstance)
            }

            // _handleFullscreen
            const _handleFullscreen = (lineage_graph_wrapper_ref) => {
                useLineagePanZoom.handleFullscreen(
                    _updateLines,
                    lineage_graph_wrapper_ref
                )
            }

            // _getItemTopPosition
            const _getItemTopPosition = (type, groupId, currNodeIndex) => {
                return useLineageDOM.getItemTopPosition(
                    type,
                    groupId,
                    currNodeIndex,
                    expandedNodes
                )
            }

            // _getContentHeight
            const _getContentHeight = (groupId, length) => {
                return useLineageDOM.getContentHeight(
                    groupId,
                    length,
                    expandedNodes
                )
            }

            // _getExpandedNodeHeight
            const _getExpandedNodeHeight = () => {
                const { expandedNodes: e } =
                    useLineageDOM.getExpandedNodeHeight(
                        layoutColumns,
                        refs,
                        _updateLines
                    )
                expandedNodes.value = e
            }

            // _setPanZoomEvent
            const _setPanZoomEvent = async () => {
                const { panStarted: g, panZoomInstance: h } =
                    await useLineagePanZoom.setPanZoomEvent(
                        lineage_graph_container_ref,
                        _updateLines
                    )
                panStarted.value = g.value
                panZoomInstance.value = h.value
            }

            // _pausePanZoomEvent
            const _pausePanZoomEvent = (val) => {
                useLineagePanZoom.pausePanZoomEvent(val, panZoomInstance)
            }

            // _fetchColumnsList
            const _fetchColumnsList = async (groupId, guid) => {
                columnsListLoading.value = true
                const { expandedNodeGroups: _expandedNodeGroups } =
                    await useLineageColumns.fetchColumnsList(
                        groupId,
                        guid,
                        expandedNodes,
                        _pausePanZoomEvent,
                        _getExpandedNodeHeight
                    )
                expandedNodeGroups.value = _expandedNodeGroups
                columnsListLoading.value = false
            }

            const handleExpandIcon = () => {
                _updateLines()
            }
            /** LIFECYCLE */
            // onMounted
            onMounted(() => {
                _computeGraphRelations()
            })

            // onBeforeUnmount
            onBeforeUnmount(() => {
                nextTick(() => {
                    lines.value.forEach((l) => l.remove())
                    if (panZoomInstance.value) panZoomInstance.value.dispose()
                })
            })

            return {
                lines,
                lineage_graph_ref,
                lineage_graph_container_ref,
                refs,
                columnsListLoading,
                panStarted,
                glGraph,
                layoutColumns,
                searchItems,
                cycles,
                expandedNodeGroups,
                pathGuid,
                getIcon,
                isCyclic: false, //
                showColumns: false, //
                _getItemTopPosition,
                _getContentHeight,
                _handleZoom,
                _handleFullscreen,
                _getPath,
                _restartComputation,
                _isHighlightedNode,
                _fetchColumnsList,
                handleExpandIcon,
                panelActiveKey,
            }
        },
    })
</script>

<style>
    .leader-line {
        /* z-index: 9 !important; */
    }
</style>

<style lang="less" scoped>
    .top-0 {
        top: 0;
    }

    .cursor-wait {
        cursor: wait;
    }

    .cursor-grab {
        cursor: grab;
    }

    .cursor-grabbing {
        cursor: grabbing;
    }

    .no-transform {
        transform-origin: unset !important;
        transform: unset !important;
    }

    .component {
        position: unset;
    }

    .lineage-graph {
        position: absolute;
        overflow: hidden;
        -ms-overflow-style: none; /* Hide scrollbar for  IE and Edge */
        scrollbar-width: none; /* Hide scrollbar for  Firefox */

        &::-webkit-scrollbar {
            display: none; /* Hide scrollbar for Chrome, Safari and Opera */
        }
    }

    :global(.ant-collapse-content-box) {
        @apply p-0 !important;
    }
    :global(.ant-collapse-header) {
        @apply font-bold bg-white p-0 !important;
    }
</style>
