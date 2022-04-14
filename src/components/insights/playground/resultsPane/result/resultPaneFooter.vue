<template>
    <div
        class="flex justify-between flex-shrink-0 w-full h-10 py-1 text-xs text-sm border-b bg-new-gray-100"
        style=""
        v-if="
            activeInlineTab.playground.editor.columnList.length > 0 &&
            isQueryRunning === 'success'
        "
    >
        <PreviewTabs />
        <div class="flex items-center">
            <a-tooltip
                color="#363636"
                :mouseEnterDelay="
                    lastTooltipPresence !== undefined
                        ? ADJACENT_TOOLTIP_DELAY
                        : MOUSE_ENTER_DELAY
                "
            >
                <template #title>Copy data</template>

                <AtlanBtn
                    size="sm"
                    color="secondary"
                    padding="compact"
                    class="py-0.5 text-sm border-none text-xs rounded custom-shadow cursor-pointer mr-2"
                    style="height: 24px"
                    @click="
                        useCopy(
                            activeInlineTab.playground.editor.columnList,
                            activeInlineTab.playground.editor.dataList
                        )
                    "
                >
                    <div
                        class="flex items-center cursor-pointer text-new-gray-800"
                    >
                        <AtlanIcon
                            icon="CopyOutlined"
                            class="w-4 h-4 text-new-gray-800"
                        />
                        <span
                            class="mt-0.5 text-new-gray-800 text-xs ml-1"
                            v-if="!compactMode"
                            >Copy</span
                        >
                    </div>
                </AtlanBtn>
            </a-tooltip>
            <a-tooltip
                color="#363636"
                :mouseEnterDelay="
                    lastTooltipPresence !== undefined
                        ? ADJACENT_TOOLTIP_DELAY
                        : MOUSE_ENTER_DELAY
                "
            >
                <template #title>Export data</template>
                <AtlanBtn
                    size="sm"
                    color="secondary"
                    padding="compact"
                    class="py-0.5 text-sm border-none text-xs rounded custom-shadow cursor-pointer mr-2"
                    style="height: 24px"
                    @click="
                        useTableExport(
                            activeInlineTab?.queryId
                                ? activeInlineTab?.label
                                : null,
                            activeInlineTab.playground.editor.columnList,
                            activeInlineTab.playground.editor.dataList
                        )
                    "
                >
                    <div
                        class="flex items-center text-xs cursor-pointer text-new-gray-800"
                    >
                        <AtlanIcon
                            icon="Download"
                            class="w-4 h-4 text-new-gray-800"
                        />
                        <span
                            class="mt-1 ml-1 text-new-gray-800"
                            v-if="!compactMode"
                            >Download</span
                        >
                    </div>
                </AtlanBtn>
            </a-tooltip>
            <a-tooltip
                color="#363636"
                :mouseEnterDelay="
                    lastTooltipPresence !== undefined
                        ? ADJACENT_TOOLTIP_DELAY
                        : MOUSE_ENTER_DELAY
                "
            >
                <template #title>Full screen</template>
                <AtlanBtn
                    size="sm"
                    color="secondary"
                    padding="compact"
                    class="py-0.5 mr-2 text-sm border-none text-xs rounded custom-shadow cursor-pointer"
                    style="height: 24px"
                >
                    <AtlanIcon
                        icon="FullScreenSquare"
                        class="w-4 h-4 text-xs text-new-gray-800"
                    />
                </AtlanBtn>
            </a-tooltip>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, computed, inject, Ref, ref } from 'vue'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import AtlanBtn from '~/components/UI/button.vue'
    import PreviewTabs from '~/components/insights/playground/resultsPane/result/preview/index.vue'
    import {
        useTableExport,
        useCopy,
    } from '~/components/insights/common/composables/useTableExport'
    import { useUtils } from '~/components/insights/common/composables/useUtils'
    import Tooltip from '@common/ellipsis/index.vue'

    export default defineComponent({
        components: { AtlanBtn, Tooltip, PreviewTabs },
        props: {},
        setup() {
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as Ref<activeInlineTabInterface>

            const { getFormattedTimeFromMilliSeconds } = useUtils()

            const isQueryRunning = computed(
                () =>
                    activeInlineTab.value?.playground?.resultsPane?.result
                        ?.isQueryRunning
            )
            const compactMode = computed(
                () => activeInlineTab.value.assetSidebar.isVisible
            )
            return {
                compactMode,
                activeInlineTab,
                isQueryRunning,
                useTableExport,
                useCopy,
                getFormattedTimeFromMilliSeconds,
            }
        },
    })
</script>
<style lang="less" scoped>
    .bg-gray-C4C4C4 {
        background: #c4c4c4;
    }
    .custom-shadow {
        box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.12);
    }
    .tab-active {
        background: white;
        @apply shadow !important;
        padding: 4px 8px;
        @apply rounded;
    }
</style>
<style lang="less" module></style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
