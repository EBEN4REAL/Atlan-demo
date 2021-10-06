<template>
    <div class="flex w-full h-full bg-white">
        <div class="flex-1 border-r border-gray-300 item-stretch">
            <div class="flex h-full">
                <KeepAlive>
                    <component
                        :is="whichComponent.main"
                        ref="workflowDiscovery"
                        :selected-run-id="selectedRunId"
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
            <component
                :is="whichComponent.preview"
                v-if="selected"
                :selected-workflow="selected"
            ></component>
        </div>
    </div>
</template>

<script lang="ts">
    import { useHead } from '@vueuse/head'
    import { useRoute, useRouter } from 'vue-router'
    import {
        computed,
        defineComponent,
        defineAsyncComponent,
        ref,
        Ref,
    } from 'vue'
    import WorkflowDiscovery from '~/components/workflows/discovery/workflowDiscovery.vue'
    import Setup from '@/workflows/setup/index.vue'
    // TODO change to workflowInterfalce
    import { assetInterface } from '~/types/assets/asset.interface'
    import { decodeQuery } from '~/utils/helper/routerHelper'
    import AtlanBtn from '~/components/UI/button.vue'

    export interface initialFiltersType {
        facetsFilters: any
        searchText: string
        limit: number
    }
    export default defineComponent({
        components: {
            WorkflowDiscovery,
            AtlanBtn,
            Setup,
            discoveryPreview: defineAsyncComponent(
                () => import('@/workflows/discovery/preview/preview.vue')
            ),
            profilePreview: defineAsyncComponent(
                () => import('@/workflows/profile/preview/preview.vue')
            ),
            setupPreview: defineAsyncComponent(
                () => import('@/workflows/setup/preview/preview.vue')
            ),
        },
        setup() {
            useHead({
                title: 'Discover assets',
            })
            const router = useRouter()
            const route = useRoute()
            const isItem = computed(() => route.params.id)
            const whichComponent = computed(() => {
                if (route.params.id === 'new')
                    return {
                        main: 'Setup',
                        preview: 'setupPreview',
                    }
                if (route.params.id)
                    return {
                        main: 'router-view',
                        preview: 'profilePreview',
                    }
                return {
                    main: 'WorkflowDiscovery',
                    preview: 'discoveryPreview',
                }
            })
            const updateProfile = ref<boolean>(false)
            const selectedRunId = ref('')

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
            const page = computed(() => {
                if (isItem.value === 'new') return 'setup'
                return isItem.value ? 'profile' : 'discovery'
            })

            // !KILL this
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
                updateProfile,
                propagateToAssetList,
                workflowDiscovery,
                selectedRunId,
                whichComponent,
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
