<template>
    <div class="flex-1 p-3 rounded">
        <div class="flex justify-center w-full h-full overflow-x-auto rounded">
            <a-table
                class="w-full overflow-x-auto"
                :loading="isQueryRunning === 'loading' ? true : false"
                :class="$style.result_tab"
                :data-source="activeInlineTab.playground.editor.dataList"
                :columns="activeInlineTab.playground.editor.columnList"
                :scroll="{ x: 500, y: 240 }"
            />
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
            const isQueryRunning = inject('isQueryRunning') as Ref<string>
            return {
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
