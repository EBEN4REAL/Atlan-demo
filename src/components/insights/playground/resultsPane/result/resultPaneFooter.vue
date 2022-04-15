<template>
    <div
        class="flex justify-between flex-shrink-0 w-full h-10 py-1 text-xs text-sm border-b bg-new-gray-100"
        style=""
        v-if="
            (columnsCount > 0 && isQueryRunning === 'success') ||
            insights_Store.previewTabs.length
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
                v-if="columnsCount"
            >
                <template #title>Copy data</template>

                <AtlanBtn
                    size="sm"
                    color="secondary"
                    padding="compact"
                    class="py-0.5 text-sm border-none text-xs rounded custom-shadow cursor-pointer mr-2"
                    style="height: 24px"
                    @mouseout="recordTooltipPresence"
                    @click="useWrapperCopy"
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
                            v-if="!compactMode || !previewModeActive"
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
                v-if="columnsCount"
            >
                <template #title>Export data</template>
                <AtlanBtn
                    size="sm"
                    color="secondary"
                    padding="compact"
                    class="py-0.5 text-sm border-none text-xs rounded custom-shadow cursor-pointer mr-2"
                    style="height: 24px"
                    @mouseout="recordTooltipPresence"
                    @click="useWrapperExport"
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
                            v-if="!compactMode || !previewModeActive"
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
                v-if="columnsCount"
            >
                <template #title>Full screen</template>
                <AtlanBtn
                    size="sm"
                    color="secondary"
                    padding="compact"
                    @mouseout="recordTooltipPresence"
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
    import { useTooltipDelay } from '~/components/insights/common/composables/useTooltipDelay'
    import insightsStore from '~/store/insights/index'

    export default defineComponent({
        components: { AtlanBtn, Tooltip, PreviewTabs },
        props: {},
        setup() {
            const {
                recordTooltipPresence,
                MOUSE_ENTER_DELAY,
                ADJACENT_TOOLTIP_DELAY,
                lastTooltipPresence,
            } = useTooltipDelay()
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as Ref<activeInlineTabInterface>

            const { getFormattedTimeFromMilliSeconds } = useUtils()
            const insights_Store = insightsStore()

            const isQueryRunning = computed(() => {
                if (insights_Store.activePreviewGuid !== undefined) {
                    const _index = insights_Store.previewTabs.findIndex(
                        (el) =>
                            el.asset.guid === insights_Store.activePreviewGuid
                    )
                    return insights_Store.previewTabs[_index].isQueryRunning
                } else {
                    return activeInlineTab.value?.playground?.resultsPane
                        ?.result?.isQueryRunning
                }
            })
            const compactMode = computed(
                () => activeInlineTab.value.assetSidebar.isVisible
            )
            const previewModeActive = computed(
                () => insights_Store.previewTabs.length > 0
            )

            const useWrapperCopy = () => {
                if (insights_Store.activePreviewGuid !== undefined) {
                    const _index = insights_Store.previewTabs.findIndex(
                        (el) =>
                            el.asset.guid === insights_Store.activePreviewGuid
                    )
                    useCopy(
                        insights_Store.previewTabs[_index].columns,
                        insights_Store.previewTabs[_index].rows
                    )
                } else {
                    useCopy(
                        activeInlineTab.value.playground.editor.columnList,
                        activeInlineTab.value.playground.editor.dataList
                    )
                }
            }
            const useWrapperExport = () => {
                if (insights_Store.activePreviewGuid !== undefined) {
                    const _index = insights_Store.previewTabs.findIndex(
                        (el) =>
                            el.asset.guid === insights_Store.activePreviewGuid
                    )
                    useTableExport(
                        null,
                        insights_Store.previewTabs[_index].columns,
                        insights_Store.previewTabs[_index].rows
                    )
                } else {
                    useTableExport(
                        activeInlineTab.value?.queryId
                            ? activeInlineTab.value?.label
                            : null,
                        activeInlineTab.value.playground.editor.columnList,
                        activeInlineTab.value.playground.editor.dataList
                    )
                }
            }
            const columnsCount = computed(() => {
                if (insights_Store.activePreviewGuid !== undefined) {
                    const _index = insights_Store.previewTabs.findIndex(
                        (el) =>
                            el.asset.guid === insights_Store.activePreviewGuid
                    )
                    return insights_Store.previewTabs[_index].columns.length
                } else {
                    return activeInlineTab.value.playground.editor.columnList
                        .length
                }
            })

            return {
                insights_Store,
                columnsCount,
                useWrapperExport,
                useWrapperCopy,
                previewModeActive,
                compactMode,
                activeInlineTab,
                isQueryRunning,
                useTableExport,
                useCopy,
                getFormattedTimeFromMilliSeconds,
                recordTooltipPresence,
                MOUSE_ENTER_DELAY,
                ADJACENT_TOOLTIP_DELAY,
                lastTooltipPresence,
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
