<template>
    <div class="flex w-full h-full bg-white">
        <splitpanes class="w-full h-full bg-white">
            <pane
                min-size="20"
                max-size="50"
                :size="22"
                style="min-width: 264px"
            >
                <div class="h-full border-r border-gray-200">
                    <GlossaryDiscovery class="h-full"></GlossaryDiscovery>
                </div>
            </pane>
            <pane :size="50" class="bg-white">
                <div class="flex w-full h-full">
                    <!-- <BulkUploadProgress /> -->
                    <router-view
                        v-if="isItem"
                        :selected-asset="selectedGlossary"
                    />
                </div>
            </pane>
            <pane min-size="28" max-size="28" :size="28" class="bg-white">
                <div
                    class="h-full bg-white border-l xs:hidden sm:hidden md:block lg:block"
                >
                    <GlossaryPreview
                        :selected-asset="localSelected"
                    ></GlossaryPreview>
                </div>
            </pane>
        </splitpanes>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, provide, watch, ref } from 'vue'
    import { useHead } from '@vueuse/head'
    import { useRoute } from 'vue-router'

    import GlossaryDiscovery from '@/glossary/index.vue'
    import GlossaryPreview from '@/common/assets/preview/index.vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import useGlossaryStore from '~/store/glossary'
    import useAssetStore from '~/store/asset'
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
            const glossaryStore = useGlossaryStore()
            const assetStore = useAssetStore()

            if (selectedGlossary.value?.guid === id.value) {
                localSelected.value = selectedGlossary.value
            }
            const handlePreview = (asset) => {
                localSelected.value = asset
                glossaryStore.setSelectedGTC(asset)
                assetStore.setSelectedAsset(asset)
            }
            const updateList = (asset) => {
                localSelected.value = asset
                glossaryStore.setSelectedGTC(asset)
                assetStore.setSelectedAsset(asset)
            }
            watch(selectedGlossary, () => {
                if (isItem.value) localSelected.value = selectedGlossary.value
            })
            watch(isItem, () => {
                if (!id.value) {
                    localSelected.value = null
                }
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
