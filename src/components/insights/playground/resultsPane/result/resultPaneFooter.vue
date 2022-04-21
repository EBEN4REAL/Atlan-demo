<template>
    <div
        class="flex justify-between flex-shrink-0 w-full h-10 py-1 text-xs text-sm border-b bg-new-gray-100"
        style="z-index: 2"
        ref="footerRef"
        v-if="
            (columnsCount > 0 && isQueryRunning === 'success') ||
            insights_Store.previewTabs.length
        "
    >
        <PreviewTabs :width="previewTabsWidth" :compactMode="compactMode" />
        <div class="flex items-center">
            <a-tooltip
                v-if="
                    featureEnabledMap[INSIGHT_DATA_DOWNLOAD] &&
                    columnsCount &&
                    previewTabsWidth > 0
                "
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
                    class="py-0.5 px-2 text-sm border-none text-xs rounded shadow cursor-pointer mr-2"
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
                v-if="
                    featureEnabledMap[INSIGHT_DATA_DOWNLOAD] &&
                    columnsCount &&
                    previewTabsWidth > 0
                "
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
                    class="py-0.5 px-2 text-sm border-none text-xs rounded shadow cursor-pointer mr-2"
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
                v-if="columnsCount && previewTabsWidth > 0"
                @click="toggleFullScreenMode"
                placement="topRight"
            >
                <template #title>Full screen</template>
                <AtlanBtn
                    size="sm"
                    color="secondary"
                    @mouseout="recordTooltipPresence"
                    class="py-0.5 px-2 mr-2 text-sm border-none text-xs rounded shadow cursor-pointer"
                    style="height: 24px"
                >
                    <AtlanIcon
                        icon="FullScreenSquare"
                        class="w-4 h-4 text-xs text-new-gray-800"
                    />
                </AtlanBtn>
            </a-tooltip>
            <a-dropdown
                :trigger="['click']"
                @click.stop="() => {}"
                v-if="previewTabsWidth < 0"
            >
                <div class="">
                    <AtlanBtn
                        size="sm"
                        color="secondary"
                        class="py-0.5 px-2 text-sm border-none text-xs rounded shadow cursor-pointer mr-2"
                        style="height: 24px"
                    >
                        <AtlanIcon
                            icon="KebabMenuHorizontal"
                            class="w-4 h-4 my-auto"
                        ></AtlanIcon>
                    </AtlanBtn>
                </div>
                <template #overlay>
                    <a-menu class="py-2 text-gray-700" style="min-width: 180px">
                        <a-menu-item
                            class="px-4 py-2 text-sm"
                            key="schedule"
                            @click="useWrapperCopy"
                            >Copy data</a-menu-item
                        >
                        <a-menu-item
                            key="shareQuery"
                            class="px-4 py-2 text-sm"
                            @click="useWrapperExport"
                            >Download</a-menu-item
                        >
                        <a-menu-item
                            key="duplicate"
                            class="px-4 py-2 text-sm"
                            @click="toggleFullScreenMode"
                            >Full screen</a-menu-item
                        >
                    </a-menu>
                </template>
            </a-dropdown>
        </div>
        <a-modal
            :destroyOnClose="true"
            v-model:visible="fullScreenMode"
            :footer="null"
            :closable="false"
            width="80%"
            :centered="true"
            :bodyStyle="{
                height: 'calc(100vh - 100px)',
            }"
        >
            <div
                class="h-full overflow-hidden rounded-lg bg-new-gray-100 px-2.5"
            >
                <div class="text-sm py-2.5 flex items-center justify-between">
                    <div
                        v-if="selectedAsset"
                        class="flex items-center h-full pl-2 text-sm text-new-gray-700 group"
                    >
                        <div class="flex items-center w-full text-sm">
                            <AtlanIcon
                                :icon="
                                    getEntityStatusIcon(
                                        assetType(selectedAsset),
                                        certificateStatus(selectedAsset)
                                    )
                                "
                                class="w-4 h-4 mr-1 -mt-0.5 parent-ellipsis-container-extension"
                            ></AtlanIcon>
                            <Tooltip
                                :tooltip-text="selectedAsset.attributes.name"
                                classes="text-gray-700 w-full pr-1.5"
                                :placement="'topRight'"
                            />
                        </div>
                    </div>
                    <div v-else class="flex items-center text-sm">
                        <AtlanIcon
                            :icon="getResultsIcon()"
                            class="mr-1 -mt-0.5"
                        />
                        <span>Results</span>
                    </div>
                    <div class="flex items-center">
                        <a-tooltip color="#363636">
                            <template #title>Copy data</template>

                            <AtlanBtn
                                size="sm"
                                color="secondary"
                                class="py-0.5 px-2 text-sm border-none text-xs rounded shadow cursor-pointer mr-2"
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
                                        >Copy</span
                                    >
                                </div>
                            </AtlanBtn>
                        </a-tooltip>
                        <a-tooltip color="#363636">
                            <template #title>Export data</template>
                            <AtlanBtn
                                size="sm"
                                color="secondary"
                                class="py-0.5 px-2 text-sm border-none text-xs rounded shadow cursor-pointer mr-2"
                                style="height: 24px"
                                @click="useWrapperExport"
                            >
                                <div
                                    class="flex items-center text-xs cursor-pointer text-new-gray-800"
                                >
                                    <AtlanIcon
                                        icon="Download"
                                        class="w-4 h-4 text-new-gray-800"
                                    />
                                    <span class="mt-1 ml-1 text-new-gray-800"
                                        >Download</span
                                    >
                                </div>
                            </AtlanBtn>
                        </a-tooltip>
                        <div
                            class="py-0.5 px-1 rounded hover:bg-new-gray-200 cursor-pointer"
                            @click="handleCloseFullScreen"
                        >
                            <AtlanIcon
                                icon="Close"
                                class="w-4 h-4 text-new-gray-600"
                                style="min-width: 24px; min-height: 24px"
                            />
                        </div>
                    </div>
                </div>
                <div
                    class="w-full overflow-hidden rounded"
                    style="height: calc(100% - 50px)"
                >
                    <AtlanPreviewTable
                        :dataList="dataList"
                        :columns="columnsList"
                        key="hello_world"
                        class=""
                        :table-instance-i-d="'query-result-full-screen'"
                    />
                </div>
            </div>
        </a-modal>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        computed,
        inject,
        Ref,
        ref,
        onMounted,
        onUnmounted,
    } from 'vue'
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
    import AtlanPreviewTable from '@/common/table/previewTable/tablePreview.vue'
    import getEntityStatusIcon from '~/utils/getEntityStatusIcon'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import { useDebounceFn } from '@vueuse/core'
    import {
        featureEnabledMap,
        INSIGHT_DATA_DOWNLOAD,
    } from '~/composables/labs/labFeatureList'

    export default defineComponent({
        components: { AtlanBtn, Tooltip, PreviewTabs, AtlanPreviewTable },
        props: {},
        setup() {
            const footerRef = ref()
            const observer = ref()
            const previewTabsWidth = ref(446)
            const {
                recordTooltipPresence,
                MOUSE_ENTER_DELAY,
                ADJACENT_TOOLTIP_DELAY,
                lastTooltipPresence,
            } = useTooltipDelay()
            const { assetType, certificateStatus } = useAssetInfo()
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
            const compactMode = computed(() => {
                return activeInlineTab.value.assetSidebar.isVisible
                // if (activeInlineTab.value.assetSidebar.isVisible)
                // if (footerRef?.value?.offsetWidth < 580) return true
                // return false
            })

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
                    if (_index < 0) return 0
                    return insights_Store.previewTabs[_index].columns.length
                } else {
                    return (
                        activeInlineTab.value.playground.resultsPane.result
                            .totalRowsCount >= 0 &&
                        activeInlineTab.value.playground.editor.columnList
                            .length > 0
                    )
                }
            })
            const columnsList = computed(() => {
                if (insights_Store.activePreviewGuid !== undefined) {
                    const index = insights_Store.previewTabs.findIndex(
                        (el) =>
                            el.asset.guid === insights_Store.activePreviewGuid
                    )
                    if (index < 0) return []
                    return insights_Store.previewTabs[index]?.columns ?? []
                } else {
                    return activeInlineTab.value.playground.editor.columnList
                }
            })
            const dataList = computed(() => {
                if (insights_Store.activePreviewGuid !== undefined) {
                    const index = insights_Store.previewTabs.findIndex(
                        (el) =>
                            el.asset.guid === insights_Store.activePreviewGuid
                    )
                    if (index < 0) return []
                    return insights_Store.previewTabs[index]?.rows ?? {}
                } else {
                    return activeInlineTab.value.playground.editor.dataList
                }
            })

            const selectedAsset = computed(() => {
                if (insights_Store.activePreviewGuid !== undefined) {
                    return insights_Store.previewTabs[
                        insights_Store.previewTabs.findIndex(
                            (el) =>
                                el.asset.guid ===
                                insights_Store.activePreviewGuid
                        )
                    ]?.asset
                } else {
                    return undefined
                }
            })

            const fullScreenMode = ref(false)
            const toggleFullScreenMode = () => {
                fullScreenMode.value = !fullScreenMode.value
            }

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

            // BREAKPOINTS

            const footerResizeHandler = (e) => {
                const footerWidth = footerRef?.value?.offsetWidth
                console.log(footerWidth, 'footerWidth')
                if (footerWidth >= 1080) {
                    previewTabsWidth.value = 476
                } else if (footerWidth > 675) {
                    previewTabsWidth.value = 446
                } else if (footerWidth > 560) {
                    previewTabsWidth.value = 300
                } else {
                    previewTabsWidth.value = -300
                }
            }
            const handleCloseFullScreen = () => {
                fullScreenMode.value = false
            }
            const debouncedFn = useDebounceFn(footerResizeHandler, 100)

            onMounted(() => {
                if (footerRef.value) {
                    observer.value = new ResizeObserver(debouncedFn).observe(
                        footerRef.value
                    )
                }
                window.addEventListener('resize', debouncedFn)
            })
            onUnmounted(() => {
                observer?.value?.unobserve(footerRef?.value)
                window.removeEventListener('resize', debouncedFn)
            })

            return {
                handleCloseFullScreen,
                previewTabsWidth,
                footerRef,
                getResultsIcon,
                assetType,
                certificateStatus,
                getEntityStatusIcon,
                selectedAsset,
                columnsList,
                dataList,
                fullScreenMode,
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
                toggleFullScreenMode,
                MOUSE_ENTER_DELAY,
                ADJACENT_TOOLTIP_DELAY,
                lastTooltipPresence,
                featureEnabledMap,
                INSIGHT_DATA_DOWNLOAD,
            }
        },
    })
</script>
<style lang="less" scoped>
    .bg-gray-C4C4C4 {
        background: #c4c4c4;
    }
    .shadow {
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
