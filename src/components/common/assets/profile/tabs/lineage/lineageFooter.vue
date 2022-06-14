<template>
    <!-- Controls -->
    <div ref="footerRoot" class="lineage-control footer">
        <slot></slot>

        <div class="controls">
            <!-- Controls toggle -->
            <div class="ml-1 control-item" @click="onshowControls">
                <a-tooltip placement="top">
                    <template #title>
                        <span
                            >{{
                                showControls ? 'Hide ' : 'Show '
                            }}
                            controls</span
                        >
                    </template>

                    <AtlanIcon
                        icon="CollapseControl"
                        class="transition-transform duration-300 outline-none"
                        :class="{
                            'transform rotate-180 mr-1 my-2': !showControls,
                        }"
                    ></AtlanIcon>
                </a-tooltip>
            </div>

            <!-- Controls Items -->
            <template v-if="showControls">
                <div style="height: 40px; width: 1px" class="bg-gray-300" />

                <!-- Preferences Popover -->
                <a-tooltip placement="top">
                    <template #title>
                        <span>{{
                            showPref ? 'Hide preferences' : 'Show preferences'
                        }}</span>
                    </template>
                    <a-popover
                        v-model:visible="showPref"
                        :trigger="['click']"
                        :get-popup-container="() => footerRoot"
                    >
                        <template #content>
                            <div class="px-4 py-3 text-sm">View Options</div>
                            <a-divider class="m-0" />
                            <div class="flex flex-col w-64 p-4 gap-y-4">
                                <div class="flex items-center justify-between">
                                    <span class="text-gray-500"
                                        >Show Legend</span
                                    >
                                    <a-switch
                                        v-model:checked="preferences.showLegend"
                                    />
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-gray-500"
                                        >Show Arrows</span
                                    >
                                    <a-switch
                                        v-model:checked="preferences.showArrow"
                                    />
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-gray-500"
                                        >Show Database</span
                                    >
                                    <a-switch
                                        v-model:checked="
                                            preferences.showDatabase
                                        "
                                    />
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-gray-500"
                                        >Show Schema</span
                                    >
                                    <a-switch
                                        v-model:checked="preferences.showSchema"
                                    />
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-gray-500"
                                        >Show Announcement</span
                                    >
                                    <a-switch
                                        v-model:checked="
                                            preferences.showAnnouncement
                                        "
                                    />
                                </div>
                            </div>
                        </template>

                        <div
                            class="control-item"
                            :class="
                                showPref ? 'bg-primary-light text-primary' : ''
                            "
                        >
                            <AtlanIcon
                                icon="SettingsOutlined"
                                class="outline-none"
                            ></AtlanIcon>
                        </div>
                    </a-popover>
                </a-tooltip>

                <!-- onSvgExport -->
                <!-- <div class="control-item" @click="onSvgExport">
                    <a-tooltip placement="top">
                        <template #title>
                            <span>Export as SVG</span>
                        </template>

                        <AtlanIcon
                            icon="Image"
                            class="outline-none"
                        ></AtlanIcon>
                    </a-tooltip>
                </div> -->

                <!-- Minimap -->
                <div
                    class="control-item"
                    :class="showMinimap ? 'bg-primary-light text-primary' : ''"
                    @click="onShowMinimap"
                >
                    <a-tooltip placement="top">
                        <template #title>
                            <span>{{
                                showMinimap ? 'Hide minimap' : 'Show minimap'
                            }}</span>
                        </template>

                        <AtlanIcon
                            icon="Minimap"
                            class="outline-none"
                        ></AtlanIcon>
                    </a-tooltip>
                </div>

                <!-- Legend Popover -->
                <a-tooltip placement="top">
                    <template #title>
                        <span>{{
                            showLegend ? 'Hide legend' : 'Show legend'
                        }}</span>
                    </template>
                    <a-popover
                        v-model:visible="showLegend"
                        :trigger="['click']"
                        :get-popup-container="() => footerRoot"
                    >
                        <template #content>
                            <div class="flex justify-between px-4 py-3 text-sm">
                                <div>Legend</div>
                                <div>
                                    <AtlanIcon
                                        icon="Cross"
                                        class="cursor-pointer"
                                        style="width: 0.8rem !important"
                                        @click="showLegend = false"
                                    ></AtlanIcon>
                                </div>
                            </div>
                            <a-divider class="m-0" />

                            <a-tabs
                                v-model:activeKey="activeLegendTabKey"
                                class="h-full"
                                :class="$style.legendTab"
                            >
                                <a-tab-pane
                                    v-for="tab in legendTabs"
                                    :key="tab.key"
                                    :tab="tab.title"
                                >
                                    <div
                                        v-if="tab.items.length"
                                        class="flex flex-col px-6 py-4 text-gray-500 bg-white gap-y-3"
                                    >
                                        <div
                                            v-for="(item, index) in tab.items"
                                            :key="index"
                                            class="flex items-center"
                                        >
                                            <AtlanIcon
                                                :icon="item.icon"
                                            ></AtlanIcon>
                                            <div class="ml-3">
                                                {{ item.label }}
                                            </div>
                                        </div>
                                    </div>
                                </a-tab-pane>
                            </a-tabs>
                        </template>

                        <div
                            class="control-item"
                            :class="
                                showLegend
                                    ? 'bg-primary-light text-primary'
                                    : ''
                            "
                        >
                            <AtlanIcon
                                icon="Legend"
                                class="outline-none"
                            ></AtlanIcon>
                        </div>
                    </a-popover>
                </a-tooltip>

                <!-- Re-center -->
                <div
                    class="control-item"
                    @click="
                        () => {
                            fit(baseEntityGuid)
                            sendPanelRefocusEvent()
                        }
                    "
                >
                    <a-tooltip placement="top">
                        <template #title>
                            <span>Refocus to base node</span>
                        </template>

                        <AtlanIcon
                            icon="Refocus"
                            class="outline-none"
                        ></AtlanIcon>
                    </a-tooltip>
                </div>
                <div style="height: 40px; width: 1px" class="bg-gray-300" />

                <!-- Zoom Controls -->
                <div class="control-item" @click="onFullscreen()">
                    <a-tooltip placement="top">
                        <template #title>
                            <span>{{
                                isFullscreen ? 'Leave fullscreen' : 'Fullscreen'
                            }}</span>
                        </template>
                        <AtlanIcon
                            :icon="
                                isFullscreen ? 'ExitFullScreen' : 'FullScreen'
                            "
                            class="outline-none"
                        ></AtlanIcon>
                    </a-tooltip>
                </div>
                <div class="control-item" @click="zoom(-0.1)">
                    <a-tooltip placement="top">
                        <template #title>
                            <span>Zoom out</span>
                        </template>

                        <AtlanIcon
                            icon="Minus"
                            class="outline-none"
                        ></AtlanIcon>
                    </a-tooltip>
                </div>
                <div class="control-item" @click="zoom(0.1)">
                    <a-tooltip placement="top">
                        <template #title>
                            <span>Zoom in</span>
                        </template>
                        <AtlanIcon icon="Add" class="outline-none"></AtlanIcon>
                    </a-tooltip>
                </div>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
    /** VUE */
    import { defineComponent, ref, toRefs } from 'vue'
    import { useDebounceFn } from '@vueuse/core'
    import { DataUri } from '@antv/x6'

    /** COMPOSABLES */
    import useTransformGraph from './useTransformGraph'
    import useLineageStore from '~/store/lineage'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'

    /** CONSTANTS */
    import { exportStyles } from './stylesTwo'

    export default defineComponent({
        name: 'LineageFooter',
        props: {
            graph: {
                type: Object,
                required: true,
            },
            graphHeight: {
                type: Number,
                required: true,
            },
            graphWidth: {
                type: Number,
                required: true,
            },
            lineageContainer: {
                type: Object,
                required: true,
            },
            baseEntityGuid: {
                type: String,
                required: true,
            },
            currZoom: {
                type: String,
                required: true,
            },
        },
        emits: ['on-zoom-change', 'on-show-minimap'],
        setup(props, { emit }) {
            /** INJECTIONS */
            const lineageStore = useLineageStore()
            const preferences = lineageStore.getPreferences()

            /** DATA */
            const {
                graph,
                baseEntityGuid,
                lineageContainer,
                graphHeight,
                graphWidth,
            } = toRefs(props)
            const showMinimap = ref(false)
            const showLegend = ref(false)
            const isFullscreen = ref(false)
            const showControls = ref(true)
            const showPref = ref(false)
            const footerRoot = ref<HTMLElement>()
            const activeLegendTabKey = ref('assets')
            const legendTabs = [
                {
                    key: 'assets',
                    title: 'Assets',
                    items: [
                        { icon: 'LegendExpand', label: 'Expandable' },
                        { icon: 'LegendCollapse', label: 'Collapsible' },
                        { icon: 'LegendAnomaly', label: 'Anomaly' },
                        { icon: 'LegendSelected', label: 'Selected' },
                        { icon: 'LegendHighlighted', label: 'Highlighted' },
                    ],
                },
                {
                    key: 'process',
                    title: 'Process',
                    items: [
                        { icon: 'LegendProcessDefault', label: 'Default' },
                        {
                            icon: 'LegendProcessHighlighted',
                            label: 'Highlighted',
                        },
                        { icon: 'LegendProcess', label: 'Process' },
                        { icon: 'LegendProcessAnomaly', label: 'Anomaly' },
                    ],
                },
                {
                    key: 'icons',
                    title: 'Icons',
                    items: [
                        {
                            icon: 'LegendTableauDSField',
                            label: 'Tableau datasource field',
                        },
                        {
                            icon: 'LegendTableauCField',
                            label: 'Tableau calculated field',
                        },
                        { icon: 'LegendLookerField', label: 'Looker field' },
                        { icon: 'LegendMeasures', label: 'Measures' },
                        { icon: 'LegendDimensions', label: 'Dimensions' },
                    ],
                },
            ]

            /** EVENTS DEFINITIONS */
            const sendFullScreenToggleEvent = useDebounceFn(() => {
                useAddEvent('lineage', 'control_panel_full_screen', 'toggled', {
                    is_enabled: isFullscreen.value,
                })
            }, 600)

            const sendPanelRefocusEvent = useDebounceFn(() => {
                useAddEvent('lineage', 'control_panel_refocus', 'clicked')
            }, 600)

            const sendControlPanelToggledEvent = useDebounceFn(() => {
                useAddEvent('lineage', 'control_panel', 'toggled', {
                    is_hidden: !showControls.value,
                })
            }, 600)

            const sendMiniMapClickedEvent = useDebounceFn(() => {
                useAddEvent('lineage', 'mini_map', 'clicked', {
                    is_hidden: !showMinimap.value,
                })
            }, 600)

            /** METHODS */
            // useTransformGraph
            const { zoom, fit, fullscreen } = useTransformGraph(graph, emit)

            // onSvgExport
            const onSvgExport = () => {
                const baseNode = graph.value
                    .getNodes()
                    .find((node) => node.id === baseEntityGuid.value)
                const { displayText, guid } = baseNode.store.data.entity
                const fileName = `${displayText}_${guid}`

                graph.value.toSVG(
                    (dataUri: string) => {
                        DataUri.downloadDataUri(
                            DataUri.svgToDataUrl(dataUri),
                            fileName
                        )
                    },
                    {
                        copyStyles: false,
                        stylesheet: exportStyles,
                        serializeImages: true,
                    }
                )
            }

            // onFullscreen
            const onFullscreen = () => {
                isFullscreen.value = !isFullscreen.value

                // Handle Event - lineage_control_panel_full_screen_toggled
                sendFullScreenToggleEvent()

                if (isFullscreen.value) {
                    graph.value.resize(graphWidth.value, graphHeight.value)
                } else {
                    graph.value.resize(
                        graphWidth.value,
                        graphHeight.value / 1.35
                    )
                }

                fullscreen(lineageContainer)
            }

            // onShowMinimap
            const onShowMinimap = () => {
                showMinimap.value = !showMinimap.value
                emit('on-show-minimap', showMinimap.value)

                // Handle Event - lineage_mini_map_clicked
                sendMiniMapClickedEvent()
            }

            // onshowControls
            const onshowControls = () => {
                if (showControls.value) {
                    showPref.value = false
                    // Close the minimap if the user wants to collapse the controls
                    if (showMinimap.value) onShowMinimap()
                    showControls.value = false
                } else showControls.value = true

                // Handle Event - lineage_control_panel_toggled
                sendControlPanelToggledEvent()
            }

            // setPreference
            const setPreference = (k, v) => {
                lineageStore.setPreference(k, v)
            }

            return {
                showMinimap,
                showLegend,
                isFullscreen,
                showPref,
                showControls,
                footerRoot,
                preferences,
                activeLegendTabKey,
                legendTabs,
                zoom,
                fit,
                onShowMinimap,
                onFullscreen,
                onSvgExport,
                onshowControls,
                setPreference,
                sendPanelRefocusEvent,
            }
        },
    })
</script>

<style scoped>
    .lineage-footer-menu {
        @apply flex items-center justify-between;
        @apply h-8 px-3;
        @apply text-sm border rounded cursor-pointer;
        min-width: 140px;
    }

    .ant-switch {
        background-color: #00000040 !important;
    }

    .ant-switch-checked.ant-switch {
        background-color: #5277d7 !important;
    }
</style>

<style lang="less" module>
    .legendTab {
        :global(.ant-tabs-tab) {
            @apply mr-8 ml-0 !important;
        }
        :global(.ant-tabs-nav-list) {
            @apply pl-6 bg-new-gray-100 !important;
        }
    }
</style>
