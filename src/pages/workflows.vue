<template>
    <component
        :is="whichComponent.main"
        v-if="whichComponent.main === 'form'"
    ></component>
    <div v-else class="flex w-full h-full bg-white">
        <div class="flex-1 border-r border-gray-300 item-stretch">
            <div class="flex h-full">
                <!-- <KeepAlive> -->
                <component
                    :is="whichComponent.main"
                    :selected-run-id="selectedRunId"
                    :initial-filters="initialFilters"
                    :update-profile="updateProfile"
                    @preview="handlePreview"
                ></component>
                <!-- </KeepAlive> -->
            </div>
        </div>
        <div class="relative bg-white asset-preview-container">
            <component
                :is="whichComponent.preview"
                v-if="selected"
                :selected-workflow="selected"
                :ui-config="uiConfig"
                :selected-dag="selectedDag"
                @change="selectedRunId = $event"
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
        provide,
        watch,
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
            form: defineAsyncComponent(
                () => import('@/workflows/formDemo.vue')
            ),
        },
        setup() {
            useHead({
                title: 'Discover workflows',
            })
            const router = useRouter()
            const route = useRoute()
            const isItem = computed(() => route.params.id)
            const whichComponent = computed(() => {
                if (route.params.id === 'form')
                    return {
                        main: 'form',
                    }
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
            const selected: Ref<assetInterface | undefined> = ref(undefined)
            const uiConfig = ref(null)
            const selectedDag = ref(null)

            const workflowDiscovery: Ref<Element | null> = ref(null)

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

            const handlePreview = (selectedItem: any, is) => {
                console.log({ is })
                if (is === 'config') {
                    uiConfig.value = selectedItem
                } else if (is === 'dag') {
                    selectedDag.value = selectedItem
                } else selected.value = selectedItem
            }
            const page = computed(() => {
                if (isItem.value === 'new') return 'setup'
                return isItem.value ? 'profile' : 'discovery'
            })

            provide('selectedAsset', selected)
            provide('uiConfig', uiConfig)

            return {
                initialFilters,
                selected,
                handlePreview,
                uiConfig,
                isItem,
                page,
                updateProfile,
                workflowDiscovery,
                selectedRunId,
                selectedDag,
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
