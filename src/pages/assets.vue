<template>
    <div class="flex w-full h-full">
        <div class="w-3/4 item-stretch" v-show="!isItem">
            <div class="flex w-full h-full">
                <AssetDiscovery
                    :initialFilters="initialFilters"
                    @preview="handlePreview"
                ></AssetDiscovery>
            </div>
        </div>
        <div class="w-3/4 item-stretch" v-show="isItem">
            <div class="flex w-full h-full">
                <router-view></router-view>
            </div>
        </div>
        <div
            class="flex flex-col w-1/4 h-full bg-white border-l"
            style="overflow: hidden"
        >
            <AssetPreview :item="selected" v-if="selected?.guid"></AssetPreview>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, watch, computed } from 'vue'
    import AssetDiscovery from '@/discovery/asset/index.vue'
    import AssetPreview from '@/preview/asset/index.vue'
    import { useHead } from '@vueuse/head'
    import { Classification } from '~/api/atlas/classification'
    import { useClassificationStore } from '~/components/admin/classifications/_store'
    import { getDecodedOptionsFromString } from '~/utils/routerQuery'
    import { useRoute, useRouter } from 'vue-router'

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

            const id = computed(() => {
                return route.params.id
            })
            const isItem = computed(() => {
                if (route.params.id) {
                    return true
                }
                return false
            })
            // onMounted(() => {
            //   const id = route.params.id;
            // });

            const initialFilters: initialFiltersType = getDecodedOptionsFromString(
                router
            )
            let selected = ref({})
            useHead({
                title: 'Discover assets',
            })
            const handlePreview = (selectedItem: any) => {
                selected.value = selectedItem
                console.log(selected.value, 'selected')
            }

            /* Making the network request here to fetch the latest changes of classifications. 
            So that everytime user visit the discover page it will be in sync to latest data not with store
            */
            const classificationsStore = useClassificationStore()
            classificationsStore.setClassificationsStatus('loading')
            const {
                data: classificationData,
                error: classificationError,
            } = Classification.getClassificationList({ cache: false })

            watch([classificationData, classificationError], () => {
                if (classificationData.value) {
                    let classifications =
                        classificationData.value.classificationDefs || []
                    classifications = classifications.map(classification => {
                        classification.alias = classification.name
                        return classification
                    })
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

<route lang="yaml">
meta:
  layout: default
  requiresAuth: true
  middleware: [routePrint]
</route>
