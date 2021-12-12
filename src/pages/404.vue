<template>
    <div class="flex justify-center h-full">
        <div class="max-w-md py-4 px-8 bg-white rounded-lg my-20">
        <div>
            <h2 class="text-gray-800 text-3xl font-semibold"><span class="text-primary">404</span> Page not found</h2>
            <!--p class="mt-2 text-gray-600">Please check the URL in the adress bar and try again.</p-->
        </div>
</div>
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

