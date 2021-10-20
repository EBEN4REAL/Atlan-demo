<template>
    <div class="flex w-full h-full">
        <div
            class="flex flex-col h-full overflow-y-auto bg-gray-100 border-r border-gray-300 facets"
        >
            <WorkflowFilters
                :ref="
                    (el) => {
                        workflowFilterRef = el
                    }
                "
                :initial-filters="AllFilters"
                :filters-list="defaultfiltersList"
                @refresh="handleFilterChange"
                @initialize="handleFilterInit"
            ></WorkflowFilters>
        </div>

        <div class="flex flex-col items-stretch flex-1 mb-1 w-80">
            <div class="flex flex-col h-full">
                <div class="flex px-3 py-2 bg-white">
                    <div class="flex-auto">
                        <SearchAndFilter
                            v-model:value="queryText"
                            :placeholder="dynamicSearchPlaceholder"
                            :autofocus="true"
                            @change="handleSearchChange"
                        >
                            <template #filter>
                                <Preferences @sort="handleChangeSort" />
                            </template>
                            <!-- <template #buttonAggregation>
                        <span>({{ projection.length }})</span>
                    </template> -->
                        </SearchAndFilter>
                    </div>
                    <AtlanBtn
                        class="ml-2"
                        color="secondary"
                        padding="compact"
                        @click="$router.push(`/workflows/new`)"
                    >
                        <div class="flex items-center gap-2">
                            <AtlanIcon icon="Add" class="" />
                            <div>New Workflow</div>
                        </div>
                    </AtlanBtn>
                </div>

                <div
                    v-if="
                        workflowList && workflowList.length <= 0 && !isLoading
                    "
                    class="flex flex-col items-center mt-10"
                >
                    <img
                        :src="emptyScreen"
                        alt="No Workflows"
                        class="w-2/5 m-auto mb-4"
                    />
                    <span class="text-gray-500">No Workflow found</span>
                    <a-button @click="handleClearFiltersFromList"
                        >Clear filters</a-button
                    >
                </div>
                <WorkflowList
                    v-else
                    v-model:autoSelect="autoSelect"
                    class="pt-2 bg-white"
                    :list="workflowList"
                    :is-loading="isLoading"
                    :is-load-more="isLoadMore"
                    @preview="handlePreview"
                    @loadMore="loadMore"
                ></WorkflowList>
            </div>
        </div>
        <div class="border-l border-gray-300 preview-container">
            <DiscoveryPreview v-if="selected" :selected-workflow="selected" />
        </div>
    </div>
</template>

<script lang="ts">
    import EmptyView from '@common/empty/discover.vue'

    import { useDebounceFn } from '@vueuse/core'
    import { computed, defineComponent, ref, toRefs, Ref } from 'vue'
    import { useRouter } from 'vue-router'
    import emptyScreen from '~/assets/images/empty_search.png'
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'
    import Preferences from '@/workflows/discovery/list/preference.vue'
    import WorkflowList from '@/workflows/discovery/list/workflowList.vue'
    import WorkflowFilters from '@/workflows/discovery/filters/workflowFilters.vue'

    import { serializeQuery, decodeQuery } from '~/utils/helper/routerHelper'

    import useFilterUtils from '@/workflows/discovery/filters/useFilterUtils'
    import { transformToFilters } from '~/components/workflows/discovery/filters/useFilterTransform'

    import { useWorkflowSearchList } from '~/composables/workflow/useWorkFlowList'
    import AtlanBtn from '~/components/UI/button.vue'
    import DiscoveryPreview from '@/workflows/discovery/preview/preview.vue'

    import { List as defaultfiltersList } from '@/workflows/discovery/filters/filters'

    export default defineComponent({
        name: 'WorkflowDiscovery',
        components: {
            WorkflowFilters,
            WorkflowList,
            DiscoveryPreview,
            AtlanBtn,
            SearchAndFilter,
            Preferences,
        },
        emits: ['preview'],
        setup(props, { emit }) {
            // FIXME FIX FILTERS
            const router = useRouter()

            const initialFilters: Record<string, any> = ref({
                facetsFilters: {},
                searchText: '',
                sortOrder: 'default',
                ...decodeQuery(
                    Object.keys(router.currentRoute.value?.query)[0]
                ),
            })

            // workflow filter component ref
            const workflowFilterRef = ref()
            const autoSelect = ref(true)
            const isAggregate = ref(true)

            // Clean Stuff
            const AllFilters: Ref = ref({ ...initialFilters.value })

            const queryText = computed({
                get: () => AllFilters.value.searchText,
                set: (val) => {
                    AllFilters.value.searchText = val
                },
            })

            // This is the actual filter body
            // FIXME Can we make it a computed property?
            const filters = ref([])
            const offset = ref(0)
            const sortOrder = ref('default')
            const facets = computed(() => AllFilters.value?.facetsFilters)

            const { generateFacetConfigForRouter } = useFilterUtils(facets)
            const selected = ref(null)
            const {
                workflowList,
                isLoading,
                filterList,
                totalCount,
                loadMore,
                mutate,
                filter_record,
            } = useWorkflowSearchList(false)

            // if (!workflowList.value.length) mutate()

            const isLoadMore = computed(
                () => filter_record.value > workflowList.value.length
            )

            const placeholderLabel: Ref<Record<string, string>> = ref({})
            const dynamicSearchPlaceholder = computed(() => {
                let placeholder = 'Search for Workflows'
                if (placeholderLabel.value.asset) {
                    placeholder += ` in ${placeholderLabel.value.asset}`
                } else if (placeholderLabel.value.connector) {
                    placeholder += ` in ${placeholderLabel.value.connector}`
                }
                return placeholder
            })

            // FIXME
            const setRouterOptions = () => {
                const routerOptions: Record<string, any> = {
                    facetsFilters: generateFacetConfigForRouter(),
                }
                if (queryText.value) routerOptions.searchText = queryText.value
                if (sortOrder.value !== 'default')
                    routerOptions.sortOrder = sortOrder.value

                const routerQuery = serializeQuery(routerOptions)
                router.push(`/workflows?${routerQuery}`)
            }

            const shootQuery = () => {
                // console.log(filters.value)
                console.log({ ...AllFilters.value.facetsFilters })

                filterList(transformToFilters(AllFilters.value))
            }
            if (!workflowList.value.length) shootQuery()

            const handleSearchChange = useDebounceFn(() => {
                // TODO use pagination and recall api
                setRouterOptions()
                shootQuery()
            }, 600)

            const handleChangeSort = (payload: any) => {
                console.log(payload)
                AllFilters.value.sortOrder = payload
                isAggregate.value = true
                shootQuery()
            }

            const handleFilterChange = (
                payload: any,
                filterMapData: Record<string, Components.Schemas.FilterCriteria>
            ) => {
                // console.log(payload, filterMapData)
                AllFilters.value.facetsFilters = filterMapData
                filters.value = payload
                offset.value = 0
                isAggregate.value = true
                shootQuery()
                setRouterOptions()
            }

            const handleFilterInit = (payload: any) => {
                filters.value = payload
            }

            const handlePreview = (item) => {
                selected.value = item
            }

            const handleClearFiltersFromList = () => {
                queryText.value = ''
                workflowFilterRef.value?.resetAllFilters()
            }

            return {
                handleClearFiltersFromList,
                autoSelect,
                workflowFilterRef,
                selected,
                AllFilters,
                workflowList,
                isLoadMore,
                loadMore,
                emptyScreen,
                handleSearchChange,
                handlePreview,
                queryText,
                isLoading,
                dynamicSearchPlaceholder,
                placeholderLabel,
                filters,
                handleFilterChange,
                handleFilterInit,
                handleChangeSort,
                defaultfiltersList,
            }
        },
        data() {
            return {
                activeKey: '',
                debounce: null,
            }
        },
    })
</script>

<style scoped>
    .facets {
        min-width: 264px;
        width: 20%;
    }

    .preview-container {
        width: 420px !important;
        min-width: 420px !important;
        max-width: 420px !important;
    }
</style>
