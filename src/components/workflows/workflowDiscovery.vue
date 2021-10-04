<template>
    <div class="flex w-full">
        <div
            class="flex flex-col h-full overflow-y-auto bg-white border-r border-gray-300  facets"
        >
            <!-- <WorkflowFilters
                :ref="
                    (el) => {
                        workflowFilterRef = el
                    }
                "
                :initial-filters="AllFilters"
                @refresh="handleFilterChange"
                @initialize="handleFilterInit"
            ></WorkflowFilters> -->
        </div>

        <div class="flex flex-col items-stretch flex-1 mb-1 w-80">
            <div class="flex flex-col h-full">
                <div class="bg-white">
                    <SearchAndFilter
                        v-model:value="queryText"
                        class="mx-3 mt-2"
                        :placeholder="dynamicSearchPlaceholder"
                        :autofocus="true"
                        @change="handleSearchChange"
                    >
                        <!-- <template #filter>
                            <Preferences
                                :default-projection="projection"
                                @change="handleChangePreferences"
                                @sort="handleChangeSort"
                                @state="handleState"
                            />
                        </template> -->
                        <!-- <template #buttonAggregation>
                        <span>({{ projection.length }})</span>
                    </template> -->
                    </SearchAndFilter>
                </div>

                <div
                    v-if="runList && runList.length <= 0 && !isLoading"
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
                    :list="queryText.length ? filterList(queryText) : runList"
                    :is-loading="isLoading"
                    @preview="handlePreview"
                    @loadMore="loadMore"
                ></WorkflowList>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import EmptyView from '@common/empty/discover.vue'
    import workflowPagination from '@common/pagination/index.vue'

    import { useDebounceFn } from '@vueuse/core'
    import {
        computed,
        defineComponent,
        onMounted,
        ref,
        watch,
        toRefs,
        PropType,
        Ref,
    } from 'vue'
    import { useRouter } from 'vue-router'
    import emptyScreen from '~/assets/images/empty_search.png'
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'
    import Preferences from '~/components/workflows/list/preference.vue'
    import WorkflowList from '~/components/workflows/list/workflowList.vue'
    import WorkflowFilters from '~/components/workflows/filters/workflowFilters.vue'

    import { serializeQuery } from '~/utils/helper/routerHelper'

    import useFilterUtils from './filters/useFilterUtils'
    import { useWorkflowTemplateSearchList } from './useWorkFlowList'

    export default defineComponent({
        name: 'WorkflowDiscovery',
        components: {
            WorkflowList,
            WorkflowFilters,
            workflowPagination,
            Preferences,
            EmptyView,
            SearchAndFilter,
        },
        props: {
            initialFilters: {
                type: Object,
                required: false,
                default() {
                    return {}
                },
            },
        },
        emits: ['preview'],
        setup(props, { emit }) {
            // FIXME FIX FILTERS
            const { initialFilters } = toRefs(props)
            const router = useRouter()

            // workflow filter component ref
            const workflowFilterRef = ref()
            const autoSelect = ref(true)

            // Clean Stuff
            const AllFilters: Ref = ref({ ...initialFilters.value })

            // TODO remove
            const selectedTab = computed({
                get: () => AllFilters.value.selectedTab || 'Catalog',
                set: (val) => {
                    AllFilters.value.selectedTab = val
                },
            })

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

            // Get All Disoverable Asset Types

            const {
                workflowList: runList,
                isLoading,
                filterList,
            } = useWorkflowTemplateSearchList('default', true)

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

            const updateBody = () => {
                console.log('updateBody')
            }

            // FIXME
            const setRouterOptions = () => {
                const routerOptions: Record<string, any> = {
                    facetsFilters: generateFacetConfigForRouter(),
                }
                if (queryText.value) routerOptions.searchText = queryText.value
                if (selectedTab.value !== 'Catalog')
                    routerOptions.selectedTab = selectedTab.value
                if (sortOrder.value !== 'default')
                    routerOptions.sortOrder = sortOrder.value
                if (state.value !== 'active') routerOptions.state = state.value

                const routerQuery = serializeQuery(routerOptions)
                router.push(`/workflows?${routerQuery}`)
            }

            const handleSearchChange = useDebounceFn(() => {
                // TODO use pagination and recall api

                // offset.value = 0
                // isAggregate.value = true
                // updateBody()
                setRouterOptions()
            }, 150)

            const handlePreview = (item) => {
                emit('preview', item)
            }
            const loadMore = () => {
                autoSelect.value = false
                offset.value += limit.value
                updateBody()
            }

            const handleClearFiltersFromList = () => {
                queryText.value = ''
                workflowFilterRef.value?.resetAllFilters()
            }

            return {
                autoSelect,
                handleClearFiltersFromList,
                workflowFilterRef,
                initialFilters,
                AllFilters,
                runList,
                emptyScreen,
                handleSearchChange,
                handlePreview,
                queryText,
                loadMore,
                isLoading,
                dynamicSearchPlaceholder,
                setPlaceholder,
                placeholderLabel,
                filters,
                filterList,
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
        width: 25%;
    }
</style>
