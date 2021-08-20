<template>
    <div class="flex w-full">
        <div
            v-if="showFilters"
            class="flex flex-col h-full bg-white border-r facets"
        >
            <AssetFilters
                :initial-filters="initialFilters"
                @refresh="handleFilterChange"
                :ref="
                    (el) => {
                        assetFilterRef = el
                    }
                "
            ></AssetFilters>
        </div>

        <div class="flex flex-col items-stretch flex-1 mt-3 mb-1 bg-white w-80">
            <div class="flex flex-col h-full">
                <div class="flex px-3 mb-1">
                    <ConnectorDropdown
                        :data="connectorsPayload"
                        @change="handleChangeConnectors"
                    ></ConnectorDropdown>
                    <AssetDropdown
                        v-if="connectorsPayload.connection"
                        :connector="filteredConnector"
                        :data="connectorsPayload"
                    ></AssetDropdown>
                </div>
                <div class="flex items-center mx-3 mt-1">
                    <a-input
                        ref="assetSearchBar"
                        v-model:value="queryText"
                        placeholder="Search"
                        size="default"
                        :class="$style.searchbar"
                        @change="handleSearchChange"
                    >
                        <template #suffix>
                            <AtlanIcon icon="Search" />
                        </template>
                    </a-input>
                    <a-popover trigger="click" placement="bottomRight">
                        <template #content>
                            <Preferences
                                :default-projection="projection"
                                @change="handleChangePreferences"
                                @sort="handleChangeSort"
                                @state="handleState"
                            ></Preferences>
                        </template>
                        <a-button class="p-1 ml-2 rounded">
                            <AtlanIcon icon="FilterDot" class="h-6" />
                        </a-button>
                    </a-popover>
                </div>

                <AssetTabs
                    v-model="assetType"
                    :asset-type-list="assetTypeList"
                    :asset-type-map="assetTypeMap"
                    :total="totalSum"
                ></AssetTabs>
                <div class="flex items-center justify-between w-full px-3 py-2">
                    <AssetPagination
                        v-if="!isLoading && !isValidating"
                        :label="assetTypeLabel"
                        :list-count="list.length"
                        :total-count="totalCount"
                    ></AssetPagination>
                    <span class="text-xs text-gray-500" v-else
                        >Searching...</span
                    >
                </div>
                <div
                    v-if="
                        list && list.length <= 0 && !isLoading && !isValidating
                    "
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
                    :isLoading="isLoading || isValidating"
                    :isLoadMore="isLoadMore"
                    @preview="handlePreview"
                    @loadMore="loadMore"
                ></AssetList>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {
        computed,
        defineComponent,
        reactive,
        ref,
        watch,
        toRaw,
        Ref,
        onMounted,
    } from 'vue'
    import AssetFilters from '@/discovery/asset/filters/index.vue'
    import SavedFilters from '@/discovery/asset/saved/index.vue'
    import AssetList from '@/discovery/asset/list/index.vue'
    import AssetTabs from '@/discovery/asset/tabs/index.vue'
    import AssetPagination from '@common/pagination/index.vue'
    import HeirarchySelect from '@common/tree/heirarchy/index.vue'
    import SearchBox from '@common/searchbox/searchlist.vue'
    import ConnectorDropdown from '~/components/common/dropdown/connectorDropdown.vue'
    import AssetDropdown from '~/components/common/dropdown/assetDropdown.vue'
    import EmptyView from '@common/empty/discover.vue'
    import Preferences from '@/discovery/asset/preference/index.vue'
    // import { useDebounceFn } from "@vueuse/core";
    // import fetchAssetDiscover from "~/composables/asset/fetchAssetDiscover";
    import { useDebounceFn } from '@vueuse/core'
    import useBusinessMetadata from '@/admin/custom-metadata/composables/useBusinessMetadata'
    import { useRouter } from 'vue-router'
    import useDiscoveryPreferences from '~/composables/preference/useDiscoveryPreference'
    // import { DISCOVERY_FETCH_LIST } from "~/constant/cache";
    // import { Components } from "~/api/atlas/client";
    import useAssetList from '~/composables/bots/useAssetList'
    import { AssetTypeList } from '~/constant/assetType'
    import { Components } from '~/api/atlas/client'
    import { SearchParameters } from '~/types/atlas/attributes'
    import {
        BaseAttributes,
        BasicSearchAttributes,
    } from '~/constant/projection'
    import { useBusinessMetadataStore } from '~/store/businessMetadata'
    import { useDiscoveryStore } from '~/store/discovery'
    import { useConnectionsStore } from '~/store/connections'
    import { getEncodedStringFromOptions } from '~/utils/routerQuery'
    import { initialFiltersType } from '~/pages/assets.vue'
    import useTracking from '~/modules/tracking'
    export interface filterMapType {
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
            SavedFilters,
            SearchBox,
            AssetTabs,
            AssetFilters,
            AssetPagination,
            ConnectorDropdown,
            Preferences,
            EmptyView,
            HeirarchySelect,
            AssetDropdown,
        },
        props: {
            initialFilters: {
                type: Object as () => initialFiltersType,
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
            const { initialFilters } = props
            const assetFilterRef = ref()
            const isFilterVisible = ref(false)
            const router = useRouter()
            const tracking = useTracking()
            const events = tracking.getEventsName()
            const filterMode = ref('custom')
            const now = ref(false)
            let initialBody: SearchParameters = reactive({})
            const assetType = ref('Catalog')
            const queryText = ref(initialFilters.searchText)
            const connectorsPayload = ref(initialFilters.connectorsPayload)
            const filters = ref(initialFilters.initialBodyCriterion)
            const filterMap = ref<filterMapType>({
                status: {
                    condition: initialFilters.facetsFilters.status.condition,
                    criterion: initialFilters.facetsFilters.status.criterion,
                },
                classifications: {
                    condition:
                        initialFilters.facetsFilters.classifications.condition,
                    criterion:
                        initialFilters.facetsFilters.classifications.criterion,
                },
                owners: {
                    condition: initialFilters.facetsFilters.owners.condition,
                    criterion: initialFilters.facetsFilters.owners.criterion,
                },
                advanced: {
                    condition: initialFilters.facetsFilters.advanced.condition,
                    criterion: initialFilters.facetsFilters.advanced.criterion,
                },
            })
            const limit = ref(initialFilters.limit || 20)
            const offset = ref(0)
            const sortOrder = ref('default')
            // * Get all available BMs and save on store
            const store = useBusinessMetadataStore()
            const { fetchBMonStore } = useBusinessMetadata()
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
            const totalCount = computed(() => {
                if (assetType.value === 'Catalog') {
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
            // Get All Disoverable Asset Types
            const assetTypeList = ref([])
            assetTypeList.value = AssetTypeList.filter(
                (item) => item.isDiscoverable == true
            )
            const assetTypeListString = assetTypeList.value
                .map((item) => item.id)
                .join(',')
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
            assetTypeList.value.unshift({
                id: 'Catalog',
                label: 'All',
            })
            const assetlist = ref(null)
            const isLoadMore = computed(
                () => totalCount.value > list.value.length
            )
            const {
                list,
                replaceBody,
                isLoading,
                isValidating,
                searchScoreList,
                isAggregate,
                assetTypeMap,
            } = useAssetList(
                now,
                assetTypeListString,
                initialBody,
                assetType.value,
                true
            )
            console.log('IS LOADING', isLoading.value)
            const updateBody = (dontScroll) => {
                initialBody = {
                    typeName: assetTypeListString,
                    termName: props.termName,
                    // includeClassificationAttributes: true,
                    // includeSubClassifications: true,
                    limit: limit.value,
                    offset: offset.value,
                    entityFilters: {},
                    attributes: [
                        ...BaseAttributes,
                        ...BasicSearchAttributes,
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
                const connectorCritera = {
                    condition: 'OR',
                    criterion: [],
                }
                const connectionCriteria = {
                    condition: 'OR',
                    criterion: [],
                }
                if (connectorsPayload.value?.connector) {
                    connectorCritera.criterion?.push({
                        attributeName: 'integrationName',
                        attributeValue: connectorsPayload.value?.connector,
                        operator: 'eq',
                    })
                }
                if (connectorsPayload.value?.connection) {
                    connectorCritera.criterion?.push({
                        attributeName: 'connectionQualifiedName',
                        attributeValue: connectorsPayload.value?.connection,
                        operator: 'eq',
                    })
                }
                initialBody.entityFilters.criterion.push(connectorCritera)
                initialBody.entityFilters.criterion.push(connectionCriteria)
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
                if (assetlist.value && !dontScroll) {
                    // assetlist?.value.scrollToItem(0);
                }
            }
            watch(
                [assetType, BMAttributeProjection],
                (n, o) => {
                    // ? Should these run only when all attributes are loaded? like BMAttributeProjection
                    updateBody()
                    if (!now.value) {
                        isAggregate.value = true
                        now.value = true
                    }
                },
                {
                    immediate: true,
                }
            )
            const { projection } = useDiscoveryPreferences()
            const handleSearchChange = useDebounceFn((val) => {
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
                if (list.value.length + limit.value < totalCount.value) {
                    offset.value = list.value.length + limit.value
                }
                isAggregate.value = false
                updateBody(true)
            }

            const handleClearFiltersFromList = () => {
                assetFilterRef.value?.resetAllFilters()
            }
            // select fist asset automatically

            watch(list, () => {
                if (list.value.length > 0) {
                    console.log(list.value[0], 'firstItem')
                    handlePreview(list.value[0])
                } else {
                    handlePreview(undefined)
                }
            })

            const assetSearchBar = ref<HTMLInputElement | null>(null)

            onMounted(() => {
                fetchBMonStore()
                assetSearchBar?.value?.focus()
            })
            return {
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
                filterMode,
                replaceBody,
                handleSearchChange,
                projection,
                handleChangePreferences,
                handleChangeSort,
                isLoading,
                isValidating,
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
                assetSearchBar,
                // listCount,
                // isLoading,
                // limit,
                // offset,
                // totalCount,
                // isLoadMore,
                // loadMore,
                // handleSearchChange,
                // handleFilterChange,
                // assetlist,
                // projection,
                // handleChangePreferences,
                // handleChangeAssetType,
                // assetTypeList,
                // handleChangeConnectors,
                // changeConnectors,
                // handleChangeSort,
                // handleSavedSearchChange,
                // savedSearch,
                // list,
                // filterMode,
                // state,
                // STATES,
                // assetTypeList,
                // totalCount,
                // listCount,
                // // defaultBody,
                // // handleSearchChange,
                // // handleChangePreferences,
                // // handleChangeAssetType,
                // projection,
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
<style lang="less" module>
    .searchbar {
        @apply mr-2 rounded;
        @apply border border-gray-300 !important;
        @apply outline-none;
        :global(.ant-input) {
            @apply h-6;
            @apply bg-transparent;
            @apply text-gray-500;
        }
        &:hover {
            border-right-width: 2px !important;
            box-shadow: 0 0 0 2px rgb(82 119 215 / 20%);
        }
        ::placeholder {
            @apply text-gray-500 opacity-80 text-sm;
        }
    }
</style>
<style scoped>
    .facets {
        min-width: 264px;
        width: 264px;
    }
</style>
