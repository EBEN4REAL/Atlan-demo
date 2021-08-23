<template>
    <div class="flex w-full h-full">
        <div class="flex-1 item-stretch">
            <div class="flex flex-1 h-full">
                <router-view
                    v-if="isItem"
                    @updateAssetPreview="handlePreview"
                    @preview="handlePreview"
                ></router-view>
                <AssetDiscovery
                    v-else
                    :initial-filters="initialFilters"
                    @preview="handlePreview"
                ></AssetDiscovery>
            </div>
        </div>
        <div
            class="z-20 flex flex-col h-full bg-white border-l  asset-preview-container"
        >
            <AssetPreview
                v-if="selected"
                :selectedAsset="selected"
                :page="page"
            ></AssetPreview>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, watch, computed, Ref } from 'vue'
    import AssetDiscovery from '@/discovery/index.vue'
    import AssetPreview from '@/preview/asset/v2/index.vue'
    import { useHead } from '@vueuse/head'
    import { useRoute, useRouter } from 'vue-router'
    import { Classification } from '~/api/atlas/classification'
    import { useClassificationStore } from '~/components/admin/classifications/_store'
    import { getDecodedOptionsFromString } from '~/utils/routerQuery'

    import { typedefsInterface } from '~/types/typedefs/typedefs.interface'
    import { assetInterface } from '~/types/assets/asset.interface'

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

            const initialFilters: initialFiltersType =
                getDecodedOptionsFromString(router)
            const selected: Ref<assetInterface | undefined> = ref(undefined)
            const handlePreview = (selectedItem: assetInterface) => {
                selected.value = selectedItem
            }
            const page = computed(() =>
                isItem.value ? 'profile' : 'discovery'
            )

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

            return {
                initialFilters,
                selected,
                handlePreview,
                isItem,
                page,
            }
        },
    })
</script>
<style scoped>
    .asset-preview-container {
        width: 420px;
        /* min-width: 420px; */
    }
</style>
<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
    middleware: [routePrint]
</route>
