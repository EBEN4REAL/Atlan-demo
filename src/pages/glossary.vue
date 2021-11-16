<template>
    <div class="flex w-full h-full bg-white">
        <div class="flex-1 border-r border-gray-300 item-stretch">
            <div class="flex w-full h-full">
                <transition name="fade" v-if="isItem">
                    <router-view :selected-asset="selectedGlossary" />
                </transition>
                <keep-alive>
                    <GlossaryDiscovery
                        :style="isItem ? 'display: none !important;' : ''"
                    ></GlossaryDiscovery>
                </keep-alive>
            </div>
        </div>

        <div
            class="relative bg-white  asset-preview-container xs:hidden sm:hidden md:block lg:block"
        >
            <GlossaryPreview
                :selected-asset="selectedGlossary"
            ></GlossaryPreview>
            <!-- <AssetPreview :selected-asset="selectedAsset"></AssetPreview> -->
        </div>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, provide } from 'vue'
    import { useHead } from '@vueuse/head'
    import { useRoute } from 'vue-router'

    import GlossaryDiscovery from '@/glossary/index.vue'
    import GlossaryPreview from '@/common/assets/preview/index.vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'

    export default defineComponent({
        components: {
            GlossaryDiscovery,
            GlossaryPreview,
        },
        setup() {
            useHead({
                title: 'Glossary',
            })
            const route = useRoute()
            const isItem = computed(() => !!route.params.id)
            const { selectedGlossary } = useAssetInfo()

            const updateList = (asset) => {
                console.log('updateList')
                // console.log(asset)
                // if (assetdiscovery.value) {
                //     assetdiscovery.value.updateCurrentList(asset)
                // }
            }

            provide('updateList', updateList)

            return {
                isItem,
                selectedGlossary,
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
