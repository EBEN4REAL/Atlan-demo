<template>
    <div class="flex w-full h-full bg-white">
        <div class="flex-1 border-r border-gray-300 item-stretch">
            <div class="flex h-full">
                <KeepAlive>
                    <component
                        :is="isItem ? 'router-view' : 'AssetDiscovery'"
                        ref="assetDiscovery"
                    />
                </KeepAlive>
            </div>
        </div>

        <div
            id="overAssetPreviewSidebar"
            class="relative bg-white asset-preview-container"
        >
            <AssetPreview :selected-asset="selectedAsset"></AssetPreview>
        </div>
        <!-- <BulkNotification class="fixed bottom-0 right-0" /> -->
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, ref, Ref, watch, nextTick } from 'vue'
    import { useHead } from '@vueuse/head'
    import { useRoute } from 'vue-router'
    // import { useRoute, useRouter } from 'vue-router'
    // import useBusinessMetadata from '@/admin/custom-metadata/composables/useBusinessMetadata'
    import AssetDiscovery from '@/assets/index.vue'
    import AssetPreview from '@/assets/preview/index.vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'

    // import BulkSidebar from '@/common/bulk/bulkSidebar.vue'
    // import { assetInterface } from '~/types/assets/asset.interface'

    // import { useClassifications } from '~/components/admin/classifications/composables/useClassifications'
    // import useBulkUpdateStore from '~/store/bulkUpdate'
    // import BulkNotification from '~/components/common/bulk/bulkNotification.vue'
    // import useDiscoveryStore from '~/store/discovery'
    // import { storeToRefs } from 'pinia'

    // export interface initialFiltersType {
    //     facetsFilters: any
    //     searchText: string
    //     limit: number
    // }
    export default defineComponent({
        components: {
            // AssetPreview,
            AssetDiscovery,
            AssetPreview,
            // BulkSidebar,
            // BulkNotification,
        },
        setup() {
            useHead({
                title: 'Assets',
            })
            // const storeDiscovery = useDiscoveryStore()
            // const { selectedAsset } = storeToRefs(storeDiscovery)
            // const router = useRouter()
            const route = useRoute()
            const isItem = computed(() => route.params.id)

            const { selectedAsset } = useAssetInfo()
            // const updateProfile = ref<boolean>(false)
            // // const lastUpdatedItem = ref(false)
            // const assetDiscovery: Ref<Element | null> = ref(null)
            // // const initialFilters: initialFiltersType =
            // //     getDecodedOptionsFromString(router)

            // router.currentRoute.value?.query
            // // const selected: Ref<assetInterface | undefined> = ref(undefined)
            // // const handlePreview = (selectedItem: assetInterface) => {
            // //     selected.value = selectedItem
            // //     lastUpdatedItem.value = selectedItem

            // // }
            // const page = computed(() =>
            //     isItem.value ? 'profile' : 'discovery'
            // )
            // watch(isItem, (newData) => {
            //     if (!newData) {
            //         nextTick(() => {
            //             assetDiscovery.value.mutateAssetInList(
            //                 selectedAsset.value
            //             )
            //         })
            //         // setTimeout(() => {
            //         // }, 300);
            //     }
            // })
            // // * Get all available BMs and save on store
            // const { fetchBMonStore } = useBusinessMetadata()
            // fetchBMonStore()

            // /* Making the network request here to fetch the latest changes of classifications.
            // So that everytime user visit the discover page it will be in sync to latest data not with store
            // */
            // const {
            //     isClassificationInitializedInStore,
            //     initializeClassificationsInStore,
            // } = useClassifications()
            // if (!isClassificationInitializedInStore()) {
            //     initializeClassificationsInStore()
            // }
            // function propagateToAssetList(updatedAsset: assetInterface) {
            //     if (page.value === 'discovery')
            //         assetDiscovery.value.mutateAssetInList(updatedAsset)
            //     storeDiscovery.setSelectedAsset(updatedAsset)
            //     updateProfile.value = true
            // }
            // const store = useBulkUpdateStore()
            // const handleCloseBulk = () => {
            //     store.setBulkSelectedAssets([])
            //     store.setBulkMode(false)
            // }
            // return {
            //     selected: selectedAsset,
            //     isItem,
            //     page,
            //     propagateToAssetList,
            //     assetDiscovery,
            //     handleCloseBulk,
            //     store,
            // }

            return {
                isItem,
                selectedAsset,
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
