<template>
    <div class="flex items-center h-full">
        <div
            class="relative flex items-center justify-center h-full px-2 ml-2 rounded-tl cursor-pointer text-new-gray-700"
            style="max-width: 85px"
            :class="activeResultPreviewTab ? 'tab-active' : 'not-active'"
            @click="selectActiveResultTab"
            v-if="previewModeActive"
        >
            <div class="flex items-center text-sm">
                <AtlanIcon :icon="getResultsIcon()" class="mr-1 -mt-0.5" />
                <span>Results</span>
            </div>
            <!-- <div
                    class="absolute right-0 h-full bg-gray-300"
                    style="width: 1px"
                ></div> -->
        </div>
        <div
            v-if="previewModeActive"
            class="h-full rounded-tr bg-new-gray-200"
            :style="`width: ${
                compactMode && previewModeActive ? '340px' : '476px'
            };
                box-shadow: inset 0px 0px 2px rgba(0, 0, 0, 0.12);
                min-height: 33px;
                padding-left: 1px;`"
        >
            <a-tabs
                :class="$style.previewtab_footer"
                :tab-position="mode"
                :style="{ height: '32px' }"
                :activeKey="previewIndex"
            >
                <a-tab-pane
                    v-for="(item, index) in insights_Store.previewTabs"
                    :key="index"
                >
                    <template #tab>
                        <div
                            @click.stop="
                                () => selectPreviewTab(item.asset.guid)
                            "
                            class="relative flex items-center h-full px-2 text-sm text-new-gray-700 group"
                            style="width: 148px"
                        >
                            <div class="flex items-center w-full text-sm">
                                <AtlanIcon
                                    :icon="
                                        getEntityStatusIcon(
                                            assetType(item.asset),
                                            certificateStatus(item.asset)
                                        )
                                    "
                                    class="w-4 h-4 mr-1 -mt-0.5 parent-ellipsis-container-extension"
                                ></AtlanIcon>
                                <Tooltip
                                    :tooltip-text="item.asset.attributes.name"
                                    classes="text-new-gray-700 w-full pr-1.5"
                                    :placement="'topRight'"
                                    :mouseEnterDelay="
                                        lastTooltipPresence !== undefined
                                            ? ADJACENT_TOOLTIP_DELAY
                                            : MOUSE_ENTER_DELAY
                                    "
                                />
                            </div>
                            <div
                                @click.stop="
                                    () => onPreviewTabClose(item.asset.guid)
                                "
                                @mouseout="recordTooltipPresence"
                                class="absolute rounded opacity-0 right-2 group-hover:opacity-100 px-0.5"
                                :class="
                                    previewIndex === index
                                        ? 'bg-white hover:bg-new-gray-200'
                                        : 'bg-new-gray-200 hover:bg-new-gray-300'
                                "
                            >
                                <AtlanIcon icon="Close" class="w-4 h-4" />
                            </div>
                        </div>
                    </template>
                </a-tab-pane>
            </a-tabs>
        </div>
        <div
            class="flex items-center px-3 text-new-gray-800 mt-0.5"
            v-if="
                (!compactMode && Boolean(Number(columnsCount))) ||
                (!previewModeActive && Boolean(Number(columnsCount)))
            "
        >
            <span class="mr-1">
                {{ `${rowsCount} rows, ` }}
            </span>

            <span class="mr-1">
                {{ columnsCount }}
                cols
            </span>

            <!-- Execution Time will be shown when it is >0 -->
            <span v-if="queryExecutionTime > 0" class="flex items-center mr-1">
                <span class="mr-1" style="color: #6b7692">
                    in
                    <span class="font-mono">{{
                        getFormattedTimeFromMilliSeconds(queryExecutionTime)
                    }}</span>
                </span>
            </span>
            <!-- -------------------------------------------- -->
        </div>
        <div
            class="flex items-center px-3 text-new-gray-800 mt-0.5"
            v-else-if="compactMode && previewModeActive"
        >
            <a-tooltip
                color="#363636"
                :mouseEnterDelay="
                    lastTooltipPresence !== undefined
                        ? ADJACENT_TOOLTIP_DELAY
                        : MOUSE_ENTER_DELAY
                "
            >
                <template #title>
                    <div
                        class="flex items-center"
                        @mouseout="recordTooltipPresence"
                    >
                        <span class="mr-1">
                            {{ `${rowsCount} rows, ` }}
                        </span>

                        <span class="mr-1">
                            {{ columnsCount }}
                            cols
                        </span>

                        <!-- Execution Time will be shown when it is >0 -->
                        <span
                            v-if="queryExecutionTime > 0"
                            class="flex items-center mr-1"
                        >
                            <span class="mr-1" style="color: #6b7692">
                                in
                                <span class="font-mono">{{
                                    getFormattedTimeFromMilliSeconds(
                                        queryExecutionTime
                                    )
                                }}</span>
                            </span>
                        </span>
                        <!-- -------------------------------------------- -->
                    </div>
                </template>
                <div class="p-1 rounded hover:bg-new-gray-200">
                    <AtlanIcon
                        icon="QueryMetadata"
                        class="w-4 h-4 text-new-gray-800"
                    />
                </div>
            </a-tooltip>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, Ref, computed, inject, ref, watch } from 'vue'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import Tooltip from '@common/ellipsis/index.vue'
    import { useUtils } from '~/components/insights/common/composables/useUtils'
    import { useTooltipDelay } from '~/components/insights/common/composables/useTooltipDelay'
    import insightsStore from '~/store/insights/index'
    import getEntityStatusIcon from '~/utils/getEntityStatusIcon'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'

    export default defineComponent({
        components: { Tooltip },
        props: {},
        setup(props, { emit }) {
            const insights_Store = insightsStore()
            const { assetType, certificateStatus } = useAssetInfo()
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
            const mode = ref('top')
            const activeKey = ref('1')

            const previewIndex = computed(() =>
                insights_Store.previewTabs.findIndex(
                    (el) => el.asset.guid === insights_Store.activePreviewGuid
                )
            )

            const activeResultPreviewTab = inject(
                'activeResultPreviewTab'
            ) as Ref<boolean>
            const selectActiveResultTab = () => {
                activeResultPreviewTab.value = !activeResultPreviewTab.value
                insights_Store.activePreviewGuid = undefined
            }

            const compactMode = computed(
                () => activeInlineTab.value.assetSidebar.isVisible
            )
            const previewModeActive = computed(
                () => insights_Store.previewTabs.length > 0
            )

            const onPreviewTabClose = (guid: string) => {
                const index = insights_Store.previewTabs.findIndex(
                    (el) => el.asset.guid === guid
                )

                if (index > 0) {
                    // select previous tab
                    insights_Store.activePreviewGuid =
                        insights_Store.previewTabs[index - 1].asset.guid
                    insights_Store.previewTabs.splice(index, 1)
                } else {
                    if (insights_Store.previewTabs.length > 1) {
                        insights_Store.previewTabs.splice(index, 1)
                        insights_Store.activePreviewGuid =
                            insights_Store.previewTabs[0].asset.guid
                    } else {
                        insights_Store.previewTabs.splice(index, 1)
                        insights_Store.activePreviewGuid = undefined
                    }
                }
            }
            const selectPreviewTab = (guid: string) => {
                insights_Store.activePreviewGuid = guid
                activeResultPreviewTab.value = false
            }

            const rowsCount = computed(() => {
                if (insights_Store.activePreviewGuid !== undefined) {
                    const _index = insights_Store.previewTabs.findIndex(
                        (el) =>
                            el.asset.guid === insights_Store.activePreviewGuid
                    )
                    return insights_Store.previewTabs[_index].totalRowsCount
                } else {
                    return activeInlineTab.value.playground.resultsPane.result.totalRowsCount?.toLocaleString()
                }
            })

            const columnsCount = computed(() => {
                if (insights_Store.activePreviewGuid !== undefined) {
                    const _index = insights_Store.previewTabs.findIndex(
                        (el) =>
                            el.asset.guid === insights_Store.activePreviewGuid
                    )
                    return insights_Store.previewTabs[
                        _index
                    ].columns.length?.toLocaleString()
                } else {
                    return activeInlineTab.value.playground.editor.columnList.length?.toLocaleString()
                }
            })

            const queryExecutionTime = computed(() => {
                if (insights_Store.activePreviewGuid !== undefined) {
                    const _index = insights_Store.previewTabs.findIndex(
                        (el) =>
                            el.asset.guid === insights_Store.activePreviewGuid
                    )
                    return insights_Store.previewTabs[_index].executionTime
                } else {
                    return activeInlineTab.value?.playground?.resultsPane
                        ?.result?.executionTime
                }
            })

            const getResultsIcon = () => {
                if (
                    activeInlineTab.value.playground.editor.columnList.length >
                        0 &&
                    activeInlineTab.value.playground.editor.dataList.length > 0
                ) {
                    return 'QueryOutputSuccess'
                } else if (
                    activeInlineTab.value.playground.resultsPane.result
                        .isQueryRunning === 'error'
                ) {
                    return 'QueryOutputFail'
                } else {
                    return 'QueryOutputNeutral'
                }
            }

            return {
                getResultsIcon,
                columnsCount,
                rowsCount,
                onPreviewTabClose,
                selectPreviewTab,
                previewIndex,
                getEntityStatusIcon,
                assetType,
                certificateStatus,
                insights_Store,
                previewModeActive,
                recordTooltipPresence,
                MOUSE_ENTER_DELAY,
                ADJACENT_TOOLTIP_DELAY,
                lastTooltipPresence,
                selectActiveResultTab,
                getFormattedTimeFromMilliSeconds,
                activeInlineTab,
                mode,
                activeKey,
                queryExecutionTime,
                activeResultPreviewTab,
                compactMode,
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
    .not-active {
        @apply bg-new-gray-200;
    }
</style>
<style lang="less" module>
    .previewtab_footer {
        height: 32px !important;
        :global(.ant-tabs-nav .ant-tabs-tab-active) {
            background: white;
            @apply shadow !important;
            padding: 4px 8px;
            @apply rounded;
        }
        :global(.ant-tabs-tab) {
            @apply p-0 !important;
            margin-top: 2.5px;

            margin-left: 0;

            height: 28px !important;
        }
        :global(.ant-tabs-ink-bar) {
            display: none !important;
        }
        :global(.ant-tabs > .ant-tabs-nav .ant-tabs-nav-list, .ant-tabs
                > div
                > .ant-tabs-nav
                .ant-tabs-nav-list) {
            align-items: center;
        }
    }
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
