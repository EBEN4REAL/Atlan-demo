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
            v-if="page === 'discovery' && store.isBulkMode"
            class="relative overflow-y-auto bg-white asset-preview-container"
        >
            <BulkSidebar
                :bulk-selected-assets="store.bulkSelectedAssets"
                @closeBulkMode="handleCloseBulk"
            ></BulkSidebar>
        </div>
        <div
            v-else
            id="overAssetPreviewSidebar"
            class="relative bg-white asset-preview-container"
        >
            <AssetPreview
                v-if="selected"
                :selected-asset="selected"
                :page="page"
                @asset-mutation="propagateToAssetList"
            ></AssetPreview>
        </div>
        <BulkNotification class="fixed bottom-0 right-0" />
    </div>
</template>

<script lang="ts">
    import { useHead } from '@vueuse/head'
    import { computed, defineComponent, ref, Ref, watch, nextTick } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import useBusinessMetadata from '@/admin/custom-metadata/composables/useBusinessMetadata'
    import AssetDiscovery from '~/components/discovery/assetDiscovery.vue'
    import AssetPreview from '@/discovery/preview/assetPreview.vue'
    import BulkSidebar from '@/common/bulk/bulkSidebar.vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    // import { getDecodedOptionsFromString } from '~/utils/helper/routerQuery'
    import { decodeQuery } from '~/utils/helper/routerHelper'
    import { useClassifications } from '~/components/admin/classifications/composables/useClassifications'
    import useBulkUpdateStore from '~/store/bulkUpdate'
    import BulkNotification from '~/components/common/bulk/bulkNotification.vue'
    import useDiscoveryStore from '~/store/discovery'
    import { storeToRefs } from 'pinia'

    export interface initialFiltersType {
        facetsFilters: any
        searchText: string
        limit: number
    }
    export default defineComponent({
        components: {
            AssetPreview,
            AssetDiscovery,
            BulkSidebar,
            BulkNotification,
        },
        setup() {
            
            useHead({
                title: 'Assets',
            })
            const storeDiscovery = useDiscoveryStore()
            const { selectedAsset } = storeToRefs(storeDiscovery)
            const router = useRouter()
            const route = useRoute()
            const isItem = computed(() => route.params.id)
            const updateProfile = ref<boolean>(false)
            // const lastUpdatedItem = ref(false)
            const assetDiscovery: Ref<Element | null> = ref(null)
            // const initialFilters: initialFiltersType =
            //     getDecodedOptionsFromString(router)

            router.currentRoute.value?.query
            // const selected: Ref<assetInterface | undefined> = ref(undefined)
            // const handlePreview = (selectedItem: assetInterface) => {
            //     selected.value = selectedItem
            //     lastUpdatedItem.value = selectedItem

            // }
            const page = computed(() =>
                isItem.value ? 'profile' : 'discovery'
            )
            watch(isItem, (newData) => {
              if(!newData){
                nextTick(() => {
                  assetDiscovery.value.mutateAssetInList(selectedAsset.value)
                })
                // setTimeout(() => {
                // }, 300);
              }
            })
            // * Get all available BMs and save on store
            const { fetchBMonStore } = useBusinessMetadata()
            fetchBMonStore()

            /* Making the network request here to fetch the latest changes of classifications. 
            So that everytime user visit the discover page it will be in sync to latest data not with store
            */
            const {
                isClassificationInitializedInStore,
                initializeClassificationsInStore,
            } = useClassifications()
            if (!isClassificationInitializedInStore()) {
                initializeClassificationsInStore()
            }
            function propagateToAssetList(updatedAsset: assetInterface) {
                if (page.value === 'discovery')
                    assetDiscovery.value.mutateAssetInList(updatedAsset)
                storeDiscovery.setSelectedAsset(updatedAsset)
                updateProfile.value = true
            }
            const store = useBulkUpdateStore()
            const handleCloseBulk = () => {
                store.setBulkSelectedAssets([])
                store.setBulkMode(false)
            }
            return {
                selected: selectedAsset,
                isItem,
                page,
                propagateToAssetList,
                assetDiscovery,
                handleCloseBulk,
                store,
            }
        },
    })
</script>
<style scoped>
    .asset-preview-container {
        width: 420px !important;
        min-width: 420px !important;
        max-width: 420px !important;
    }
</style>
<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
    middleware: [routePrint]
</route>
