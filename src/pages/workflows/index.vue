<template>
    <div class="flex w-full h-full">
        <div
            class="flex flex-col h-full overflow-y-auto bg-gray-100 border-r border-gray-300  facets"
        >
            <WorkflowFilters
                :ref="
                    (el) => {
                        workflowFilterRef = el
                    }
                "
                :initial-filters="AllFilters"
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
                                <Preferences
                                    :default-projection="projection"
                                    @change="handleChangePreferences"
                                    @sort="handleChangeSort"
                                    @state="handleState"
                                />
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
                        @click="goToSetup"
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
    import workflowPagination from '@common/pagination/index.vue'

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

    import { useWorkflowSearchList } from '~/composables/workflow/useWorkFlowList'
    import AtlanBtn from '~/components/UI/button.vue'
    import DiscoveryPreview from '@/workflows/discovery/preview/preview.vue'

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
                selectedTab: 'Catalog',
                sortOrder: 'default',
                state: 'active',
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
            const limit = ref(20)
            const offset = ref(0)
            const sortOrder = ref('default')
            const state = ref('active')
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

            if (!workflowList.value.length) mutate()

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

            function setPlaceholder(label: string, type: string) {
                placeholderLabel.value[type] = label
                if (type === 'connector') placeholderLabel.value.asset = ''
            }

            // FIXME
            const setRouterOptions = () => {
                const routerOptions: Record<string, any> = {
                    facetsFilters: generateFacetConfigForRouter(),
                }
                if (queryText.value) routerOptions.searchText = queryText.value
                if (sortOrder.value !== 'default')
                    routerOptions.sortOrder = sortOrder.value
                if (state.value !== 'active') routerOptions.state = state.value

                const routerQuery = serializeQuery(routerOptions)
                router.push(`/workflows?${routerQuery}`)
            }

            const handleSearchChange = useDebounceFn(() => {
                // TODO use pagination and recall api
                setRouterOptions()
                filterList(queryText.value)
            }, 600)

            const updateQuery = () => {
                // console.log(filters.value)
                console.log({ ...AllFilters.value.facetsFilters })
            }

            const handleChangePreferences = (payload: any) => {
                console.log(payload)
                // projection.value = payload
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
                updateQuery()
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

            const goToSetup = () => {
                router.push(`/workflows/new`)
            }

            return {
                autoSelect,
                goToSetup,
                handleClearFiltersFromList,
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
                setPlaceholder,
                placeholderLabel,
                filters,
                filterList,
                handleFilterChange,
                handleFilterInit,
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
