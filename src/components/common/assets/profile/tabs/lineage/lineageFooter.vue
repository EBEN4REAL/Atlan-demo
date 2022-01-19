<template>
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
                    :getPopupContainer="() => footerRoot"
                >
                    <template #content>
                        <div class="px-4 py-3 text-sm">View Options</div>
                        <a-divider class="m-0" />
                        <div class="flex flex-col w-64 p-4 gap-y-4">
                            <!-- Depth Selector -->
                            <div class="flex items-center justify-between">
                                <span class="text-gray-500">Depth</span>
                                <a-dropdown :trigger="['click']">
                                    <span class="lineage-footer-menu">
                                        {{ currDepth }}
                                        <AtlanIcon
                                            icon="CaretRight"
                                            class="transform rotate-90 outline-none"
                                        ></AtlanIcon>
                                    </span>
                                    <template #overlay>
                                        <a-menu>
                                            <a-menu-item
                                                v-for="item in lineageDepths"
                                                :key="item.id"
                                                :class="{
                                                    'ant-dropdown-menu-item-activee':
                                                        depth === item.id,
                                                }"
                                                @click="onChangeDepth(item.id)"
                                            >
                                                {{ item.label }}
                                            </a-menu-item>
                                        </a-menu>
                                    </template>
                                </a-dropdown>
                            </div>
                            <!-- Direction Selector -->
                            <div class="flex items-center justify-between">
                                <span class="text-gray-500">Direction</span>
                                <a-dropdown :trigger="['click']">
                                    <span class="lineage-footer-menu">
                                        {{ currDir }}
                                        <AtlanIcon
                                            icon="CaretRight"
                                            class="transform rotate-90 outline-none"
                                        ></AtlanIcon>
                                    </span>
                                    <template #overlay>
                                        <a-menu>
                                            <a-menu-item
                                                v-for="item in lineageDirections"
                                                :key="item.id"
                                                :class="{
                                                    'ant-dropdown-menu-item-activee':
                                                        direction === item.id,
                                                }"
                                                @click="
                                                    onChangeDirection(item.id)
                                                "
                                            >
                                                {{ item.label }}
                                            </a-menu-item>
                                        </a-menu>
                                    </template>
                                </a-dropdown>
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
    /** PACKAGES */
    import { computed, defineComponent, inject, ref, toRefs } from 'vue'

    /** COMPOSABLES */
    import useTransformGraph from './useTransformGraph'

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
            const control = inject('control')
            const depth = inject('depth')
            const direction = inject('direction')
            const lineageDepths: [] = inject('lineageDepths')
            const lineageDirections: [] = inject('lineageDirections')

            /** DATA */
            const { graph, lineageContainer, graphHeight, graphWidth } =
                toRefs(props)
            const showMinimap = ref(false)
            const isFullscreen = ref(false)
            const isExpanded = ref(true)
            const isPreferencesVisible = ref(false)
            const footerRoot = ref<HTMLElement>()

            const currDepth = computed(
                () => lineageDepths.find((x) => x.id === depth.value)?.label
            )
            const currDir = computed(
                () =>
                    lineageDirections.find((x) => x.id === direction.value)
                        ?.label
            )

            /** METHODS */
            // transform
            const { zoom, fit, fullscreen } = useTransformGraph(graph, emit)

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

            const toggleControlVisibility = () => {
                if (isExpanded.value) {
                    // Close the minimap if the user wants to collapse the controls
                    if (showMinimap.value) onShowMinimap()
                    isExpanded.value = false
                } else isExpanded.value = true
            }

            // onChangeDirection
            const onChangeDirection = (d) => {
                control('direction', d)
            }

            // onChangeDepth
            const onChangeDepth = (d) => {
                control('depth', d)
            }
            return {
                showMinimap,
                footerRoot,
                isFullscreen,
                isPreferencesVisible,
                isExpanded,
                depth,
                lineageDepths,
                currDepth,
                direction,
                lineageDirections,
                currDir,
                zoom,
                fit,
                onShowMinimap,
                onFullscreen,
                toggleControlVisibility,
                onChangeDirection,
                onChangeDepth,
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
</style>
