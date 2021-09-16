<template>
    <div class="flex w-full">
        <div
            v-if="showFilters"
            class="
                flex flex-col
                h-full
                overflow-y-auto
                bg-white
                border-r
                facets
            "
        >
            <AssetFilters
                :ref="
                    (el) => {
                        assetFilterRef = el
                    }
                "
                :initial-filters="initialFilters"
                @refresh="handleFilterChange"
                @modifyTabs="modifyTabs"
            ></AssetFilters>
        </div>

        <div class="flex flex-col items-stretch flex-1 mb-1 w-80">
            <div class="flex flex-col h-full">
                <SearchAndFilter
                    v-model:value="queryText"
                    class="mx-6 mt-4"
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
                    v-model="assetType"
                    class="mt-1 mb-3"
                    @update:model-value="handleTabChange"
                    :asset-type-list="assetTypeList"
                    :asset-type-map="assetTypeMap"
                    :total="totalSum"
                ></AssetTabs>

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
                    :list="list"
                    :score="searchScoreList"
                    :projection="projection"
                    :is-loading="isLoading"
                    :is-load-more="isLoadMore"
                    :automaticSelectFirstAsset="true"
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
    import HeirarchySelect from '@common/tree/heirarchy/index.vue'
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'

    // import { useDebounceFn } from "@vueuse/core";
    // import fetchAssetDiscover from "~/composables/asset/fetchAssetDiscover";
    import { useDebounceFn } from '@vueuse/core'
    import {
        computed,
        defineComponent,
        onMounted,
        reactive,
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
    // import { DISCOVERY_FETCH_LIST } from "~/constant/cache";
    // import { Components } from "~/api/atlas/client";
    import { useAssetListing, useAssetAggregation } from './useAssetListing'
    import useDiscoveryPreferences from '~/composables/preference/useDiscoveryPreference'
    import { AssetTypeList } from '~/constant/assetType'
    import {
        BaseAttributes,
        BasicSearchAttributes,
        tableauAttributes,
    } from '~/constant/projection'
    import useTracking from '~/modules/tracking'
    import { initialFiltersType } from '~/pages/assets.vue'
    import { useConnectionsStore } from '~/store/connections'
    import { SearchParameters } from '~/types/atlas/attributes'
    import { getEncodedStringFromOptions } from '~/utils/helper/routerQuery'
    import { useBusinessMetadataStore } from '~/store/businessMetadata'
    import {
        initialTabsForConnector,
        initialTabsForAssetCategory,
    } from './useTabMapped'

    export interface filterMapType {
        assetCategory: {
            checked?: Array<string>
            condition: string
            criterion: Array<{
                attributeName: 'typeName'
                attributeValue: string
                operator: string
            }>
        }
        status: {
            checked?: Array<string>
            condition: string
            criterion: Array<{
                attributeName: 'assetStatus'
                attributeValue: string
                operator: string
            }>
        }
        classifications: {
            checked?: Array<string>
            condition: string
            criterion: Array<{
                attributeName: 'classifications'
                attributeValue: string
                operator: string
            }>
        }
        owners: {
            userValue?: string
            groupValue?: string
            condition: string
            criterion: Array<{
                attributeName: string
                attributeValue?: string | undefined
                operator?: string | undefined
            }>
        }
        advanced: {
            list?: Array<string>
            condition: string
            criterion: Array<{
                attributeName: string
                attributeValue?: string | undefined
                operator?: string | undefined
            }>
        }
    }
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
            const assetFilterRef = ref()
            const isFilterVisible = ref(false)
            const router = useRouter()
            const tracking = useTracking()
            const events = tracking.getEventsName()
            const isAggregate = ref(true)

            const assetType = ref('Catalog')
            const queryText = ref(initialFilters.value.searchText)
            const connectorsPayload = ref(
                initialFilters.value.connectorsPayload
            )
            const filters = ref(initialFilters.value.initialBodyCriterion)

            console.log('initialFIters', filters.value)
            const filterMap = ref<filterMapType>({
                connector: {
                    condition:
                        initialFilters.value.facetsFilters.connector.condition,
                    criterion:
                        initialFilters.value.facetsFilters.connector.criterion,
                },
                assetCategory: {
                    condition:
                        initialFilters.value.facetsFilters.assetCategory
                            .condition,
                    criterion:
                        initialFilters.value.facetsFilters.assetCategory
                            .criterion,
                    selectedIds:
                        initialFilters.value.facetsFilters.assetCategory
                            .selectedIds,
                },
                status: {
                    condition:
                        initialFilters.value.facetsFilters.status.condition,
                    criterion:
                        initialFilters.value.facetsFilters.status.criterion,
                },
                classifications: {
                    condition:
                        initialFilters.value.facetsFilters.classifications
                            .condition,
                    criterion:
                        initialFilters.value.facetsFilters.classifications
                            .criterion,
                },
                owners: {
                    condition:
                        initialFilters.value.facetsFilters.owners.condition,
                    criterion:
                        initialFilters.value.facetsFilters.owners.criterion,
                },
                advanced: {
                    condition:
                        initialFilters.value.facetsFilters.advanced.condition,
                    criterion:
                        initialFilters.value.facetsFilters.advanced.criterion,
                },
            })
            const limit = ref(parseInt(initialFilters.value.limit) || 20)
            const offset = ref(0)
            const sortOrder = ref('default')

            // Get All Disoverable Asset Types
            const assetTypeList = ref([])
            const initialTabs = ref([])

            initialTabs.value = initialTabsForConnector(
                initialFilters.value.facetsFilters.connector.criterion
            )
            const assetCategoryTabs = initialTabsForAssetCategory(
                initialFilters.value.facetsFilters.assetCategory.selectedIds
            )
            if (assetCategoryTabs.length > 0)
                initialTabs.value = assetCategoryTabs

            const modifyTabs = (visibleTabs) => {
                let assetTypes = []
                if (visibleTabs?.length > 0) {
                    visibleTabs.forEach((id) => {
                        AssetTypeList.forEach((asset) => {
                            if (
                                asset.id === id &&
                                asset.isDiscoverable == true
                            ) {
                                assetTypes.push(asset)
                            }
                        })
                    })
                } else {
                    assetTypes = AssetTypeList.filter(
                        (item) => item.isDiscoverable == true
                    )
                }
                assetTypes.unshift({
                    id: 'Catalog',
                    label: 'All',
                })
                assetTypeList.value = assetTypes
            }
            if (initialTabs.value.length > 0) {
                modifyTabs(initialTabs.value)
            } else {
                assetTypeList.value = AssetTypeList.filter(
                    (item) => item.isDiscoverable == true
                )
                assetTypeList.value.unshift({
                    id: 'Catalog',
                    label: 'All',
                })
            }
            const assetTypeListString = computed(() =>
                assetTypeList.value.map((item) => item.id).join(',')
            )

            const {
                list,
                replaceBody,
                isLoading,
                searchScoreList,
                mutateAssetInList,
            } = useAssetListing(assetTypeListString.value, false)

            const { assetTypeMap, isAggregateLoading, refreshAggregation } =
                useAssetAggregation(assetTypeListString.value)

            const store = useBusinessMetadataStore()
            const BMListLoaded = computed(
                () => store.getBusinessMetadataListLoaded
            )
            const BMAttributeProjection = computed(
                () => store.getBusinessMetadataListProjections
            )

            const state = ref('active')
            const assetTypeLabel = computed(() => {
                const found = AssetTypeList.find(
                    (item) => item.id == assetType.value
                )
                return found?.label
            })
            const placeholderLabel: Ref<Record<string, string>> = ref({})
            const totalCount = computed(() => {
                if (assetType.value == 'Catalog') {
                    return totalSum.value
                }
                return assetTypeMap.value[assetType.value]
            })
            const connectorStore = useConnectionsStore()

            const filteredConnector = computed(() =>
                connectorStore.getSourceList?.find(
                    (item) => connectorsPayload.value?.connector == item.id
                )
            )

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
            const totalSum = computed(() => {
                let sum = 0
                assetTypeList.value.forEach((element) => {
                    if (assetTypeMap.value[element.id]) {
                        sum += assetTypeMap.value[element.id]
                    }
                })
                return sum
            })
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
                    entityFilters: {},
                    attributes: [
                        ...BaseAttributes,
                        ...BasicSearchAttributes,
                        ...tableauAttributes,
                        ...BMAttributeProjection.value,
                    ],
                    aggregationAttributes: [],
                }
                initialBody.entityFilters = {
                    condition: 'AND',
                    criterion: [...filters.value],
                }

                if (assetType.value !== 'Catalog') {
                    initialBody.entityFilters.criterion.push({
                        attributeName: '__typeName',
                        attributeValue: assetType.value,
                        operator: 'eq',
                    })
                }

                if (state.value) {
                    if (state.value === 'all') {
                        initialBody.excludeDeletedEntities = false
                    } else if (state.value === 'deleted') {
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
                // const connectorCritera = {
                //     condition: 'AND',
                //     criterion: [],
                // }
                // const connectionCriteria = {
                //     condition: 'OR',
                //     criterion: [],
                // }
                // if (connectorsPayload.value?.connector) {
                //     connectorCritera.criterion?.push({
                //         attributeName: 'integrationName',
                //         attributeValue: connectorsPayload.value?.connector,
                //         operator: 'eq',
                //     })
                // }
                // if (connectorsPayload.value?.connection) {
                //     connectorCritera.criterion?.push({
                //         attributeName: 'connectionQualifiedName',
                //         attributeValue: connectorsPayload.value?.connection,
                //         operator: 'eq',
                //     })
                // }
                // initialBody.entityFilters.criterion.push(connectorCritera)
                // initialBody.entityFilters.criterion.push(connectionCriteria)
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
                // if (assetlist.value && !dontScroll) {
                // assetlist?.value.scrollToItem(0);
                // }
            }

            function handleTabChange() {
                isAggregate.value = false
                offset.value = 0
                updateBody()
            }
            // watch(
            //     assetType,
            //     () => {
            //         // ? Should these run only when all attributes are loaded? like BMAttributeProjection
            //         updateBody()
            //         if (!now.value) {
            //             isAggregate.value = true
            //             now.value = true
            //         }
            //     },
            //     {
            //         immediate: true,
            //     }
            // )
            const { projection } = useDiscoveryPreferences()
            const handleSearchChange = useDebounceFn(() => {
                offset.value = 0
                const routerOptions = getRouterOptions()
                const routerQuery = getEncodedStringFromOptions(routerOptions)
                updateBody()
                pushQueryToRouter(routerQuery)
                tracking.trackEvent(events.EVENT_ASSET_SEARCH, {
                    trigger: 'discover',
                })
            }, 200)
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

            const getRouterOptions = () => ({
                filters: filterMap.value || {},
                searchText: queryText.value || '',
                connectorsPayload: connectorsPayload.value || {},
                // ...(sortOrder.value !== "default"
                //   ? queryText.value
                //     ? { sortBy: "", sortOrder: "" }
                //     : {
                //         sortBy: sortOrder.value.split("|")[0],
                //         sortOrder: sortOrder.value.split("|")[1],
                //       }
                //   : { sortBy: "", sortOrder: "" }),
                limit: limit.value || 20,
            })
            const pushQueryToRouter = (pushString) => {
                router.push(`/assets?${pushString}`)
            }

            const handleFilterChange = (
                payload: any,
                filterMapData: filterMapType
            ) => {
                filterMap.value = filterMapData
                filters.value = payload
                offset.value = 0
                isAggregate.value = true
                const routerOptions = getRouterOptions()
                const routerQuery = getEncodedStringFromOptions(routerOptions)
                updateBody()
                pushQueryToRouter(routerQuery)
            }
            const handleChangeConnectors = (payload: any) => {
                connectorsPayload.value = payload
                console.log('connector Change', payload)
                const routerOptions = getRouterOptions()
                const routerQuery = getEncodedStringFromOptions(routerOptions)
                pushQueryToRouter(routerQuery)
                isAggregate.value = true
                offset.value = 0
                updateBody()
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
                assetFilterRef.value?.resetAllFilters()
            }

            watch(BMListLoaded, (val) => {
                if (val) {
                    isAggregate.value = false
                    updateBody()
                }
            })

            onMounted(() => {
                if (BMListLoaded.value) {
                    isAggregate.value = false
                    updateBody()
                }
            })
            console.log(list)

            return {
                modifyTabs,
                handleClearFiltersFromList,
                assetFilterRef,
                isFilterVisible,
                initialFilters,
                searchScoreList,
                list,
                assetType,
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
                handleChangeConnectors,
                handleFilterChange,
                handlePreview,
                queryText,
                totalCount,
                assetlist,
                isLoadMore,
                loadMore,
                totalSum,
                handleState,
                connectorsPayload,
                filteredConnector,
                mutateAssetInList,
                handleTabChange,
                dynamicSearchPlaceholder,
                setPlaceholder,
                placeholderLabel,
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
