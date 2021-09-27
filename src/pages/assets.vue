<template>
    <div class="flex w-full h-full bg-white">
        <div
            class="flex-1 border-r border-gray-300 item-stretch"
            style="max-width: calc(100vw - 420px)"
        >
            <div class="flex h-full">
                <router-view
                    v-if="isItem"
                    :updateProfile="updateProfile"
                    @updateAssetPreview="handlePreview"
                    @preview="handlePreview"
                ></router-view>
                <AssetDiscovery
                    v-else
                    :initial-filters="initialFilters"
                    @preview="handlePreview"
                    ref="assetDiscovery"
                ></AssetDiscovery>
            </div>
        </div>

        <div class="z-20 flex flex-col bg-white asset-preview-container">
            <AssetPreview
                v-if="selected"
                :selectedAsset="selected"
                @asset-mutation="propagateToAssetList"
                :page="page"
            ></AssetPreview>
        </div>

        <div id="overAssetPreviewSidebar"></div>
    </div>
</template>

<script lang="ts">
    import useBusinessMetadata from '@/admin/custom-metadata/composables/useBusinessMetadata'
    import AssetDiscovery from '~/components/discovery/assetDiscovery.vue'
    import AssetPreview from '@/discovery/preview/assetPreview.vue'
    import { useHead } from '@vueuse/head'
    import { computed, defineComponent, ref, Ref, watch } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import { Classification } from '~/api/atlas/classification'
    import { useClassificationStore } from '~/components/admin/classifications/_store'
    import { assetInterface } from '~/types/assets/asset.interface'
    import { typedefsInterface } from '~/types/typedefs/typedefs.interface'
    import { getDecodedOptionsFromString } from '~/utils/helper/routerQuery'

    export interface initialFiltersType {
        facetsFilters: any
        searchText: string
        limit: number
    }
    export default defineComponent({
        components: {
            AssetPreview,
            AssetDiscovery,
        },
        setup() {
            useHead({
                title: 'Discover assets',
            })
            const router = useRouter()
            const route = useRoute()
            const isItem = computed(() => route.params.id)
            const updateProfile = ref<boolean>(false)

            const assetDiscovery: Ref<Element | null> = ref(null)
            const initialFilters: initialFiltersType =
                getDecodedOptionsFromString(router)
            const selected: Ref<assetInterface | undefined> = ref(undefined)
            const handlePreview = (selectedItem: assetInterface) => {
                selected.value = selectedItem
                console.log(selectedItem)
            }
            const page = computed(() =>
                isItem.value ? 'profile' : 'discovery'
            )

            // * Get all available BMs and save on store
            const { fetchBMonStore } = useBusinessMetadata()
            fetchBMonStore()

            /* Making the network request here to fetch the latest changes of classifications. 
            So that everytime user visit the discover page it will be in sync to latest data not with store
            */
            const classificationsStore = useClassificationStore()
            classificationsStore.setClassificationsStatus('loading')
            const { data: classificationData, error: classificationError } =
                Classification.getClassificationList<typedefsInterface>({
                    cache: false,
                })

            watch([classificationData, classificationError], () => {
                if (classificationData.value) {
                    const classifications =
                        classificationData.value.classificationDefs || []

                    classificationsStore.setClassifications(
                        classifications ?? []
                    )
                    classificationsStore.initializeFilterTree()
                    classificationsStore.setClassificationsStatus('success')
                } else {
                    classificationsStore.setClassificationsStatus('error')
                }
            })

            function propagateToAssetList(updatedAsset: assetInterface) {
                if (assetDiscovery.value)
                    assetDiscovery.value.mutateAssetInList(updatedAsset)
                handlePreview(updatedAsset)
                updateProfile.value = true
            }

            return {
                initialFilters,
                selected,
                handlePreview,
                isItem,
                page,
                propagateToAssetList,
                assetDiscovery,
            }
        },
    })
</script>
<style scoped>
    .asset-preview-container {
        width: 420px !important;
        min-width: 420px !important;
        max-width: 420px !important;
        position: absolute;
        right: 0;
    }
</style>
<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
    middleware: [routePrint]
</route>
