<template>
    <div
        class="flex justify-between w-full h-8 py-1 text-xs border-b"
        style="max-height: 8%; background: #fbfbfb"
        v-if="
            activeInlineTab.playground.editor.columnList.length > 0 &&
            isQueryRunning === 'success'
        "
    >
        <div class="flex items-center px-3 text-gray-700 mt-0.5">
            <span class="mr-2">
                {{
                    `${activeInlineTab.playground.resultsPane.result.totalRowsCount} rows`
                }}
            </span>
            <div class="w-1 h-1 mr-2 bg-gray-500 rounded-full mb-0.5"></div>

            <span class="mr-2">
                {{
                    activeInlineTab.playground.editor.columnList.length
                }}&nbsp;cols
            </span>
            <!-- Execution Time will be shown when it is >0 -->
            <div
                v-if="queryExecutionTime > 0"
                class="w-1 h-1 mr-2 bg-gray-500 rounded-full mb-0.5"
            ></div>
            <span v-if="queryExecutionTime > 0" class="flex items-center mr-2">
                <AtlanIcon class="w-4 h-4 mr-1 mb-0.5" icon="QueryTime" />
                <span>
                    {{ getFormattedTimeFromMilliSeconds(queryExecutionTime) }}
                </span>
            </span>
            <!-- -------------------------------------------- -->
        </div>
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
                <div
                    class="flex items-center p-1 mr-3 rounded cursor-pointer"
                    @click="
                        useCopy(
                            activeInlineTab.playground.editor.columnList,
                            activeInlineTab.playground.editor.dataList
                        )
                    "
                >
                    <AtlanIcon
                        icon="CopyOutlined"
                        class="w-4 h-4 mr-1 text-gray-500"
                    />
                    <span class="mt-1">Copy</span>
                </div>
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
                <div
                    class="flex items-center p-1 mr-2 rounded cursor-pointer"
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
                    <AtlanIcon
                        icon="Download"
                        class="w-4 h-4 mr-1 text-gray-500"
                    />
                    <span class="mt-1">Download</span>
                </div>
            </a-tooltip>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, computed, inject, Ref } from 'vue'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import {
        useTableExport,
        useCopy,
    } from '~/components/insights/common/composables/useTableExport'
    import { useUtils } from '~/components/insights/common/composables/useUtils'

    export default defineComponent({
        components: {},
        props: {},
        setup() {
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as Ref<activeInlineTabInterface>

            const { getFormattedTimeFromMilliSeconds } = useUtils()

            const isQueryRunning = computed(
                () =>
                    activeInlineTab.value.playground.resultsPane.result
                        .isQueryRunning
            )
            const queryExecutionTime = computed(
                () =>
                    activeInlineTab.value.playground.resultsPane.result
                        .executionTime
            )
            return {
                queryExecutionTime,
                activeInlineTab,
                isQueryRunning,
                useTableExport,
                useCopy,
                getFormattedTimeFromMilliSeconds,
            }
        },
    })
</script>
<style lang="less" scoped></style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
