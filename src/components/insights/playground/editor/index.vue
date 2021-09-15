<template>
    <div class="w-full h-full p-3 rounded">
        <div class="flex justify-center w-full h-full rounded">
            <div class="flex justify-between w-full mb-4 run-btn-wrapper">
                <div class="w-full">
                    <p class="mb-1 text-base">Superstore sales data 2016</p>
                </div>
                <a-button
                    type="primary"
                    class=""
                    :loading="isQueryRunning === 'loading' ? true : false"
                    @click="runQuery"
                    >Run Query</a-button
                >
            </div>
            <Monaco />
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, inject, Ref, ref } from 'vue'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import Monaco from './monaco/monaco.vue'

    export default defineComponent({
        components: { Monaco },
        props: {},
        setup(props) {
            // const { selectedTab } = toRefs(props)
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as Ref<activeInlineTabInterface>

            const isQueryRunning = ref(false)
            const runQuery = () => {}
            return {
                activeInlineTab,
                isQueryRunning,
                runQuery,
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
