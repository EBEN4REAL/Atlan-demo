<template>
    <div class="flex w-full h-full bg-white">
        <div class="flex-1 border-r border-gray-300 item-stretch">
            <div class="flex h-full">
                <router-view v-slot="{ Component, route }">
                    <transition :name="'fade'" mode="out-in">
                        <keep-alive>
                            <component
                                :is="Component"
                                :selected-asset="selectedAsset"
                                :key="isItem ? 'profile' : 'discover'"
                            />
                        </keep-alive>
                    </transition>
                </router-view>
            </div>
        </div>

        <div
            id="overAssetPreviewSidebar"
            class="relative bg-white  asset-preview-container xs:hidden sm:hidden md:hidden lg:block"
        >
            <AssetPreview :selected-asset="selectedAsset"></AssetPreview>
        </div>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, ref, Ref, watch, nextTick } from 'vue'
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
            const isItem = computed(() => route.params.id)

            const { selectedAsset } = useAssetInfo()

            return {
                isItem,
                selectedAsset,
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

<style lang="less">
    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.3s;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
        opacity: 0;
    }
</style>
