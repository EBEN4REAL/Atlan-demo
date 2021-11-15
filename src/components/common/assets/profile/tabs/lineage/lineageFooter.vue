<template>
    <div class="lineage-control footer">
        <!-- Minimap Container -->
        <div
            v-show="showMinimap"
            ref="minimapContainer"
            class="mb-3 minimap"
        ></div>

        <div class="flex items-center flex-1 controls">
            <div class="mr-3 cursor-pointer">
                <a-tooltip placement="top">
                    <template #title>
                        <span>retry</span>
                    </template>

                    <AtlanIcon icon="Retry" class="outline-none"></AtlanIcon>
                </a-tooltip>
            </div>

            <a-divider type="vertical" />

            <div
                class="ml-3 mr-5 cursor-pointer"
                @click="showMinimap = !showMinimap"
            >
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

            <div class="mr-5 cursor-pointer">
                <a-tooltip placement="top">
                    <template #title>
                        <span>recenter</span>
                    </template>

                    <AtlanIcon icon="Recenter" class="outline-none"></AtlanIcon>
                </a-tooltip>
            </div>
            <div class="mr-5 cursor-pointer">
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
            <div class="mr-5 cursor-pointer">
                <a-tooltip placement="top">
                    <template #title>
                        <span>zoom out</span>
                    </template>

                    <AtlanIcon icon="Minus" class="outline-none"></AtlanIcon>
                </a-tooltip>
            </div>
            <div class="mr-5 cursor-pointer">
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
                <!-- {{ currZoom }} -->
                60%
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    /** PACKAGES */
    import { defineComponent, ref } from 'vue'

    export default defineComponent({
        name: 'LineageFooter',

        setup() {
            /** DATA */
            const graphContainer = ref(null)
            const minimapContainer = ref(null)
            const monitorContainer = ref(null)
            const currZoom = ref('...')
            const currZoomDec = ref(null)
            const showMinimap = ref(false)
            const isFullscreen = ref(false)
            const isRunning = ref(true)

            return {
                minimapContainer,
                monitorContainer,
                graphContainer,
                currZoom,
                currZoomDec,
                showMinimap,
                isFullscreen,
                isRunning,
            }
        },
    })
</script>
