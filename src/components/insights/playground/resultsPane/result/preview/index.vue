<template>
    <div class="flex items-center w-full h-full">
        <div
            class="relative flex items-center justify-center h-full px-2 ml-2 rounded-tl rounded-bl cursor-pointer"
            style="
                max-width: 85px;
                box-shadow: inset 0px 0px 2px rgba(0, 0, 0, 0.12);
            "
            :class="activeResultPreviewTab ? 'tab-active' : 'not-active'"
            @click="selectActiveResultTab"
            v-if="previewModeActive"
        >
            <div class="flex items-center text-sm">
                <AtlanIcon :icon="getResultsIcon" class="mr-1 -mt-0.5" />
                <span>Results </span>
            </div>
            <!-- <div
                    class="absolute right-0 h-full bg-gray-300"
                    style="width: 1px"
                ></div> -->
        </div>
        <div
            v-if="previewModeActive"
            class="h-full pr-0.5 rounded-tr bg-new-gray-200 rounded-br"
            :style="`width: auto;
            transition:all ease 0.1s;
                box-shadow: inset 0px 0px 2px rgba(0, 0, 0, 0.12);
                min-height: 33px;
                padding-left: 1px;
                max-width:${Math.abs(width)}px`"
        >
            <a-tabs
                :class="$style.previewtab_footer"
                :tab-position="mode"
                :style="{ height: '32px' }"
                :activeKey="`${previewIndex}.${insights_Store.activePreviewGuid}`"
                @change="handleTabChange"
            >
                <a-tab-pane
                    v-for="(item, index) in insights_Store.previewTabs"
                    :key="`${index}.${item.asset.guid}`"
                >
                    <template #tab>
                        <InsightsThreeDotMenu
                            trigger="contextmenu"
                            :options="dropdownOptions"
                            :item="item"
                            :key="`${index}.${item.asset.guid}`"
                            @visibleChange="onDropdownVisibleChange"
                        >
                            <template #menuTrigger>
                                <div
                                    class="relative flex items-center h-full px-2 text-sm text-new-gray-700 group insights_preview_tabs"
                                    style="width: 148px"
                                >
                                    <div
                                        class="flex items-center w-full text-sm"
                                    >
                                        <AtlanIcon
                                            :icon="
                                                getEntityStatusIcon(
                                                    assetType(item.asset),
                                                    certificateStatus(
                                                        item.asset
                                                    )
                                                )
                                            "
                                            class="w-4 h-4 mr-1 -mt-0.5 parent-ellipsis-container-extension"
                                        ></AtlanIcon>
                                        <Tooltip
                                            v-if="!hideTabsToolTips"
                                            :tooltip-text="
                                                item.asset.attributes.name
                                            "
                                            classes="text-new-gray-700 w-full pr-1.5"
                                            :placement="'topRight'"
                                            :mouseEnterDelay="
                                                lastTooltipPresence !==
                                                undefined
                                                    ? ADJACENT_TOOLTIP_DELAY
                                                    : MOUSE_ENTER_DELAY
                                            "
                                        />
                                        <span
                                            v-else
                                            class="overflow-hidden truncate"
                                        >
                                            {{ item.asset.attributes.name }}
                                        </span>
                                    </div>
                                    <div
                                        @click.stop="
                                            () =>
                                                onPreviewTabClose(
                                                    item.asset.guid
                                                )
                                        "
                                        @mouseout="recordTooltipPresence"
                                        class="absolute rounded opacity-0 right-2 group-hover:opacity-100 px-0.5"
                                        :class="
                                            Number(previewIndex) ==
                                            Number(index)
                                                ? 'bg-white hover:bg-new-gray-200'
                                                : 'bg-new-gray-200 hover:bg-new-gray-300'
                                        "
                                    >
                                        <AtlanIcon
                                            icon="Close"
                                            class="w-4 h-4"
                                        />
                                    </div>
                                </div>
                            </template>
                        </InsightsThreeDotMenu>
                    </template>
                </a-tab-pane>
            </a-tabs>
        </div>
        <div
            class="flex items-center pl-3 text-new-gray-800 mt-0.5"
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
            class="flex items-center pl-3 text-new-gray-800 mt-0.5"
            v-else-if="compactMode && previewModeActive"
        >
            <a-tooltip color="#363636">
                <template #title>
                    <div class="flex items-center text-white">
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
                            <span class="mr-1">
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
                <div class="p-1 px-1.5 rounded hover:bg-new-gray-200">
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
    import {
        defineComponent,
        Ref,
        computed,
        inject,
        ref,
        watch,
        toRefs,
    } from 'vue'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import Tooltip from '@common/ellipsis/index.vue'
    import { useUtils } from '~/components/insights/common/composables/useUtils'
    import { useTooltipDelay } from '~/components/insights/common/composables/useTooltipDelay'
    import insightsStore from '~/store/insights/index'
    import getEntityStatusIcon from '~/utils/getEntityStatusIcon'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import { MenuItem } from 'ant-design-vue'
    import InsightsThreeDotMenu from '~/components/insights/common/dropdown/index.vue'

    export default defineComponent({
        components: { Tooltip, InsightsThreeDotMenu },
        props: {
            width: {
                type: Number,
                required: true,
            },
            compactMode: {
                type: Boolean,
                required: true,
            },
        },
        setup(props, { emit }) {
            const hideTabsToolTips = ref(false)
            const { width, compactMode } = toRefs(props)
            const insights_Store = insightsStore()
            const lastElement = inject('lastPreviewTabElement') as Ref<any>
            const { assetType, certificateStatus } = useAssetInfo()
            const {
                recordTooltipPresence,
                MOUSE_ENTER_DELAY,
                ADJACENT_TOOLTIP_DELAY,
                lastTooltipPresence,
            } = useTooltipDelay(2)
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

            const previewModeActive = computed(
                () => insights_Store.previewTabs.length > 0
            )

            const onPreviewTabClose = (guid: string) => {
                const index = insights_Store.previewTabs.findIndex(
                    (el) => el.asset.guid === guid
                )

                if (index > 0) {
                    // select previous tab
                    insights_Store.previewTabs.splice(index, 1)
                    if (insights_Store.activePreviewGuid) {
                        insights_Store.activePreviewGuid =
                            insights_Store.previewTabs[index - 1].asset.guid
                    }
                } else {
                    if (insights_Store.previewTabs.length > 1) {
                        insights_Store.previewTabs.splice(index, 1)
                        if (insights_Store.activePreviewGuid) {
                            insights_Store.activePreviewGuid =
                                insights_Store.previewTabs[0].asset.guid
                        }
                    } else {
                        insights_Store.previewTabs.splice(index, 1)
                        insights_Store.activePreviewGuid = undefined
                    }
                }
            }
            const selectPreviewTab = (guid: string) => {
                insights_Store.activePreviewGuid = guid
                activeResultPreviewTab.value = false
                if (lastElement.value) lastElement.value.style.background = ''
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
                    if (_index < 0) return 0
                    return insights_Store.previewTabs[
                        _index
                    ].columns.length?.toLocaleString()
                } else {
                    return (
                        activeInlineTab.value.playground.resultsPane.result
                            .totalRowsCount >= 0 &&
                        activeInlineTab.value.playground.editor.columnList.length?.toLocaleString()
                    )
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

            const getResultsIcon = computed(() => {
                if (
                    activeInlineTab.value.playground.resultsPane.result
                        .isQueryRunning === 'success'
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
            })
            const isQueryRunning = computed(() => {
                return insights_Store.previewTabs[
                    insights_Store.previewTabs.findIndex(
                        (el) =>
                            el.asset.guid === insights_Store.activePreviewGuid
                    )
                ]?.isQueryRunning
            })

            const handleTabChange = (index: any) => {
                const _index = Number(index.split('.')[0])
                const guid =
                    insights_Store.previewTabs[Number(_index)].asset.guid
                selectPreviewTab(guid)
            }

            // WATCHERS
            watch(
                () => insights_Store.activePreviewGuid,
                (newId) => {
                    if (newId) {
                        activeResultPreviewTab.value = false
                    }
                    if (lastElement.value) {
                        lastElement.value.style.background = ''
                    }
                },
                { immediate: true }
            )

            watch(
                isQueryRunning,
                (newIsQueryRunning) => {
                    debugger
                    if (!newIsQueryRunning) return
                    if (
                        insights_Store.insertionType === 'FILO' &&
                        insights_Store.previewTabs.length > 0 &&
                        newIsQueryRunning !== '' &&
                        insights_Store.isNewTabAdded > 0
                    ) {
                        const x = setTimeout(() => {
                            const elements = document.getElementsByClassName(
                                'ant-tabs-tab-active'
                            )
                            const tabElements = document.getElementsByClassName(
                                'insights_preview_tabs'
                            )
                            Array.from(tabElements).forEach((el) => {
                                el.style.background = ''
                            })
                            if (elements.length) {
                                if (lastElement.value) {
                                    lastElement.value.style.background = ''
                                }
                                lastElement.value =
                                    elements[elements.length - 1]
                                lastElement.value.style.background =
                                    'rgba(254, 247, 228, 1)'
                                const t = setTimeout(() => {
                                    if (
                                        lastElement.value.style.background !==
                                        ''
                                    ) {
                                        lastElement.value.style.background =
                                            'white'
                                    }
                                    clearTimeout(t)
                                }, 1500)
                            }
                            clearTimeout(x)
                        }, 50)
                    }
                },
                { immediate: true }
            )

            const getIndexById = (id: string) => {
                return insights_Store.previewTabs.findIndex(
                    (el) => el.asset.guid === id
                )
            }

            // POWER FEATURES
            const closeAllOtherTabs = ({ item }) => {
                insights_Store.previewTabs = insights_Store.previewTabs.filter(
                    (el) => el.asset.guid === item.asset.guid
                )
                insights_Store.activePreviewGuid =
                    insights_Store.previewTabs[0].asset.guid
            }
            const closeAllTabsOnRight = ({ item }) => {
                const _index = getIndexById(item.asset.guid)
                insights_Store.previewTabs = insights_Store.previewTabs.filter(
                    (el, index) => index <= _index
                )
                insights_Store.activePreviewGuid = item.asset.guid
            }
            const closeAllTabs = ({ item }) => {
                insights_Store.activePreviewGuid = undefined
                insights_Store.isNewTabAdded = -1
                insights_Store.previewTabs = []
            }

            const dropdownOptions = computed(() => {
                return [
                    {
                        title: 'Close all other tabs',
                        key: 'Close all other tabs',
                        class: '',
                        disabled: false,
                        component: MenuItem,
                        hide: false,
                        handleClick: closeAllOtherTabs,
                    },
                    {
                        title: 'Close all tabs on right',
                        key: 'Close all tabs on right',
                        component: MenuItem,
                        class: '',
                        disabled: false,
                        hide: false,
                        handleClick: closeAllTabsOnRight,
                    },
                    {
                        title: 'Close all tabs',

                        key: 'Close all tabs',
                        component: MenuItem,
                        class: '',
                        disabled: false,
                        hide: false,
                        handleClick: closeAllTabs,
                    },
                    {
                        title: 'Close tab',

                        key: 'Close tab',
                        component: MenuItem,
                        class: '',
                        disabled: false,
                        hide: false,
                        handleClick: ({ item }) => {
                            onPreviewTabClose(item.asset.guid)
                        },
                    },
                ]
            })

            const onDropdownVisibleChange = (visible) => {
                if (visible) {
                    hideTabsToolTips.value = true
                } else {
                    hideTabsToolTips.value = false
                }
            }

            return {
                hideTabsToolTips,
                onDropdownVisibleChange,
                dropdownOptions,
                handleTabChange,
                width,
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
<style lang="less">
    .recent-preview-tab-add-insights {
        background: rgba(254, 247, 228, 1);
    }
</style>
<style lang="less" scoped>
    .bg-gray-C4C4C4 {
        background: #c4c4c4;
    }
    .custom-shadow {
        box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.12);
    }

    .not-active {
        @apply bg-new-gray-200;
    }
    .tab-active {
        @apply bg-white;
    }
</style>
<style lang="less" module>
    .previewtab_footer {
        height: 32px !important;
        :global(.ant-tabs-nav .ant-tabs-tab-active) {
            @apply shadow !important;
            background: white;
            padding: 4px 8px;
            @apply rounded;
            -webkit-transition: background 0.5s ease-in-out !important;
            -moz-transition: background 0.5s ease-in-out !important;
            -o-transition: background 0.5s ease-in-out !important;
            transition: background 0.5s ease-in-out !important;
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
