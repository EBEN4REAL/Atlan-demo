<template>
    <AssetsV2 />
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import AssetsV2 from '@/assetsV2.vue'

    export default defineComponent({
        name: 'AssetsV2Component',
        components: { AssetsV2 },
    })
</script>

<style></style>
<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
