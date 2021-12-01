<template>
    <div
        class="absolute flex items-center justify-center w-full h-full p-3 rounded  placeholder vqb"
        style="z-index: 2"
    ></div>
</template>

<script lang="ts">
    import { defineComponent, PropType, toRefs } from 'vue'

    export default defineComponent({
        name: 'VQB',
        components: {},
        setup(props, { emit }) {
            return {}
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
