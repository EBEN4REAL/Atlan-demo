<template>
    <div class="flex w-full">
        <div
            v-if="showFilters"
            class="flex flex-col h-full overflow-y-auto bg-white border-r border-gray-300  facets"
        >
            <WorkflowFilters
                :ref="
                    (el) => {
                        assetFilterRef = el
                    }
                "
                :initial-filters="AllFilters"
                @refresh="handleFilterChange"
                @initialize="handleFilterInit"
            ></WorkflowFilters>
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

                    <!-- <AssetTabs
                        v-model="selectedTab"
                        class="mt-1 mb-3"
                        @update:model-value="handleTabChange"
                        :asset-type-list="assetTypeList"
                        :asset-type-map="assetTypeMap"
                        :total="totalSum"
                    ></AssetTabs> -->
                </div>
                <!-- <div
                    class="flex items-center justify-between w-full px-3 py-2 border-b border-gray-300 "
                >
                    <AssetPagination
                        v-if="!isLoading && !isValidating"
                        :label="assetTypeLabel"
                        :list-count="list.length"
                        :total-count="totalCount"
                    ></AssetPagination>
                    <span v-else class="text-xs text-gray-500"
                        >Searching...</span
                    >
                </div> -->
                <div
                    v-if="runList && runList.length <= 0 && !isLoading"
                    class="flex-grow"
                >
                    <EmptyView @event="handleClearFiltersFromList"></EmptyView>
                </div>
                <RunList
                    v-else
                    ref="assetlist"
                    v-model:autoSelect="autoSelect"
                    class="pt-2 bg-white"
                    :list="runList"
                    :is-loading="isLoading"
                    :is-load-more="isLoadMore"
                    @preview="handlePreview"
                    @loadMore="loadMore"
                ></RunList>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import EmptyView from '@common/empty/discover.vue'
    import AssetPagination from '@common/pagination/index.vue'

    // import { useDebounceFn } from "@vueuse/core";
    // import fetchAssetDiscover from "~/composables/asset/fetchAssetDiscover";
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
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'
    import AssetTabs from '~/components/workflows/list/assetTypeTabs.vue'
    import Preferences from '~/components/workflows/list/preference.vue'
    import RunList from '~/components/workflows/list/runList.vue'
    import WorkflowFilters from '~/components/workflows/filters/workflowFilters.vue'

    import useDiscoveryPreferences from '~/composables/preference/useDiscoveryPreference'
    import { AssetTypeList } from '~/constant/assetType'
    import { initialFiltersType } from '~/pages/assets.vue'

    import { serializeQuery } from '~/utils/helper/routerHelper'

    import { useFilteredTabs } from './useTabMapped'
    import { Components } from '~/api/atlas/client'
    import useFilterUtils from './filters/useFilterUtils'
    import { useWorkflowSearchList } from './useWorkFlowList'
    import { useAssetAggregation } from './useAssetListing'

    export default defineComponent({
        name: 'WorkflowDiscovery',
        components: {
            RunList,
            AssetTabs,
            WorkflowFilters,
            AssetPagination,
            Preferences,
            EmptyView,
            SearchAndFilter,
        },
        props: {
            initialFilters: {
                type: Object as PropType<initialFiltersType>,
                required: false,
                default() {
                    return {}
                },
            },
            termName: {
                type: String,
                required: false,
                default: undefined,
            },
            showFilters: {
                type: Boolean,
                required: false,
                default: true,
            },
        },
        emits: ['preview'],
        setup(props, { emit }) {
            // initializing the discovery store
            const { initialFilters } = toRefs(props)
            const router = useRouter()

            // Asset filter component ref
            const assetFilterRef = ref()
            const autoSelect = ref(true)

            // const tracking = useTracking()
            // const events = tracking.getEventsName()
            const isAggregate = ref(true)

            // Clean Stuff
            const AllFilters: Ref = ref({ ...initialFilters.value })

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
            // FIXME: Can we make it a computed property?
            const filters = ref([])
            const limit = ref(20)
            const offset = ref(0)
            const sortOrder = ref('default')
            const state = ref('active')
            const facets = computed(() => AllFilters.value?.facetsFilters)

            const { generateFacetConfigForRouter } = useFilterUtils(facets)

            // Get All Disoverable Asset Types
            const initialTabs: Ref<string[]> = computed(() =>
                useFilteredTabs({
                    connector: AllFilters.value?.facetsFilters?.connector,
                    category:
                        AllFilters.value?.facetsFilters?.assetCategory?.checked,
                })
            )

            const assetTypeList = computed(() => {
                const filteredTabs = AssetTypeList.filter(
                    (item) =>
                        item.isDiscoverable == true &&
                        initialTabs.value.includes(item.id)
                )

                return [
                    {
                        id: 'Catalog',
                        label: 'All',
                    },
                    ...filteredTabs,
                ]
            })

            const assetTypeListString = computed(() =>
                initialTabs.value.join(',')
            )

            const { workflowList: runList, isLoading } = useWorkflowSearchList(
                'default',
                true
            )

            const { assetTypeMap, refreshAggregation } = useAssetAggregation(
                assetTypeListString.value,
                false
            )

            const assetTypeLabel = computed(() => {
                const found = AssetTypeList.find(
                    (item) => item.id == selectedTab.value
                )
                return found?.label
            })

            const totalSum = computed(() => {
                let sum = 0
                assetTypeList.value.forEach((element) => {
                    if (assetTypeMap.value[element.id]) {
                        sum += assetTypeMap.value[element.id]
                    }
                })
                return sum
            })

            const totalCount = computed(() => {
                if (selectedTab.value == 'Catalog') {
                    return totalSum.value
                }
                return assetTypeMap.value[selectedTab.value]
            })

            const placeholderLabel: Ref<Record<string, string>> = ref({})
            const dynamicSearchPlaceholder = computed(() => {
                let placeholder = 'Search for assets'
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

            // Push all asset type
            const assetlist = ref(null)
            const isLoadMore = computed(
                () => totalCount.value > runList.value.length
            )

            const updateBody = () => {
                console.log('updateBody')
            }

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

            function handleTabChange() {
                isAggregate.value = false
                offset.value = 0
                updateBody()
                setRouterOptions()
            }

            const { projection } = useDiscoveryPreferences()
            const handleSearchChange = useDebounceFn(() => {
                offset.value = 0
                isAggregate.value = true
                updateBody()
                setRouterOptions()
                // tracking.send(events.EVENT_ASSET_SEARCH, {
                //     trigger: 'discover',
                // })
            }, 150)
            const handleChangePreferences = (payload: any) => {
                projection.value = payload
            }
            const handleChangeSort = (payload: any) => {
                sortOrder.value = payload
                isAggregate.value = false
                updateBody()
            }
            const handleState = (payload: any) => {
                state.value = payload
                isAggregate.value = true
                updateBody()
            }

            const handleFilterChange = (
                payload: any,
                filterMapData: Record<string, Components.Schemas.FilterCriteria>
            ) => {
                AllFilters.value.facetsFilters = filterMapData
                filters.value = payload
                offset.value = 0
                isAggregate.value = true
                updateBody()
                setRouterOptions()
            }

            const handleFilterInit = (payload: any) => {
                filters.value = payload
            }

            const handlePreview = (item) => {
                emit('preview', item)
            }
            const loadMore = () => {
                autoSelect.value = false
                offset.value += limit.value
                isAggregate.value = false
                updateBody()
            }

            const handleClearFiltersFromList = () => {
                queryText.value = ''
                assetFilterRef.value?.resetAllFilters()
            }

            console.log(runList)

            return {
                autoSelect,
                handleClearFiltersFromList,
                assetFilterRef,
                initialFilters,
                AllFilters,
                initialTabs,
                runList,
                selectedTab,
                assetTypeLabel,
                assetTypeList,
                assetTypeMap,
                isAggregate,
                handleSearchChange,
                projection,
                handleChangePreferences,
                handleChangeSort,
                handleFilterChange,
                handlePreview,
                queryText,
                totalCount,
                assetlist,
                isLoadMore,
                loadMore,
                totalSum,
                handleState,
                handleTabChange,
                isLoading,
                dynamicSearchPlaceholder,
                setPlaceholder,
                placeholderLabel,
                filters,
                assetTypeListString,
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
        width: 25%;
    }
</style>
