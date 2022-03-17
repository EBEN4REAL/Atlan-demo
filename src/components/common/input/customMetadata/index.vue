<template>
    <div class="flex flex-col">
        <p
            class="flex items-center justify-between px-5 mb-1 text-sm text-gray-500"
        >
            Custom Metadata
        </p>
        <div
            v-for="(tab, index) in cmList(assetType(selectedAsset))"
            :key="index"
            class="border border-gray-300 rounded-md"
        >
            <SingleTab
                :selected-asset="selectedAsset"
                :data="tab"
                :is-drawer="isDrawer"
                :tab="{
                    image: tab.options?.imageId || tab.options?.logoUrl,
                    emoji: tab.options?.emoji,
                    name: tab.label,
                    tooltip: tab.label,
                }"
            />
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'

    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import { assetInterface } from '~/types/assets/asset.interface'
    import useCustomMetadataFacet from '~/composables/custommetadata/useCustomMetadataFacet'
    import SingleTab from './singleTab.vue'

    export default defineComponent({
        name: 'CustomMetadata',
        components: { SingleTab },
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
            isDrawer: {
                type: Boolean,
                required: false,
                default: false,
            },
        },
        setup() {
            const { assetType } = useAssetInfo()

            const { getList: cmList } = useCustomMetadataFacet()

            return { cmList, assetType }
        },
    })
</script>
