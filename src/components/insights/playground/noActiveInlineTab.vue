<template>
    <div class="w-full h-full p-3 rounded">
        <div
            class="flex items-center justify-center w-full h-full rounded  placeholder"
        >
            No Tab created !!
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, toRefs } from 'vue'

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
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
