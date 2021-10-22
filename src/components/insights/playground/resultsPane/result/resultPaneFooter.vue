<template>
    <div
        class="left-0 flex w-full h-8 py-1 text-xs bg-white border-t border-b bottom_footer"
        v-if="
            activeInlineTab.playground.editor.columnList.length > 0 &&
            isQueryRunning === 'success'
        "
    >
        <div class="flex items-center px-3 text-gray-500 mt-0.5">
            <span class="mr-3">
                {{
                    activeInlineTab.playground.editor.columnList.length
                }}&nbsp;Columns
            </span>
            <div class="w-1 h-1 mr-3 bg-gray-500 rounded-full"></div>
            <!-- <div
                        class="flex items-center justify-center mx-2"
                        v-if="rowCountRunning == 'loading'"
                    >
                        <div class="loader_16"></div>
                    </div> -->
            <span class="mr-3"
                >{{
                    `${activeInlineTab.playground.resultsPane.result.totalRowsCount} rows`
                }}
            </span>
            <!-- Execution Time will be shown when it is >0 -->
            <div
                v-if="queryExecutionTime > 0"
                class="w-1 h-1 mr-3 bg-gray-500 rounded-full"
            ></div>
            <span v-if="queryExecutionTime > 0" class="mr-3">
                Took Time:
                {{ queryExecutionTime }}ms
            </span>
            <!-- -------------------------------------------- -->
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, computed, inject, Ref } from 'vue'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'

    export default defineComponent({
        components: {},
        props: {},
        setup() {
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as Ref<activeInlineTabInterface>
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
