<template>
    <div class="flex w-full h-full bg-white">
        <div class="flex-1 border-r border-gray-300 item-stretch">
            <div class="flex w-full h-full">
                <transition name="fade" v-if="isItem">
                    <router-view
                        :selected-asset="selectedAsset"
                        @preview="setSelectedAsset($event)"
                    />
                </transition>
                <keep-alive>
                    <AssetDiscovery
                        :style="isItem ? 'display: none !important;' : ''"
                    ></AssetDiscovery>
                </keep-alive>
            </div>
        </div>

        <div
            class="relative bg-white  asset-preview-container xs:hidden sm:hidden md:block lg:block"
        >
            <AssetPreview
                :selected-asset="selectedAssetFromEmit || selectedAsset"
            ></AssetPreview>
        </div>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, ref } from 'vue'
    import { useHead } from '@vueuse/head'
    import { useRoute } from 'vue-router'

    import AssetDiscovery from '@/assets/index.vue'
    import AssetPreview from '@/assets/preview/index.vue'
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
            const isItem = computed(() => !!route.params.id)
            const { selectedAsset } = useAssetInfo()
            const selectedAssetFromEmit = ref(null)

            const setSelectedAsset = (e) => {
                selectedAssetFromEmit.value = e
            }
            return {
                isItem,
                selectedAsset,
                selectedAssetFromEmit,
                setSelectedAsset,
            }
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
