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
                    @click="queryRun"
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

    export default defineComponent({
        components: { Monaco },
        props: {},
        setup(props, { emit }) {
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as Ref<activeInlineTabInterface>
            const isQueryRunning = inject('isQueryRunning') as Ref<string>
            const queryRun = inject('queryRun') as Function
            return {
                activeInlineTab,
                isQueryRunning,
                queryRun,
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
