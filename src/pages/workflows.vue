<template>
    <div class="flex w-full h-full overflow-x-hidden bg-white">
        <div class="flex-1 border-r border-gray-200">
            <router-view v-if="isItem" />

            <WorkflowDiscovery
                ref="assetdiscovery"
                :style="isItem ? 'display: none !important;' : ''"
            ></WorkflowDiscovery>
        </div>

        <div
            class="relative hidden bg-white asset-preview-container md:block"
            v-if="!isItem"
        >
            <WorfklowPreview :item="localSelected"></WorfklowPreview>
        </div>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, onMounted, provide, ref } from 'vue'
    import { useHead } from '@vueuse/head'
    import { useRoute } from 'vue-router'
    import WorkflowDiscovery from '@/workflows/index.vue'
    import WorfklowPreview from '@/workflows/preview.vue'
    import useAssetStore from '~/store/asset'

    export default defineComponent({
        components: {
            WorkflowDiscovery,
            WorfklowPreview,
        },
        setup() {
            useHead({
                title: 'Assets',
            })
            const route = useRoute()
            const assetdiscovery = ref()

            const isItem = computed(() => route.params.id || isSetup.value)
            const isSetup = computed(() =>
                route.path.startsWith('/workflows/setup')
            )
            const localSelected = ref()

            const handlePreview = (asset) => {
                localSelected.value = asset
            }
            const updateList = (asset) => {
                if (assetdiscovery.value) {
                    assetdiscovery.value.updateCurrentList(asset)
                }
                handlePreview(asset)
            }

            provide('updateList', updateList)
            provide('preview', handlePreview)

            return {
                isSetup,
                assetdiscovery,
                localSelected,
                isItem,
            }
        },
    })
</script>
<style scoped>
    .asset-preview-container {
        min-width: 420px !important;
        max-width: 420px !important;
    }
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
