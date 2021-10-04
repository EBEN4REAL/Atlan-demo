<template>
    <div class="flex w-full h-full bg-white">
        <div class="flex-1 border-r border-gray-300 item-stretch">
            <div class="flex h-full">
                <KeepAlive>
                    <component
                        :is="isItem ? 'router-view' : 'WorkflowDiscovery'"
                        ref="workflowDiscovery"
                        :initial-filters="initialFilters"
                        :update-profile="updateProfile"
                        @preview="handlePreview"
                    ></component>
                </KeepAlive>
            </div>
        </div>
        <div
            id="overAssetPreviewSidebar"
            class="relative bg-white asset-preview-container"
        >
            <WorkflowPreview
                v-if="selected"
                :selected-asset="selected"
                :page="page"
                @asset-mutation="propagateToAssetList"
            ></WorkflowPreview>
        </div>
    </div>
</template>

<script lang="ts">
    import { useHead } from '@vueuse/head'
    import { useRoute, useRouter } from 'vue-router'
    import { computed, defineComponent, ref, Ref } from 'vue'
    import WorkflowDiscovery from '~/components/workflows/discovery/workflowDiscovery.vue'
    import WorkflowPreview from '~/components/workflows/shared/preview/workflowPreview.vue'
    // TODO change to workflowInterfalce
    import { assetInterface } from '~/types/assets/asset.interface'
    import { decodeQuery } from '~/utils/helper/routerHelper'

    export interface initialFiltersType {
        facetsFilters: any
        searchText: string
        limit: number
    }
    export default defineComponent({
        components: {
            WorkflowPreview,
            WorkflowDiscovery,
        },
        setup() {
            useHead({
                title: 'Discover assets',
            })
            const router = useRouter()
            const route = useRoute()
            const isItem = computed(() => route.params.id)
            const updateProfile = ref<boolean>(false)

            const workflowDiscovery: Ref<Element | null> = ref(null)
            // TODO fix initialFilters set , apply , etc
            // const initialFilters: initialFiltersType =
            //     getDecodedOptionsFromString(router)

            const initialFilters: Record<string, any> = {
                facetsFilters: {},
                searchText: '',
                selectedTab: 'Catalog',
                sortOrder: 'default',
                state: 'active',
                ...decodeQuery(
                    Object.keys(router.currentRoute.value?.query)[0]
                ),
            }

            const selected: Ref<assetInterface | undefined> = ref(undefined)
            const handlePreview = (selectedItem: assetInterface) => {
                selected.value = selectedItem
                console.log(selectedItem)
            }
            const page = computed(() =>
                isItem.value ? 'profile' : 'discovery'
            )

            function propagateToAssetList(updatedAsset: assetInterface) {
                if (page.value === 'discovery')
                    workflowDiscovery.value.mutateAssetInList(updatedAsset)
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
                workflowDiscovery,
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
