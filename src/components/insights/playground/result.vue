<template>
    <div class="container p-3 rounded">
        <div
            class="flex items-center justify-center w-full h-full rounded  placeholder"
        >
            Result
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
    .container {
        flex: 0.4;
    }
    .placeholder {
        background-color: #f4f4f4;
    }
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
