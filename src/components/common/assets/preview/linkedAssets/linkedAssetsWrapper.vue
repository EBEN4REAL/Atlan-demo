<template>
    <div class="flex flex-col h-full">
        <div class="flex items-center justify-between px-5 py-4">
            <span class="font-semibold text-gray-500">Linked Assets</span>
        </div>
        <div class="px-4 h-full">
            <AssetList
                class="flex-grow bg-white"
                :filters="tabFilter"
                :open-asset-profile-in-new-tab="true"
                :searchBarSize="'default'"
            />
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, toRefs, computed, ref } from 'vue'
    import LinkedAssets from '@/common/assets/profile/tabs/linkedAssets/index.vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import AssetList from '@/common/assetList/assetList.vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'

    export default defineComponent({
        name: 'LinkedAssetsPreviewWrapper',
        components: {
            LinkedAssets,
            AssetList,
        },
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: false,
                default: () => {},
            },
        },
        setup(props) {
            const { selectedAsset } = toRefs(props)
            const { qualifiedName } = useAssetInfo()
            const tabFilter = ref({
                terms: {
                    terms: [
                        {
                            qualifiedName: qualifiedName(selectedAsset.value),
                        },
                    ],
                },
            })
            return {
                tabFilter,
                selectedAsset,
            }
        },
    })
</script>

<style></style>
