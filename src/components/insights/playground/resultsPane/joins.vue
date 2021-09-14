<template>
    <div class="w-full h-full p-3 rounded box">
        <div
            class="flex items-center justify-center w-full h-full rounded  placeholder"
        >
            Joins
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, toRefs } from 'vue'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'

    export default defineComponent({
        components: {},
        props: {},
        setup(props) {},
    })
</script>
<style lang="less" scoped>
    .placeholder {
        background-color: #f4f4f4;
    }
    .box {
        height: 90.5%;
    }
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
