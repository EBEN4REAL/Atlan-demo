<template>
    <AssetList
        class="bg-white"
        :filters="tabFilter"
        :static-use="true"
        :class="$style.glossaryTermsTab"
        :enableSidebarDrawer="true"
        customPlaceholder="Search terms & categories"
        aggregation-tab-class="px-5 my-1"
        search-bar-class="px-5 my-1"
        asset-item-class="px-2"
    />
</template>

<script lang="ts">
    import { defineComponent, PropType, computed, toRefs } from 'vue'

    import { assetInterface } from '~/types/assets/asset.interface'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import AssetList from '@/common/assetList/assetList.vue'

    export default defineComponent({
        name: 'TermsAndCategoriesTab',
        components: { AssetList },
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        setup(props) {
            const { qualifiedName, assetType } = useAssetInfo()
            const { selectedAsset } = toRefs(props)
            const tabFilter = computed(() => {
                if (
                    assetType(selectedAsset.value) === 'AtlasGlossaryCategory'
                ) {
                    return {
                        parentCategory: qualifiedName(selectedAsset.value),
                    }
                }
                return { glossary: qualifiedName(selectedAsset.value) }
            })

            return { tabFilter }
        },
    })
</script>

<style lang="less" module>
    .glossaryTermsTab {
        :global(.ant-tabs-tab:first-child) {
            @apply ml-0 !important;
        }
    }
</style>
