<template>
    <div class="w-full p-3 rounded box">
        <div
            class="flex items-center justify-center w-full h-full rounded  placeholder"
        >
            SQL help - {{ activeInlineTab.label }}
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, Ref, inject } from 'vue'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'

    export default defineComponent({
        components: {},
        props: {},
        setup(props) {
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as Ref<activeInlineTabInterface>
            return {
                activeInlineTab,
            }
        },
    })
</script>
<style lang="less" scoped>
    .placeholder {
        background-color: #f4f4f4;
    }
    .box {
        height: 90%;
    }
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
