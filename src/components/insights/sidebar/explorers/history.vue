<template>
    <div
        class="flex items-center justify-center h-full p-3 bg-white border-r  w-72"
    >
        <div
            class="flex items-center justify-center w-full h-full rounded  placeholder"
        >
            History Explorer
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
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
