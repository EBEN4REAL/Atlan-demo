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
                        class="z-10 mb-16 mr-24 text-xs"
                        :class="{
                            'w-12': group.type === 'Process',
                            'w-80 bg-white': group.type !== 'Process',
                        }"
                    >
                        <!-- group accordion starts here  -->
                        <a-collapse
                            v-if="group.type !== 'Process'"
                            expand-icon-position="right"
                            :bordered="false"
                            :accordion="true"
                            :active-key="group.groupId"
                        >
                            <a-collapse-panel
                                :key="group.groupId"
                                :forceRender="true"
                            >
                                <!-- group header starts here -->
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
                                        class="flex items-center w-full h-full p-3 text-sm font-bold bg-white border border-b-0 border-gray-300 rounded-t "
                                        :class="{
                                            'border-success': group.base,
                                        }"
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

                                <!-- group content starts here  -->
                                <div
                                    v-if="group.type !== 'Process'"
                                    class="relative p-0 overflow-hidden bg-transparent "
                                    :style="`height: ${
                                        contentHeights[group.groupId] ||
                                        38 * group.fields.length
                                    }px`"
                                >
                                    <div
                                        v-for="(node, index) in group.fields"
                                        :id="'group-content-' + node.guid"
                                        :key="'node' + String(index)"
                                        :ref="
                                            (el) => {
                                                el
                                                    ? (refs[
                                                          'group-content-' +
                                                              node.guid
                                                      ] = el)
                                                    : refs
                                            }
                                        "
                                        class="absolute w-full cursor-pointer"
                                        :style="getTopPosition(node.guid)"
                                        @click.stop="get_path(node.guid)"
                                    >
                                        <!-- node accordion starts here -->
                                        <a-collapse
                                            expand-icon-position="left"
                                            :bordered="false"
                                            :accordion="true"
                                            @change="
                                                handleExpand(
                                                    group.groupId,
                                                    group.fields.length,
                                                    node.guid
                                                )
                                            "
                                        >
                                            <a-collapse-panel
                                                :key="node.guid"
                                                :forceRender="true"
                                            >
                                                <!-- node header starts here -->
                                                <template #header>
                                                    <div
                                                        v-if="
                                                            group.type !==
                                                            'Process'
                                                        "
                                                        :id="node.guid"
                                                        :ref="
                                                            (el) => {
                                                                el
                                                                    ? (refs[
                                                                          node.guid
                                                                      ] = el)
                                                                    : refs
                                                            }
                                                        "
                                                        class="relative flex items-center h-full py-2 pl-10 pr-5 text-sm lowercase bg-white border border-gray-300 cursor-pointer  hover:border-primary justify-space-between"
                                                        :class="{
                                                            'bg-success-muted border-success':
                                                                group.base,
                                                            'bg-primary-muted border-primary':
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
                                                            {{
                                                                node.displayText
                                                            }}
                                                        </span>
                                                    </div>
                                                </template>
                                                <!-- node content starts here -->
                                                <div
                                                    :id="
                                                        'node-content-' +
                                                        node.guid
                                                    "
                                                    :ref="
                                                        (el) => {
                                                            el
                                                                ? (refs[
                                                                      'node-content-' +
                                                                          node.guid
                                                                  ] = el)
                                                                : refs
                                                        }
                                                    "
                                                >
                                                    <!-- Columns List -->
                                                    <ul class="pl-3">
                                                        <li class="my-3">
                                                            1 Country
                                                        </li>
                                                        <li class="mb-3">
                                                            2 City
                                                        </li>
                                                        <li class="mb-3">
                                                            3 State
                                                        </li>
                                                        <li class="mb-3">
                                                            4 Order_id
                                                        </li>
                                                        <li class="mb-3">
                                                            5 Country
                                                        </li>
                                                        <li class="mb-3">
                                                            6 City
                                                        </li>
                                                        <li class="mb-3">
                                                            7 State
                                                        </li>
                                                        <li class="mb-3">
                                                            8 Order_id
                                                        </li>
                                                        <li class="mb-3">
                                                            9 Country
                                                        </li>
                                                        <li class="mb-3">
                                                            10 City
                                                        </li>
                                                        <li class="mb-3">
                                                            11 City
                                                        </li>
                                                        <li class="mb-3">
                                                            12 City
                                                        </li>
                                                        <li class="mb-3">
                                                            13 City
                                                        </li>
                                                        <li class="mb-3">
                                                            14 City
                                                        </li>
                                                    </ul>
                                                </div>
                                            </a-collapse-panel>
                                        </a-collapse>
                                    </div>
                                    <!-- dummy -->
                                    <div
                                        class="absolute hidden w-full cursor-pointer "
                                    >
                                        <a-collapse
                                            expand-icon-position="left"
                                            :bordered="false"
                                            :accordion="true"
                                        >
                                            <a-collapse-panel
                                                key="test"
                                                :forceRender="true"
                                            >
                                                <template #header>
                                                    <div
                                                        class="relative flex items-center h-full py-2 pl-10 pr-5 text-sm lowercase bg-white border border-gray-300 cursor-pointer  hover:border-primary justify-space-between"
                                                    >
                                                        <span
                                                            class="overflow-hidden  overflow-ellipsis whitespace-nowrap"
                                                            :style="{
                                                                width: showColumns
                                                                    ? '10rem'
                                                                    : '100%',
                                                            }"
                                                        >
                                                            test dummy node
                                                        </span>
                                                    </div>
                                                </template>
                                            </a-collapse-panel>
                                        </a-collapse>
                                    </div>
                                </div>
                            </a-collapse-panel>
                        </a-collapse>
                        <!-- accordion is not needed if process node -->
                        <div
                            v-if="group.type === 'Process'"
                            class="flex items-center justify-center w-12 p-0 overflow-hidden bg-transparent "
                            :style="`{
                                    height: 5px;
                                }`"
                        >
                            <div
                                v-for="(node, index) in group.fields"
                                :key="'node' + String(index)"
                                class="w-full h-full cursor-pointer"
                                :class="{
                                    'border border-primary':
                                        is_highlighted_node(node.guid),
                                }"
                                :style="{ top: `${0}px` }"
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
            const columnsListLoading = ref(false)
            const contentHeights = ref({})
            const hasLineage = computed(
                () => lineage.value?.relations.length !== 0
            )

            /** METHODS */

            // restartComputation
            const restart_computation = () => {
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

            // compute_graph_relations
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

            // handleExpand
            const handleExpand = (groupId, groupHeadersLength, guid) => {
                setTimeout(() => {
                    let groupHeadersHeight = 38 * groupHeadersLength
                    let groupContentHeight =
                        refs.value[`node-content-${guid}`].clientHeight > 0
                            ? refs.value[`node-content-${guid}`].clientHeight +
                              24
                            : refs.value[`node-content-${guid}`].clientHeight

                    contentHeights.value[groupId] =
                        groupHeadersHeight + groupContentHeight

                    update_lines()
                }, 400)
            }

            // getTopPosition
            const getTopPosition = (guid) => {
                nextTick(() => {
                    const currEle = refs.value[`group-content-${guid}`]
                    // const prevEle = currEle.previousSibling
                    // console.log('currEle T:', currEle.clientTop)
                    // console.log('currEle H:', currEle.clientHeight)
                    return { top: `${0}px` }
                })
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
                pathGuid,
                getIcon,
                contentHeights,
                isCyclic: false, //
                showColumns: false, //
                handle_zoom,
                handle_fullscreen,
                get_path,
                restart_computation,
                is_highlighted_node,
                handleExpand,
                getTopPosition,
            }
        },
    })
</script>

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
        @apply p-0 bg-transparent !important;
    }
    :global(.ant-collapse-header) {
        @apply font-bold bg-white p-0 border-0 border-b-0 !important;
    }
    :global(.ant-collapse-borderless > .ant-collapse-item) {
        @apply border-b-0 !important;
    }

    :global(.anticon) {
        @apply z-10 !important;
    }

    :global(.ant-collapse-content) {
        @apply bg-white !important;
    }
</style>
