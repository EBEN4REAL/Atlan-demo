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
            @dblclick="get_path(null)"
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
                            :expand-icon="handleExpandIcon"
                            active-key="1"
                        >
                            <a-collapse-panel key="1" :force-render="true">
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
                                        get_content_height(
                                            group.groupId,
                                            group.fields.length
                                        )
                                    "
                                >
                                    <div
                                        v-for="(node, index) in group.fields"
                                        :key="'node' + String(index)"
                                        class="w-full h-full cursor-pointer"
                                        @click.stop="get_path(node.guid)"
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
                                                'bg-primary-light border-primary':
                                                    is_highlighted_node(
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
                                                    fetch_columns_list(
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
                                get_content_height(
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
                                    'border border-primary':
                                        is_highlighted_node(node.guid),
                                }"
                                :style="
                                    get_item_top_position(
                                        group.type,
                                        group.groupId,
                                        index
                                    )
                                "
                                @click.stop="get_path(node.guid)"
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

            // compute_graph_relations
            // restartComputation
            const _restartComputation = () => {
                useLineageCompute.restartComputation(
                    compute_graph_relations,
                    lines,
                    layoutColumns,
                    glGraph
                )
            }

            // get_path
            const get_path = (guid) => {
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

            // update_lines
            const update_lines = () => {
                useLineageLines.updateLines(lines)
            }

            // is_highlighted_node
            const is_highlighted_node = (guid) =>
                useLineageLines.isHighlightedNode(guid, selectedPathGuids)

            // center_node
            const center_node = () => {
                useLineageDOM.centerNode(
                    lineage.value.baseEntityGuid,
                    layoutColumns,
                    panZoomInstance
                )
            }

            // handle_zoom
            const handle_zoom = (val) => {
                useLineagePanZoom.handleZoom(val, panZoomInstance)
            }

            // handle_fullscreen
            const handle_fullscreen = (lineage_graph_wrapper_ref) =>
                useLineagePanZoom.handleFullscreen(
                    update_lines,
                    lineage_graph_wrapper_ref
                )

            // get_item_top_position
            const get_item_top_position = (type, groupId, currNodeIndex) =>
                useLineageDOM.getItemTopPosition(
                    type,
                    groupId,
                    currNodeIndex,
                    expandedNodes
                )

            // get_content_height
            const get_content_height = (groupId, length) =>
                useLineageDOM.getContentHeight(groupId, length, expandedNodes)

            // get_expanded_node_height
            const get_expanded_node_height = () => {
                const { expandedNodes: e } =
                    useLineageDOM.getExpandedNodeHeight(
                        layoutColumns,
                        refs,
                        update_lines
                    )
                expandedNodes.value = e
            }

            // set_pan_zoom_event
            const set_pan_zoom_event = async () => {
                const { panStarted: g, panZoomInstance: h } =
                    await useLineagePanZoom.setPanZoomEvent(
                        lineage_graph_container_ref,
                        update_lines
                    )
                panStarted.value = g.value
                panZoomInstance.value = h.value
            }

            // pause_pan_zoom_event
            const pause_pan_zoom_event = (val) => {
                useLineagePanZoom.pausePanZoomEvent(val, panZoomInstance)
            }

            // fetch_columns_list
            const fetch_columns_list = async (groupId, guid) => {
                columnsListLoading.value = true
                const { expandedNodeGroups: _expandedNodeGroups } =
                    await useLineageColumns.fetchColumnsList(
                        groupId,
                        guid,
                        expandedNodes,
                        pause_pan_zoom_event,
                        get_expanded_node_height
                    )
                expandedNodeGroups.value = _expandedNodeGroups
                columnsListLoading.value = false
            }

            const handleExpandIcon = () => {
                update_lines()
            }

            const compute_graph_relations = async () => {
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
                get_expanded_node_height()

                // drawLines
                if (hasLineage.value) {
                    const { lines: f } = useLineageLines.drawLines(
                        refs,
                        linesWrapper
                    )
                    lines.value = f
                }

                // setPanZoomEvent
                await set_pan_zoom_event()

                // centerNode
                center_node()
            }

            /** LIFECYCLE */
            // onMounted
            onMounted(() => {
                compute_graph_relations()
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
                get_item_top_position,
                get_content_height,
                handle_zoom,
                handle_fullscreen,
                get_path,
                _restartComputation,
                is_highlighted_node,
                fetch_columns_list,
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
