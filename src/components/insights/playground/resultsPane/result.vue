<template>
    <div class="relative w-full h-full p-3 overflow-hidden rounded">
        <div
            class="
                relative
                flex
                justify-center
                overflow-x-auto
                rounded
                table_height
            "
        >
            <a-table
                class="w-full overflow-x-auto"
                :loading="isQueryRunning === 'loading' ? true : false"
                :class="$style.result_tab"
                :data-source="activeInlineTab.playground.editor.dataList"
                :scroll="{ x: 500 }"
                :columns="activeInlineTab.playground.editor.columnList"
            />
        </div>
        <div
            class="
                absolute
                left-0
                flex
                w-full
                bg-white
                border-t
                bottom_footer
                h-7
            "
            v-if="activeInlineTab.playground.editor.columnList.length > 0"
        >
            <div class="flex items-center px-3 text-gray-500">
                <span class="mr-2">
                    {{
                        activeInlineTab.playground.editor.columnList.length
                    }}&nbsp;Columns
                </span>
                <div class="w-1 h-1 mx-2 bg-gray-500 rounded-full"></div>
                <span class="mr-2"> Get rows count </span>
                <!-- Execution Time will be shown when it is >0 -->
                <div
                    v-if="queryExecutionTime > 0"
                    class="w-1 h-1 mx-2 bg-gray-500 rounded-full"
                ></div>
                <span v-if="queryExecutionTime > 0" class="mr-2">
                    Took Time: {{ queryExecutionTime }}ms
                </span>
                <!-- -------------------------------------------- -->
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, Ref, inject, PropType, toRefs } from 'vue'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'

    export default defineComponent({
        components: {},
        props: {
            dataList: {
                type: Object as PropType<any>,
                required: true,
            },
            columnList: {
                type: Object as PropType<any>,
                required: true,
            },
        },
        setup(props) {
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as Ref<activeInlineTabInterface>
            const queryExecutionTime = inject(
                'queryExecutionTime'
            ) as Ref<number>
            const isQueryRunning = inject('isQueryRunning') as Ref<string>
            return {
                queryExecutionTime,
                isQueryRunning,
                activeInlineTab,
            }
        },
    })
</script>
<style lang="less" scoped>
    .placeholder {
        background-color: #f4f4f4;
    }
    .table_height {
        height: 85%;
    }
    .bottom_footer {
        bottom: 10%;
    }
</style>
<style lang="less" module>
    .result_tab {
        :global(.ant-table-placeholder) {
            border-bottom: none !important;
        }
    }
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
