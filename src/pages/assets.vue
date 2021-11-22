<template>
    <div class="flex w-full h-full overflow-x-hidden bg-white">
        <div class="flex-1 border-r border-gray-200">
            <router-view
                v-if="isItem"
                :selected-asset="selectedAsset"
                @preview="setSelectedAsset($event)"
            />

            <keep-alive>
                <AssetDiscovery
                    ref="assetdiscovery"
                    :style="isItem ? 'display: none !important;' : ''"
                ></AssetDiscovery>
            </keep-alive>
        </div>

        <div class="relative hidden bg-white asset-preview-container md:block">
            <AssetPreview
                :selected-asset="selectedAssetFromEmit || selectedAsset"
            ></AssetPreview>
        </div>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, provide, ref } from 'vue'
    import { useHead } from '@vueuse/head'
    import { useRoute } from 'vue-router'
    import AssetDiscovery from '@/assets/index.vue'
    import AssetPreview from '@/common/assets/preview/index.vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'

    export default defineComponent({
        components: {
            AssetDiscovery,
            AssetPreview,
        },
        setup() {
            useHead({
                title: 'Assets',
            })
            const route = useRoute()
            const { selectedAsset } = useAssetInfo()
            const assetdiscovery = ref()
            const selectedAssetFromEmit = ref(null)
            const setSelectedAsset = (e) => {
                selectedAssetFromEmit.value = e
            }
            const isItem = computed(() => !!route.params.id)
            const updateList = (asset) => {
                if (assetdiscovery.value) {
                    assetdiscovery.value.updateCurrentList(asset)
                }
            }
            provide('updateList', updateList)
            return {
                isItem,
                selectedAsset,
                selectedAssetFromEmit,
                setSelectedAsset,
                assetdiscovery,
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
