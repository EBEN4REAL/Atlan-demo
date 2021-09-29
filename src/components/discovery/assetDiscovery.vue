<template>
    <div class="flex w-full">
        <div
            v-if="showFilters"
            class="flex flex-col h-full overflow-y-auto bg-white border-r border-gray-300  facets"
        >
            <AssetFilters
                :ref="
                    (el) => {
                        assetFilterRef = el
                    }
                "
                :initial-filters="AllFilters"
                @refresh="handleFilterChange"
                @initialize="handleFilterInit"
            ></AssetFilters>
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

                    <AssetTabs
                        v-model="selectedTab"
                        class="mt-1 mb-3"
                        @update:model-value="handleTabChange"
                        :asset-type-list="assetTypeList"
                        :asset-type-map="assetTypeMap"
                        :total="totalSum"
                    ></AssetTabs>
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
                    v-if="list && list.length <= 0 && !isLoading"
                    class="flex-grow"
                >
                    <EmptyView @event="handleClearFiltersFromList"></EmptyView>
                </div>
                <AssetList
                    v-else
                    ref="assetlist"
                    class="pt-2 bg-white"
                    :list="list"
                    :score="searchScoreList"
                    :projection="projection"
                    :is-loading="isLoading"
                    :is-load-more="isLoadMore"
                    :typename="assetTypeListString"
                    automaticSelectFirstAsset
                    @preview="handlePreview"
                    @loadMore="loadMore"
                ></AssetList>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import EmptyView from '@common/empty/discover.vue'
    import AssetPagination from '@common/pagination/index.vue'
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'

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
    import AssetTabs from '~/components/discovery/list/assetTypeTabs.vue'
    import Preferences from '~/components/discovery/list/preference.vue'
    import AssetList from '~/components/discovery/list/assetList.vue'
    import AssetFilters from '~/components/discovery/filters/discoveryFilters.vue'
    import AssetDropdown from '~/components/common/dropdown/assetDropdown.vue'
    import ConnectorDropdown from '~/components/common/dropdown/connectorDropdown.vue'

    import { useAssetListing, useAssetAggregation } from './useAssetListing'
    import useDiscoveryPreferences from '~/composables/preference/useDiscoveryPreference'
    import { AssetTypeList } from '~/constant/assetType'
    import {
        BaseAttributes,
        BasicSearchAttributes,
        tableauAttributes,
    } from '~/constant/projection'
    // TODO: Uncomment all tracing related code
    // import useTracking from '~/modules/tracking'
    import { initialFiltersType } from '~/pages/assets.vue'

    import { serializeQuery } from '~/utils/helper/routerHelper'

    import { useBusinessMetadataStore } from '~/store/businessMetadata'
    import { useFilteredTabs } from './useTabMapped'
    import { Components } from '~/api/atlas/client'
    import useFilterUtils from './filters/useFilterUtils'

    export default defineComponent({
        name: 'AssetDiscovery',
        components: {
            AssetList,
            AssetTabs,
            AssetFilters,
            AssetPagination,
            ConnectorDropdown,
            Preferences,
            EmptyView,
            AssetDropdown,
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

            const {
                list,
                replaceBody,
                isLoading,
                searchScoreList,
                mutateAssetInList,
            } = useAssetListing(assetTypeListString.value, false)

            const { assetTypeMap, refreshAggregation } = useAssetAggregation(
                assetTypeListString.value,
                false
            )

            const store = useBusinessMetadataStore()
            const BMListLoaded = computed(
                () => store.getBusinessMetadataListLoaded
            )
            const BMAttributeProjection = computed(
                () => store.getBusinessMetadataListProjections
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
                    placeholder += ' in ' + placeholderLabel.value.asset
                } else if (placeholderLabel.value.connector) {
                    placeholder += ' in ' + placeholderLabel.value.connector
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
                () => totalCount.value > list.value.length
            )

            const updateBody = () => {
                const initialBody = {
                    typeName: assetTypeListString.value,
                    termName: props.termName,
                    includeClassificationAttributes: true,
                    includeSubClassifications: true,
                    limit: limit.value,
                    offset: offset.value,
                    entityFilters: {
                        condition: 'AND',
                        criterion: Array.isArray(filters?.value)
                            ? [...filters.value]
                            : [],
                    },
                    attributes: [
                        ...BaseAttributes,
                        ...BasicSearchAttributes,
                        ...tableauAttributes,
                        ...BMAttributeProjection.value,
                    ],
                    aggregationAttributes: [],
                }

                if (selectedTab.value !== 'Catalog') {
                    initialBody.entityFilters.criterion.push({
                        attributeName: '__typeName',
                        attributeValue: selectedTab.value,
                        operator: 'eq',
                    })
                }

                if (state.value) {
                    if (state.value === 'all') {
                        initialBody.excludeDeletedEntities = false
                    } else if (state.value === 'archived') {
                        initialBody.excludeDeletedEntities = false
                        initialBody.entityFilters.criterion.push({
                            attributeName: '__state',
                            attributeValue: 'DELETED',
                            operator: 'eq',
                        })
                    } else {
                        initialBody.excludeDeletedEntities = true
                    }
                }

                if (sortOrder.value !== 'default') {
                    const split = sortOrder.value.split('|')
                    if (split.length > 1) {
                        initialBody.sortBy = split[0]
                        initialBody.sortOrder = split[1].toUpperCase()
                    }
                } else {
                    delete initialBody.sortBy
                    delete initialBody.sortOrder
                }
                if (queryText.value) {
                    initialBody.query = queryText.value
                }
                replaceBody(initialBody)
                if (isAggregate.value) refreshAggregation(initialBody)
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
                router.push(`/assets?${routerQuery}`)
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
                // tracking.trackEvent(events.EVENT_ASSET_SEARCH, {
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
                offset.value += limit.value
                isAggregate.value = false
                updateBody()
            }

            const handleClearFiltersFromList = () => {
                queryText.value = ''
                assetFilterRef.value?.resetAllFilters()
            }

            watch(
                BMListLoaded,
                (val) => {
                    if (val) {
                        isAggregate.value = true
                        try {
                            updateBody()
                        } catch (error) {
                            console.error(error)
                        }
                    }
                },
                { immediate: true }
            )

            console.log(list)

            return {
                handleClearFiltersFromList,
                assetFilterRef,
                initialFilters,
                AllFilters,
                initialTabs,
                searchScoreList,
                list,
                selectedTab,
                assetTypeLabel,
                assetTypeList,
                assetTypeMap,
                isAggregate,
                replaceBody,
                handleSearchChange,
                projection,
                handleChangePreferences,
                handleChangeSort,
                isLoading,
                handleFilterChange,
                handlePreview,
                queryText,
                totalCount,
                assetlist,
                isLoadMore,
                loadMore,
                totalSum,
                handleState,
                mutateAssetInList,
                handleTabChange,
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
