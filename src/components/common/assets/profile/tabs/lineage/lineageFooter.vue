<template>
    <!-- Lineage Legend -->
    <!-- <div class="lineage-legend">
        <div class="lineage-legend__item">
            <span id="upstream"></span>
            <span>Upstream</span>
        </div>
        <div class="lineage-legend__item">
            <span id="downstream"></span>
            <span>Downstream</span>
        </div>
        <div class="lineage-legend__item">
            <span id="selected"></span>
            <span>Selected Path</span>
        </div>
    </div> -->
    <div class="lineage-control footer">
        <slot></slot>

        <div class="controls">
            <div class="mr-5 cursor-pointer" @click="onShowMinimap">
                <a-tooltip placement="top">
                    <template #title>
                        <span>{{
                            showMinimap ? 'hide minimap' : 'show minimap'
                        }}</span>
                    </template>

                    <AtlanIcon
                        icon="Minimap"
                        class="outline-none"
                        :class="showMinimap ? 'text-primary' : 'text-gray-500'"
                    ></AtlanIcon>
                </a-tooltip>
            </div>

            <div class="mr-5 cursor-pointer" @click="fit()">
                <a-tooltip placement="top">
                    <template #title>
                        <span>fit graph</span>
                    </template>

                    <AtlanIcon icon="Recenter" class="outline-none"></AtlanIcon>
                </a-tooltip>
            </div>
            <div class="mr-5 cursor-pointer" @click="onFullscreen()">
                <a-tooltip placement="top">
                    <template #title>
                        <span>{{
                            isFullscreen ? 'leave fullscreen' : 'fullscreen'
                        }}</span>
                    </template>
                    <AtlanIcon
                        icon="FullScreen"
                        class="text-gray-500 outline-none"
                    ></AtlanIcon>
                </a-tooltip>
            </div>
            <div class="mr-5 cursor-pointer" @click="zoom(-0.1)">
                <a-tooltip placement="top">
                    <template #title>
                        <span>zoom out</span>
                    </template>

                    <AtlanIcon icon="Minus" class="outline-none"></AtlanIcon>
                </a-tooltip>
            </div>
            <div class="mr-5 cursor-pointer" @click="zoom(0.1)">
                <a-tooltip placement="top">
                    <template #title>
                        <span>zoom in</span>
                    </template>

                    <AtlanIcon
                        icon="Add"
                        class="text-gray-500 outline-none"
                    ></AtlanIcon>
                </a-tooltip>
            </div>
            <div class="w-8 text-sm text-gray-500 select-none">
                {{ currZoom }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    /** PACKAGES */
    import { defineComponent, ref, toRefs } from 'vue'

    /** COMPOSABLES */
    import useTransformGraph from './useTransformGraph'

    export default defineComponent({
        name: 'LineageFooter',
        props: {
            graph: {
                type: Object,
                required: true,
            },
            lineageContainer: {
                type: Object,
                required: true,
            },
            currZoom: {
                type: String,
                required: true,
            },
        },
        emits: ['on-zoom-change', 'on-show-minimap'],
        setup(props, { emit }) {
            /** DATA */
            const { graph, lineageContainer } = toRefs(props)
            const showMinimap = ref(false)
            const isFullscreen = ref(false)

            // transform
            const { zoom, fit, fullscreen } = useTransformGraph(graph, emit)

            const onFullscreen = () => {
                isFullscreen.value = !isFullscreen.value
                fullscreen(lineageContainer)
            }

            // onShowMinimap
            const onShowMinimap = () => {
                showMinimap.value = !showMinimap.value
                emit('on-show-minimap', showMinimap.value)
            }

            return {
                showMinimap,
                isFullscreen,
                zoom,
                fit,
                onShowMinimap,
                onFullscreen,
            }
        },
    })
</script>
