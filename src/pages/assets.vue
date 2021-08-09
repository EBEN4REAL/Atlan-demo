<template>
    <div class="flex w-full h-full">
        <div v-show="!isItem" class="w-3/4 item-stretch">
            <div class="flex w-full h-full">
                <AssetDiscovery
                    :initial-filters="initialFilters"
                    @preview="handlePreview"
                ></AssetDiscovery>
            </div>
        </div>
        <div v-show="isItem" class="w-3/4 item-stretch">
            <div class="flex w-full h-full">
                <router-view @updateAssetPreview="handlePreview"></router-view>
            </div>
        </div>
        <div
            class="flex flex-col h-full bg-white border-l  asset-preview-container"
            style="overflow: hidden"
        >
            <AssetPreview
                v-if="selected"
                :selectedAsset="selected"
            ></AssetPreview>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, watch, computed, Ref } from 'vue'
    import AssetDiscovery from '@/discovery/asset/index.vue'
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
            const router = useRouter()
            const route = useRoute()

            const id = computed(() => route.params.id)
            const isItem = computed(() => {
                if (route.params.id) {
                    return true
                }
                return false
            })
            // onMounted(() => {
            //   const id = route.params.id;
            // });

            const initialFilters: initialFiltersType =
                getDecodedOptionsFromString(router)

            const selected: Ref<assetInterface | undefined> = ref(undefined)

            useHead({
                title: 'Discover assets',
            })
            const handlePreview = (selectedItem: assetInterface) => {
                selected.value = selectedItem
            }

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
                id,
                isItem,
            }
        },
    })
</script>
<style lang="less" scoped>
    .asset-preview-container {
        width: 30%;
    }
</style>
<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
    middleware: [routePrint]
</route>
