<template>
    <div class="pl-12 pr-5 mt-8">
        <!-- Readme widget -->
        <div class="pb-6">
            <Readme
                class="w-full border-0"
                :show-borders="false"
                :show-padding-x="false"
                :parent-asset-id="assetData"
            />
        </div>
        <!-- Overview Image Preview -->

        <div v-if="imagePreview" class="mb-16">
            <h2 class="mb-6 text-xl text-gray">Preview</h2>
            <overview-image-preview :image-preview="imagePreview" />
        </div>

        <!-- Overview Relations -->
        <div class="mb-16">
            <h2 class="mb-6 text-xl text-gray">Relations</h2>
            <overview-relations />
        </div>
    </div>
</template>

<script lang="ts">
    // Vue
    import { defineComponent, inject, computed, ref } from 'vue'

    // Components
    import Readme from '@/common/readme/index.vue'
    import overviewRelations from '~/components/asset/assetProfile/tabs/overview/tableauAsset/overviewRelations.vue'
    import overviewImagePreview from '~/components/asset/assetProfile/tabs/overview/tableauAsset/overviewImagePreview.vue'

    // Composables
    import useAssetInfo from '~/composables/asset/useAssetInfo'

    export default defineComponent({
        components: { overviewRelations, overviewImagePreview, Readme },
        setup() {
            /** INJECTIONS */
            const assetDataInjection = inject('assetData')

            /** COMPUTED */
            const assetData = computed(() => assetDataInjection?.asset)
            const imagePreview = ref<string>('')

            const { previewURL } = useAssetInfo()
            imagePreview.value = previewURL(assetData.value)

            return { assetData, imagePreview }
        },
    })
</script>
