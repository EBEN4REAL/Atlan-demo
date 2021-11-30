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
        <!-- TODO update this to better error screen -->
        <EmptyState
            v-if="error"
            desc="Don't worry, something broke on our end, you can send this info to us."
            headline="Oops! Something went wrong"
            empty-screen="Error"
        />
        <EmptyState
            v-else
            desc="Create a workflow from a workflow template to bring in data into
            Atlan, run cron jobs and much more."
            headline="Create a workflow!"
            button-text="Get Started"
            empty-screen="CreateWF"
            button-icon="ArrowRight"
            @event="$router.push('/workflows/new')"
        />
    </div>
    <div v-else v-auth="access.LIST_WORKFLOW" class="flex w-full h-full">
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
            />
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
                        </SearchAndFilter>
                    </div>

                    <AtlanButton
                        v-auth="[
                            access.CREATE_WORKFLOW,
                            access.LIST_WORKFLOWTEMPLATE,
                        ]"
                        class="ml-2"
                        color="primary"
                        padding="compact"
                        @click="$router.push(`/workflows/new`)"
                    >
                        <div class="flex items-center gap-2">
                            <AtlanIcon icon="Add" class="" />
                            <div>New Workflow</div>
                        </div>
                    </AtlanButton>
                </div>
                <EmptyState
                    v-if="workflowList.length === 0 && !isLoading"
                    desc="Sorry! We couldn’t find any workflow. try resetting your filters."
                    button-text="Reset filters"
                    empty-screen="EmptyDiscover"
                    @event="handleClearFiltersFromList"
                />
                <WorkflowList
                    v-else
                    v-model:autoSelect="autoSelect"
                    class="pt-2 bg-white"
                    :list="workflowList"
                    :is-loading="isLoading"
                    :is-load-more="isLoadMore"
                    :creator-details="creatorDetails"
                    @preview="handlePreview"
                    @loadMore="loadMore"
                />
            </div>
        </div>

        <div class="border-l border-gray-300 preview-container">
            <DiscoveryPreview
                v-if="selected"
                :selected-workflow="selected"
                :creator-details="creatorDetails"
            />
        </div>
    </div>
</template>

<script lang="ts">
    import { useDebounceFn } from '@vueuse/core'
    import {
        computed,
        ComputedRef,
        defineComponent,
        provide,
        ref,
        Ref,
        watch,
    } from 'vue'

    import { useRouter } from 'vue-router'
    import { message } from 'ant-design-vue'
    import EmptyState from '~/components/common/empty/index.vue'
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'
    import Preferences from '@/workflows/discovery/list/preference.vue'
    import WorkflowList from '@/workflows/discovery/list/workflowList.vue'
    import WorkflowFilters from '@/workflows/discovery/filters/workflowFilters.vue'

    import { serializeQuery, decodeQuery } from '~/utils/helper/routerHelper'

    import useFilterUtils from '@/workflows/discovery/filters/useFilterUtils'
    import { transformToFilters } from '~/components/workflows/discovery/filters/useFilterTransform'
    import { useUsers } from '~/composables/user/useUsers'

    import { useWorkflowSearchList } from '~/composables/workflow/useWorkflowList'

    import AtlanButton from '~/components/UI/button.vue'
    import DiscoveryPreview from '@/workflows/discovery/preview/preview.vue'

    import { List as defaultfiltersList } from '@/workflows/discovery/filters/filters'
    import access from '~/constant/accessControl/map'

    export default defineComponent({
        name: 'WorkflowDiscovery',
        components: {
            EmptyState,
            WorkflowFilters,
            WorkflowList,
            DiscoveryPreview,
            AtlanButton,
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
            const users = ref([])
            const facets = computed(() => AllFilters.value?.facetsFilters)

            const { generateFacetConfigForRouter } = useFilterUtils(facets)
            const selected: Ref<object | null> = ref(null)
            const {
                workflowList,
                isLoading,
                error,
                filterList,
                totalCount,
                loadMore,
                isReady,
                mutate,
                filter_record,
                iDs,
            } = useWorkflowSearchList(false)

            const isLoadMore = computed(
                () => filter_record.value > workflowList.value.length
            )

            watch(error, (v) => {
                const errMsg = v?.response?.data?.message

                message.error({
                    content: `${errMsg || `Network Error`}`,
                    key: 'error',
                    duration: 5,
                })
            })

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

            const isFilterAppplied = ref(false)

            const shootQuery = () => {
                console.log(AllFilters.value)
                const filters = transformToFilters(AllFilters.value)
                console.log(filters)
                //! check if filter is user specific applied check to show empty state
                const filterCopy = filters?.filter
                if (filterCopy.$and?.length === 1) delete filterCopy.$and
                isFilterAppplied.value = !!Object?.keys(filterCopy).length
                filterList(filters)
            }
            if (!workflowList.value.length) shootQuery()

            const handleSearchChange = useDebounceFn(() => {
                // TODO use pagination and recall api
                setRouterOptions()
                shootQuery()
            }, 600)

            const handleChangeSort = (payload: any) => {
                AllFilters.value.sortOrder = payload
                isAggregate.value = true
                shootQuery()
            }

            const handleFilterChange = (
                payload: any,
                filterMapData: Record<string, Components.Schemas.FilterCriteria>
            ) => {
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

            const handleClearFiltersFromList = () => {
                queryText.value = ''
                workflowFilterRef.value?.resetAllFilters()
            }

            const params: ComputedRef<{
                limit?: number
                offset?: number
                filter?: any
                sort?: string
            }> = computed(() =>
                iDs.value
                    ? {
                          limit: 1,
                          offset: 0,
                          sort: 'first_name',
                          filter: {
                              $and: [
                                  {
                                      $or: iDs.value,
                                  },
                              ],
                          },
                      }
                    : {}
            )

            const handleGetUser = () => {
                const { userList } = useUsers(params, null, {})
                watch(userList, (newVal) => {
                    users.value = newVal
                })
            }

            watch(iDs, () => {
                handleGetUser()
            })

            const creatorDetails = computed(() => {
                if (users.value?.length && selected.value) {
                    return users.value.filter(
                        (el: { id: any }) =>
                            el?.id ===
                            selected.value?.metadata.labels[
                                'workflows.argoproj.io/creator'
                            ]
                    )[0]
                }
                return null
            })

            provide('creatorDetails', creatorDetails)

            const handlePreview = (item: object | null) => {
                selected.value = item
            }

            return {
                access,
                creatorDetails,
                isFilterAppplied,
                handleClearFiltersFromList,
                autoSelect,
                workflowFilterRef,
                selected,
                AllFilters,
                error,
                workflowList,
                isLoadMore,
                loadMore,
                handleSearchChange,
                handlePreview,
                queryText,
                isLoading,
                isReady,
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

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
    permissions: [LIST_WORKFLOW]
</route>
