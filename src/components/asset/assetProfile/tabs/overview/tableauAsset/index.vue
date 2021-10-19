<template>
    <div class="flex flex-col pl-10 mt-8 gap-y-10">
        <!-- Announcements -->
        <div>
            <Announcements :asset="assetData" class="pr-6" />
        </div>

        <!-- Tableaue Asset Summary -->
        <TableauAssetSummary class="border-b" :selected-asset="assetData" />
        <!-- Readme widget -->
        <div class="pb-6 border-b">
            <Readme
                class="w-full pr-6 border-0"
                :show-borders="false"
                :show-padding-x="false"
                :parent-asset-id="assetData"
                :entity="assetData"
            />
        </div>
        <div class="pb-6 pr-6">
            <Resources :asset="assetData" />
        </div>
        <!-- Overview Image Preview -->
        <div v-if="imageId" class="mb-10">
            <h2 class="mb-6 text-xl text-gray">Preview</h2>
            <overview-image-preview :selected-asset="assetData" class="pr-6" />
        </div>

        <!-- Overview Relations -->
        <!-- <div class="mb-16">
            <h2 class="mb-6 text-xl text-gray">Relations</h2>
            <overview-relations class="pr-6"/>
        </div> -->
    </div>
</template>

<script lang="ts">
    // Vue
    import { defineComponent, inject, computed, ref, onMounted } from 'vue'

    // Components
    import TableauAssetSummary from '@/asset/assetProfile/tabs/overview/tableauAsset/tableauAssetSummary.vue'
    import Readme from '@/common/readme/index.vue'

    import overviewImagePreview from '~/components/asset/assetProfile/tabs/overview/tableauAsset/overviewImagePreview.vue'
    import Announcements from '@/asset/assetProfile/widgets/announcements/announcements.vue'
    import Resources from '@/asset/assetProfile/widgets/resources/resources.vue'
    // Composables
    import useAssetInfo from '~/composables/asset/useAssetInfo'

    import { getAPIPath } from '~/api'

    export default defineComponent({
        components: {
            overviewImagePreview,
            Readme,
            TableauAssetSummary,
            Announcements,
            Resources,
        },
        setup() {
            /** INJECTIONS */
            const assetDataInjection = inject('assetData')

            /** COMPUTED */
            const assetData = computed(() => assetDataInjection?.asset)
            const imagePreview = ref<string>('')
            const imageId = ref()

            const { previewURL } = useAssetInfo()
            const fetch = () => {
                imageId.value = previewURL(assetData.value)

                imagePreview.value = `/api${getAPIPath('/auth', imageId.value)}`
            }
            onMounted(() => {
                fetch()
            })

            return { assetData, imagePreview, imageId }
        },
    })
</script>
