<template>
    <div class="w-full h-full p-3 rounded">
        <div
            class="flex items-center justify-center w-full h-full rounded  placeholder"
        >
            Editor - {{ activeInlineTab?.playground?.editorTitle }}
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, toRefs, inject, Ref } from 'vue'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'

    export default defineComponent({
        components: {},
        props: {},
        setup(props) {
            // const { selectedTab } = toRefs(props)
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
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
