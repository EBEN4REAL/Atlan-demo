<template>
    <AssetDiscovery :selected-asset="selectedAsset"></AssetDiscovery>
</template>

<script lang="ts">
    import { computed, defineComponent, ref, Ref, watch, nextTick } from 'vue'
    import { useHead } from '@vueuse/head'
    import { useRoute } from 'vue-router'

    import AssetDiscovery from '@/assets/index.vue'

    export default defineComponent({
        components: {
            AssetDiscovery,
        },
        props: {
            selectedAsset: {
                type: Object,
                required: true,
            },
        },
        setup() {
            useHead({
                title: 'Assets',
            })
        },
    })
</script>
<style scoped>
    .asset-preview-container {
        width: 420px !important;
        max-width: 420px !important;
    }
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
