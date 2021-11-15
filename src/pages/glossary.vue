<template>
    <splitpanes class="w-full h-full default-theme">
        <pane
            min-size="12"
            max-size="50"
            :size="12"
            style="min-width: 264px"
            class="relative"
        >
            <GlossaryDiscovery />
        </pane>

        <pane :size="82" class="bg-white w-ful">
            <div class="flex w-full h-full bg-white">
                <div class="flex-1 border-r border-gray-300 item-stretch">
                    <div class="flex h-full">
                        <router-view :selected-glossary="selectedGlossary" />
                    </div>
                </div>

                <div
                    v-if="isItem"
                    id="overAssetPreviewSidebar"
                    class="relative bg-white asset-preview-container"
                >
                    <!-- <AssetPreview :selected-asset="selectedAsset"></AssetPreview> -->
                </div>
            </div>
        </pane>
    </splitpanes>
</template>

<script lang="ts">
    import { computed, defineComponent, ref, watch } from 'vue'
    import { useHead } from '@vueuse/head'
    import { useRoute, useRouter } from 'vue-router'
    // import { useRoute, useRouter } from 'vue-router'
    // import useBusinessMetadata from '@/governance/custom-metadata/composables/useBusinessMetadata'
    import GlossaryDiscovery from '@/glossary/index.vue'

    // composables
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import useGlossaryData from '~/composables/glossary2/useGlossaryData'

    export default defineComponent({
        components: {
            GlossaryDiscovery,
        },
        setup(props, { emit }) {
            useHead({
                title: 'Glossary',
            })
            const route = useRoute()
            const isItem = computed(() => !!route.params.id)

            const { selectedGlossary } = useGlossaryData()
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
