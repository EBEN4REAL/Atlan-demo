<template>
    <div class="flex w-full h-full overflow-x-hidden bg-white">
        <router-view v-if="isItem" />
        <div class="flex-1 border-r border-gray-200" v-else-if="!isItem">
            <keep-alive>
                <WorkflowDiscovery
                    ref="assetdiscovery"
                    :style="isItem ? 'display: none !important;' : ''"
                ></WorkflowDiscovery>
            </keep-alive>
        </div>

        <div
            class="relative hidden bg-white asset-preview-container md:block"
            v-else-if="!isItem"
        >
            <AssetPreview :selected-asset="localSelected"></AssetPreview>
        </div>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, onMounted, provide, ref } from 'vue'
    import { useHead } from '@vueuse/head'
    import { useRoute } from 'vue-router'
    import WorkflowDiscovery from '@/workflows/index.vue'
    import AssetPreview from '@/common/assets/preview/index.vue'
    import useAssetStore from '~/store/asset'

    export default defineComponent({
        components: {
            WorkflowDiscovery,
            AssetPreview,
        },
        setup() {
            useHead({
                title: 'Assets',
            })
            const route = useRoute()
            const assetdiscovery = ref()
            const isItem = computed(
                () =>
                    !!route.params.id ||
                    route.path.startsWith('/workflows/setup')
            )
            const localSelected = ref()

            const assetStore = useAssetStore()

            const handlePreview = (asset) => {
                localSelected.value = asset
                assetStore.setSelectedAsset(asset)
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
                isItem,
                assetdiscovery,
                localSelected,
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
