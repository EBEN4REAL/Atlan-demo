<template>
    <div class="flex w-full">
        <div
            class="flex flex-col h-full bg-white border-r border-gray-300  facets"
        >
            <AtlanBtn
                class="m-2"
                size="sm"
                color="secondary"
                padding="compact"
                @click="goToWorkflow"
            >
                <div class="flex items-center gap-2">
                    <div>Back to Workflows</div>
                </div>
            </AtlanBtn>
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
            <div class="flex flex-col h-full gap-y-5">
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
                <div v-if="workflowList.length && !queryText" class="mx-3">
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
                </div>

                <div
                    v-if="
                        !isLoading &&
                        !(queryText.length
                            ? filterList(queryText).length
                            : workflowList.length)
                    "
                    class="flex flex-col items-center mt-10"
                >
                    <img
                        :src="emptyScreen"
                        alt="No Workflows"
                        class="w-2/5 m-auto mb-4"
                    />
                    <span class="text-gray-500"
                        >No Workflow template found</span
                    >
                </div>

                <div v-else class="">
                    <div
                        v-if="workflowList.length && !queryText"
                        class="mx-3 text-xl font-bold text-gray-600"
                    >
                        All
                    </div>
                    <div
                        class="overflow-y-auto"
                        :style="
                            queryText
                                ? `height: calc(100vh - 9.5rem)`
                                : `height: calc(100vh - 29rem)`
                        "
                    >
                        <WorkflowList
                            v-model:autoSelect="autoSelect"
                            class="pt-2 bg-white"
                            :list="
                                queryText.length
                                    ? filterList(queryText)
                                    : workflowList
                            "
                            :is-loading="isLoading"
                            :selected-item-id="selectedItemId"
                            @preview="handlePreview"
                            @loadMore="loadMore"
                        ></WorkflowList>
                    </div>
                </div>
            </div>
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
    import Preferences from '@/workflows/setup/list/preference.vue'
    import WorkflowList from '@/workflows/setup/list/workflowList.vue'
    import WorkflowFilters from '@/workflows/setup/filters/workflowFilters.vue'

    import { serializeQuery } from '~/utils/helper/routerHelper'

    import useFilterUtils from '@/workflows/setup/filters/useFilterUtils'
    import { useClusterWorkflowTemplates } from '~/composables/workflow/useWorkFlowList'
    import AtlanBtn from '~/components/UI/button.vue'
    import WorkflowCards from '@/workflows/setup/cards.vue'

    export default defineComponent({
        name: 'WorkflowDiscovery',
        components: {
            WorkflowList,
            WorkflowFilters,
            workflowPagination,
            Preferences,
            EmptyView,
            WorkflowCards,
            SearchAndFilter,
            AtlanBtn,
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
            const limit = ref(20)
            const offset = ref(0)
            const sortOrder = ref('default')
            const state = ref('active')
            const facets = computed(() => AllFilters.value?.facetsFilters)

            const { generateFacetConfigForRouter } = useFilterUtils(facets)

            // Get All Disoverable Asset Types

            const { workflowList, isLoading, filterList, mutate } =
                useClusterWorkflowTemplates('default', false)

            if (!workflowList.value.length) mutate()

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
                if (sortOrder.value !== 'default')
                    routerOptions.sortOrder = sortOrder.value
                if (state.value !== 'active') routerOptions.state = state.value

                const routerQuery = serializeQuery(routerOptions)
                router.push(`/workflows/new?${routerQuery}`)
            }

            const handleSearchChange = useDebounceFn(() => {
                // TODO use pagination and recall api
                setRouterOptions()
            }, 150)

            const handlePreview = (item) => {
                selectedItemId.value = item.metadata.uid
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

            const goToWorkflow = () => {
                router.push(`/workflows`)
            }

            return {
                autoSelect,
                handleClearFiltersFromList,
                workflowFilterRef,
                initialFilters,
                AllFilters,
                workflowList,
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
                goToWorkflow,
                selectedItemId,
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
