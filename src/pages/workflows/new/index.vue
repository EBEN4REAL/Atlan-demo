<template>
    <div
        v-if="
            workflowList &&
            workflowList.length <= 0 &&
            !isLoading &&
            !isFilterAppplied
        "
        class="h-full"
    >
        <EmptyState
            desc="Sorry! We couldn’t find any workflow templates."
            @event="$router.push('/workflows')"
            buttonText="Back to Workflows"
            :EmptyScreen="EmptyScreen"
            buttonIcon="ArrowRight"
        />
    </div>
    <div v-else class="flex w-full h-full">
        <div
            class="flex flex-col h-full bg-white border-r border-gray-300  facets"
        >
            <AtlanBtn
                class="m-2"
                size="sm"
                color="secondary"
                padding="compact"
                @click="$router.push(`/workflows`)"
            >
                <div class="flex items-center gap-2">
                    <div>Back to Workflows</div>
                </div>
            </AtlanBtn>
            <WorkflowFilters
                :ref="
                    (el) => {
                        workflowFilterRef = el
                    }
                "
                :filters-list="listOfFilters"
                :initial-filters="AllFilters"
                @refresh="handleFilterChange"
                @initialize="handleFilterInit"
            ></WorkflowFilters>
        </div>

        <div class="flex flex-col items-stretch flex-1 mb-1 w-80">
            <div class="flex flex-col h-full gap-y-5">
                <div class="bg-white">
                    <SearchAndFilter
                        v-model:value="queryText"
                        class="mx-3 mt-2"
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
                <!-- <div v-if="workflowList.length && !queryText" class="mx-3">
                    <p class="mb-2 text-xl font-bold text-gray-600">Featured</p>
                    <WorkflowCards
                        v-model:autoSelect="autoSelect"
                        :list="workflowList.slice(10, 14)"
                        :selected-item-id="selectedItemId"
                        @preview="handlePreview"
                    />
                </div>
                <div v-if="workflowList.length && !queryText" class="mx-3">
                    <p class="mb-2 text-xl font-bold text-gray-600">
                        Suggested
                    </p>
                    <WorkflowCards
                        v-model:autoSelect="autoSelect"
                        :list="workflowList.slice(15, 19)"
                        :selected-item-id="selectedItemId"
                        @preview="handlePreview"
                    />
                </div> -->

                <div class="">
                    <div
                        class="overflow-y-auto"
                        :style="
                            queryText || true
                                ? `height: calc(100vh - 9.5rem)`
                                : `height: calc(100vh - 29rem)`
                        "
                    >
                        <WorkflowList
                            v-model:autoSelect="autoSelect"
                            class="pt-2 bg-white"
                            :list="workflowList"
                            :is-loading="isLoading"
                            :is-load-more="isLoadMore"
                            :selected-item-id="selectedItemId"
                            @preview="handlePreview"
                            @loadMore="loadMore"
                        ></WorkflowList>
                    </div>
                </div>
            </div>
        </div>

        <div class="flex flex-col border-l border-gray-300 preview-container">
            <SetupPreview v-if="selected" :selected-workflow="selected" />
        </div>
    </div>
</template>

<script lang="ts">
    import { useDebounceFn } from '@vueuse/core'
    import { computed, defineComponent, ref, toRefs, Ref } from 'vue'
    import { useRouter } from 'vue-router'
    import EmptyScreen from '~/assets/images/workflows/empty_template.png'
    import EmptyState from '~/components/common/empty/index.vue'

    import SearchAndFilter from '@/common/input/searchAndFilter.vue'
    import WorkflowList from '@/workflows/new/list/workflowList.vue'
    // sharing discover components
    import Preferences from '@/workflows/discovery/list/preference.vue'
    import WorkflowFilters from '@/workflows/discovery/filters/workflowFilters.vue'

    import { serializeQuery, decodeQuery } from '~/utils/helper/routerHelper'

    import useFilterUtils from '@/workflows/discovery/filters/useFilterUtils'
    import { transformToFilters } from '~/components/workflows/discovery/filters/useFilterTransform'

    import { useWorkflowTemplates } from '~/composables/workflow/useWorkFlowList'
    import AtlanBtn from '~/components/UI/button.vue'
    import WorkflowCards from '@/workflows/new/cards.vue'
    import SetupPreview from '@/workflows/new/preview/preview.vue'

    import { List as listOfFilters } from '@/workflows/new/filters/filters' // own filter list

    export default defineComponent({
        name: 'WorkflowSetupPage',
        components: {
            WorkflowList,
            EmptyState,
            SetupPreview,
            WorkflowFilters,
            Preferences,
            WorkflowCards,
            SearchAndFilter,
            AtlanBtn,
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
            // FIXME auto select logic bug
            const autoSelect = ref(true)
            const selectedItemId = ref('')
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
            const sortOrder = ref('default')
            const state = ref('active')
            const facets = computed(() => AllFilters.value?.facetsFilters)

            const { generateFacetConfigForRouter } = useFilterUtils(facets)

            // Get All Disoverable Asset Types
            const selected = ref(null)
            const {
                workflowList,
                loadMore,
                filter_record,
                isLoading,
                filterList,
                mutate,
            } = useWorkflowTemplates(false)

            const isLoadMore = computed(
                () => filter_record.value > workflowList.value.length
            )

            const placeholderLabel: Ref<Record<string, string>> = ref({})

            const dynamicSearchPlaceholder = computed(() => {
                let placeholder = 'Search for Workflow Templates'
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
                if (state.value !== 'active') routerOptions.state = state.value

                const routerQuery = serializeQuery(routerOptions)
                router.push(`/workflows/new?${routerQuery}`)
            }
            const isFilterAppplied = ref(false)

            const shootQuery = () => {
                // console.log(filters.value)
                console.log({ ...AllFilters.value.facetsFilters })
                const filters = transformToFilters(AllFilters.value)
                isFilterAppplied.value = !!Object?.keys(filters?.filter).length
                filterList(filters)
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
                shootQuery()
            }

            const handleFilterChange = (
                payload: any,
                filterMapData: Record<string, Components.Schemas.FilterCriteria>
            ) => {
                // console.log(payload, filterMapData)
                AllFilters.value.facetsFilters = filterMapData
                filters.value = payload
                shootQuery()
                setRouterOptions()
            }

            const handleFilterInit = (payload: any) => {
                filters.value = payload
            }

            const handlePreview = (item) => {
                selectedItemId.value = item.workflowtemplate.metadata.uid
                selected.value = item
            }

            const handleClearFiltersFromList = () => {
                queryText.value = ''
                workflowFilterRef.value?.resetAllFilters()
            }

            return {
                autoSelect,
                isFilterAppplied,
                handleClearFiltersFromList,
                workflowFilterRef,
                AllFilters,
                selected,
                workflowList,
                loadMore,
                EmptyScreen,
                isLoadMore,
                handleSearchChange,
                handlePreview,
                queryText,
                isLoading,
                dynamicSearchPlaceholder,
                placeholderLabel,
                filters,
                filterList,
                selectedItemId,
                listOfFilters,
                handleFilterChange,
                handleFilterInit,
                handleChangeSort,
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
