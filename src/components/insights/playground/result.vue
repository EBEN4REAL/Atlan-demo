<template>
    <div class="w-full p-3 rounded box">
        <!-- <div
            class="flex items-center justify-center w-full h-full rounded placeholder"
        >
            Result - {{ selectedTab?.playground?.resultsPane?.result.title }}
        </div> -->
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, toRefs } from 'vue'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'

    export default defineComponent({
        components: {},
        props: {
            selectedTab: {
                type: Object as PropType<activeInlineTabInterface>,
                required: true,
            },
        },
        setup(props) {
            const { selectedTab } = toRefs(props)
            return {
                selectedTab,
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
