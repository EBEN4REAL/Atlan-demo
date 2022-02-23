<template>
    <div class="flex flex-col h-full">
        <div
            class="flex items-center justify-between px-5 py-2 border-b border-gray-200 bg-gray-50"
        >
            <span class="flex items-center">
                <PreviewTabsIcon
                    :icon="tab.icon"
                    :image="tab.image"
                    :emoji="tab.emoji"
                    height="h-4"
                    :display-mode="true"
                    class="mb-0.5"
                />
                <span class="ml-1 font-semibold text-gray-500"
                    >Linked Assets</span
                >
            </span>
        </div>

        <div class="h-full px-4">
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
    import PreviewTabsIcon from '~/components/common/icon/previewTabsIcon.vue'

    export default defineComponent({
        name: 'LinkedAssetsPreviewWrapper',
        components: {
            LinkedAssets,
            AssetList,
            PreviewTabsIcon,
        },
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: false,
                default: () => {},
            },
            tab: {
                type: Object,
                required: false,
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
