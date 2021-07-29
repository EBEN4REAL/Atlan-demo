<template>
    <div class="container flex flex-col w-full h-full bg-gray-200">
        <h1>readme test</h1>
        <br /><br />
        <Readme placeholder="Add some details here..." parent-asset-id="" />
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'

    import Readme from '@/common/readme/index.vue'

    export default defineComponent({
        components: {
            Readme,
        },
    })
</script>

<style lang="less">
    .container {
        display: flex;
        width: 100vw !important;
        align-items: center;
    }
</style>

<route lang="yaml">
meta:
    layout: project
    requiresAuth: true
</route>
