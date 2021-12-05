<template>
    <div class="flex w-full h-full bg-white">
        <div class="w-1/5 h-full border-r border-gray-200">
            <GlossaryDiscovery class="h-full"></GlossaryDiscovery>
        </div>
        <div class="flex-1 border-r border-gray-300">
            <div class="flex w-full h-full">
                <!-- <BulkUploadProgress /> -->
                <router-view v-if="isItem" :selected-asset="selectedGlossary" />
            </div>
        </div>

        <div
            class="bg-white asset-preview-container xs:hidden sm:hidden md:block lg:block"
        >
            <GlossaryPreview :selected-asset="localSelected"></GlossaryPreview>
            <!-- <AssetPreview :selected-asset="selectedAsset"></AssetPreview> -->
        </div>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, provide, watch, ref } from 'vue'
    import { useHead } from '@vueuse/head'
    import { useRoute } from 'vue-router'

    import GlossaryDiscovery from '@/glossary/index.vue'
    import GlossaryPreview from '@/common/assets/preview/index.vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    // import BulkUploadProgress from '~/components/common/widgets/bulkUploadProgress/progressWidget.vue'

    export default defineComponent({
        components: {
            GlossaryDiscovery,
            GlossaryPreview,
            // BulkUploadProgress,
        },
        setup() {
            useHead({
                title: 'Glossary',
            })
            const route = useRoute()
            const id = computed(() => route?.params?.id || null)
            const isItem = computed(() => !!route.params.id)
            const { selectedGlossary } = useAssetInfo()
            const localSelected = ref()
            if (selectedGlossary.value?.guid === id.value) {
                localSelected.value = selectedGlossary.value
            }
            const handlePreview = (asset) => {
                localSelected.value = asset
            }

            const updateList = (asset) => {
                console.log('updateList')
                // console.log(asset)
                // if (assetdiscovery.value) {
                //     assetdiscovery.value.updateCurrentList(asset)
                // }
            }
            watch(selectedGlossary, () => {
                localSelected.value = selectedGlossary.value
            })

            provide('updateList', updateList)
            provide('preview', handlePreview)

            return {
                isItem,
                selectedGlossary,
                localSelected,
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
