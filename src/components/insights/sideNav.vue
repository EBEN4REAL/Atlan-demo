<template>
    <div class="flex flex-col items-center w-16 h-full pt-4 bg-white border-r">
        <div class="flex flex-col items-center my-3 text-xs">
            <div class="w-6 h-6 rounded placeholder"></div>
            <p class="mb-0 text-gray">Schema</p>
        </div>
        <div class="flex flex-col items-center my-3 text-xs">
            <div class="w-6 h-6 rounded placeholder"></div>
            <p class="mb-0 text-gray">Queries</p>
        </div>
        <div class="flex flex-col items-center my-3 text-xs">
            <div class="w-6 h-6 rounded placeholder"></div>
            <p class="mb-0 text-gray">History</p>
        </div>
        <div class="flex flex-col items-center my-3 text-xs">
            <div class="w-6 h-6 rounded placeholder"></div>
            <p class="mb-0 text-gray">Schedule</p>
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
