<template>
    <div class="container flex flex-col h-full">
        <h1>404</h1>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import { useRouter } from 'vue-router'
    export default defineComponent({
    });
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
    layout: default
    requiresAuth: true
</route>

