<template>
    <div class="w-full h-full px-3 pb-3 rounded">
        <div class="w-full h-full overflow-x-hidden rounded">
            <div
                class="flex items-center justify-between w-full mb-3  run-btn-wrapper"
            >
                <div class="w-full">
                    <p class="mb-1 text-base">WEB SALES</p>
                </div>
                <a-button
                    type="primary"
                    class=""
                    :loading="isQueryRunning === 'loading' ? true : false"
                    @click="run"
                    >Run Query</a-button
                >
            </div>
            <Monaco />
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, inject, Ref } from 'vue'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import Monaco from './monaco/monaco.vue'
    import useRunQuery from '../common/composables/useRunQuery'
    import { useInlineTab } from '~/components/insights/common/composables/useInlineTab'

    export default defineComponent({
        components: { Monaco },
        props: {},
        setup() {
            const { queryRun } = useRunQuery()

            const activeInlineTab = inject(
                'activeInlineTab'
            ) as Ref<activeInlineTabInterface>
            const tabs = inject('inlineTabs') as Ref<activeInlineTabInterface[]>
            const isQueryRunning = inject('isQueryRunning') as Ref<string>
            const { modifyActiveInlineTab } = useInlineTab()

            const getData = (dataList, columnList) => {
                console.log(dataList, columnList, 'called from callback')
                const activeInlineTabCopy: activeInlineTabInterface =
                    Object.assign({}, activeInlineTab.value)
                activeInlineTabCopy.playground.editor.dataList = dataList
                activeInlineTabCopy.playground.editor.columnList = columnList
                modifyActiveInlineTab(activeInlineTabCopy, tabs)
            }
            const run = () => {
                queryRun(activeInlineTab.value, getData, isQueryRunning)
            }

            return {
                activeInlineTab,
                isQueryRunning,
                run,
            }
        },
    })
</script>
<style lang="less" scoped>
    .placeholder {
        background-color: #f4f4f4;
    }
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
