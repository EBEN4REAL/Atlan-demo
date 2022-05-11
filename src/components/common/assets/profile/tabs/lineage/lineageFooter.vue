<template>
    <div v-if="preferences.showLegend" class="lineage-legend footer">
        <div>
            <div class="flex justify-between px-4 py-3 text-sm">
                <div>Legend</div>
                <div>
                    <AtlanIcon
                        icon="Cross"
                        class="cursor-pointer"
                        style="width: 0.8rem !important"
                        @click="setPreference('showLegend', false)"
                    ></AtlanIcon>
                </div>
            </div>
            <a-divider class="m-0" />
            <div class="flex flex-col w-48 p-4 text-gray-500 gap-y-2">
                <div class="flex items-center">
                    <AtlanIcon icon="LegendExpand"></AtlanIcon>
                    <div class="ml-4">Expandable node</div>
                </div>
                <div class="flex items-center">
                    <AtlanIcon icon="LegendCollapse"></AtlanIcon>
                    <div class="ml-4">Collapsible node</div>
                </div>
                <div class="flex items-center">
                    <AtlanIcon
                        icon="LegendAnomaly"
                        style="width: 1.1rem !important"
                    ></AtlanIcon>
                    <div class="ml-4">Anomaly node</div>
                </div>
                <div class="flex items-center">
                    <AtlanIcon
                        icon="LegendSelected"
                        style="width: 1.1rem !important"
                    ></AtlanIcon>
                    <div class="ml-4">Selected node</div>
                </div>
                <div class="flex items-center">
                    <AtlanIcon
                        icon="LegendHighlighted"
                        style="width: 1.1rem !important"
                    ></AtlanIcon>
                    <div class="ml-4">Highlighted node</div>
                </div>
            </div>
        </div>
    </div>
    <div ref="footerRoot" class="lineage-control footer">
        <slot></slot>

        <div class="controls">
            <div class="ml-1 control-item" @click="toggleControlVisibility">
                <a-tooltip placement="top">
                    <template #title>
                        <span
                            >{{ isExpanded ? 'Hide ' : 'Show ' }} controls</span
                        >
                    </template>

                    <AtlanIcon
                        icon="CollapseControl"
                        class="transition-transform duration-300 outline-none"
                        :class="{
                            'transform rotate-180 mr-1 my-2': !isExpanded,
                        }"
                    ></AtlanIcon>
                </a-tooltip>
            </div>
            <template v-if="isExpanded">
                <div style="height: 40px; width: 1px" class="bg-gray-300" />

                <!-- Preferences Popover -->
                <a-popover
                    v-model:visible="isPreferencesVisible"
                    :trigger="['click']"
                    :get-popup-container="() => footerRoot"
                >
                    <template #content>
                        <div class="px-4 py-3 text-sm">View Options</div>
                        <a-divider class="m-0" />
                        <div class="flex flex-col w-64 p-4 gap-y-4">
                            <div class="flex items-center justify-between">
                                <span class="text-gray-500">Show Legend</span>
                                <a-switch
                                    v-model:checked="preferences.showLegend"
                                />
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-gray-500">Show Arrows</span>
                                <a-switch
                                    v-model:checked="preferences.showArrow"
                                />
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-gray-500">Show Schema</span>
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
                            isPreferencesVisible
                                ? 'bg-primary-light text-primary'
                                : ''
                        "
                    >
                        <AtlanIcon
                            icon="SettingsOutlined"
                            class="outline-none"
                        ></AtlanIcon>
                    </div>
                </a-popover>

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
                <!-- Re-center -->
                <div class="control-item" @click="fit(baseEntityGuid)">
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
    import { DataUri } from '@antv/x6'

    /** COMPOSABLES */
    import useTransformGraph from './useTransformGraph'
    import useLineageStore from '~/store/lineage'

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
            const isFullscreen = ref(false)
            const isExpanded = ref(true)
            const isPreferencesVisible = ref(false)
            const footerRoot = ref<HTMLElement>()

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
            }

            // toggleControlVisibility
            const toggleControlVisibility = () => {
                if (isExpanded.value) {
                    isPreferencesVisible.value = false
                    // Close the minimap if the user wants to collapse the controls
                    if (showMinimap.value) onShowMinimap()
                    isExpanded.value = false
                } else isExpanded.value = true
            }

            // setPreference
            const setPreference = (k, v) => {
                lineageStore.setPreference(k, v)
            }

            return {
                showMinimap,
                isFullscreen,
                isPreferencesVisible,
                isExpanded,
                footerRoot,
                preferences,
                zoom,
                fit,
                onShowMinimap,
                onFullscreen,
                onSvgExport,
                toggleControlVisibility,
                setPreference,
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
