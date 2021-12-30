<template>
    <div class="flex w-full h-full overflow-x-hidden bg-white">
        <div class="flex-1 border-r border-gray-200">
            <router-view v-if="isItem" />

            <keep-alive>
                <AssetDiscovery
                    ref="assetdiscovery"
                    :style="isItem ? 'display: none !important;' : ''"
                ></AssetDiscovery>
            </keep-alive>
        </div>

        <div class="relative hidden bg-white asset-preview-container md:block">
            <AssetPreview :selected-asset="localSelected"></AssetPreview>
        </div>
    </div>
</template>

<script lang="ts">
    import {
        computed,
        defineComponent,
        onMounted,
        provide,
        ref,
        watch,
    } from 'vue'
    import { useHead } from '@vueuse/head'
    import { useRoute } from 'vue-router'
    import AssetDiscovery from '@/assets/index.vue'
    import AssetPreview from '@/common/assets/preview/index.vue'
    import useAssetStore from '~/store/asset'
    import { useTrackPage } from '~/composables/eventTracking/useAddEvent'

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
            const assetdiscovery = ref()
            const isItem = computed(() => !!route.params.id)
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

            const sendPageEvent = () => {
                useTrackPage('assets', 'discovery')
            }

            watch(isItem, (isAssetProfile) => {
                if (!isAssetProfile) {
                    sendPageEvent()
                }
            })

            onMounted(() => {
                if (!isItem.value) {
                    sendPageEvent()
                }
                console.log('onMounted assets')
            })

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
