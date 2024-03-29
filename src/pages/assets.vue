<template>
    <div class="flex w-full h-full overflow-x-hidden bg-white">
        <div class="flex-1 border-r border-gray-300">
            <router-view v-if="isItem" />

            <keep-alive>
                <AssetDiscovery
                    ref="assetdiscovery"
                    :style="isItem ? 'display: none !important;' : ''"
                ></AssetDiscovery>
            </keep-alive>
        </div>

        <transition name="nested">
            <div
                v-if="showAssetPreview"
                class="relative hidden bg-white asset-preview-container md:block"
            >
                <AssetPreview
                    ref="previewRef"
                    :selected-asset="localSelected"
                /></div
        ></transition>
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

            const showAssetPreview = ref(true)
            const previewRef = ref(null)

            const assetStore = useAssetStore()

            const handlePreview = (asset) => {
                localSelected.value = asset
                assetStore.setSelectedAsset(asset)
            }
            const handleTabSwitch = (payload) => {
                console.log('switch', payload)
                previewRef.value?.switchTab(payload?.asset, payload?.tab)
            }

            const updateList = (asset) => {
                if (assetdiscovery.value) {
                    assetdiscovery.value.updateCurrentList(asset)
                }
                handlePreview(asset)
            }

            const handlePreviewVisibility = (value) => {
                showAssetPreview.value = value
            }

            provide('updateList', updateList)
            provide('preview', handlePreview)
            provide('switchSidebarTab', handleTabSwitch)

            provide('handlePreviewVisibility', handlePreviewVisibility)

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
            })

            return {
                isItem,
                assetdiscovery,
                localSelected,
                sendPageEvent,
                showAssetPreview,
                handleTabSwitch,
                previewRef,
            }
        },
    })
</script>
<style scoped>
    .asset-preview-container {
        min-width: 420px !important;
        max-width: 420px !important;
    }

    .nested-enter-active,
    .nested-leave-active {
        transition: all 0.3s ease;
    }

    .nested-enter-from,
    .nested-leave-to {
        transform: translateX(30px);
        opacity: 0;
    }
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
