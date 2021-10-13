<template>
    <component
        :is="whichComponent.main"
        v-if="whichComponent.main === 'form'"
    ></component>
    <div v-else class="flex w-full h-full bg-white">
        <div class="flex-1 border-r border-gray-300 item-stretch">
            <div class="flex h-full">
                <component
                    :is="whichComponent.main"
                    :selected-run-id="selectedRunId"
                    :initial-filters="initialFilters"
                ></component>
            </div>
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
    // import { assetInterface } from '~/types/assets/asset.interface'
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

            const whichComponent = computed(() => {
                if (route.params.id === 'form')
                    return {
                        main: 'form',
                    }
                if (route.params.id === 'new')
                    return {
                        main: 'Setup',
                    }
                if (route.params.id)
                    return {
                        main: 'router-view',
                    }
                return {
                    main: 'WorkflowDiscovery',
                }
            })
            const selectedRunId = ref('')

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

            return {
                initialFilters,
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
