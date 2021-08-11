<template>
    <div class="flex w-full">
        <div class="h-full bg-white border-r facets">
            <div class="flex flex-col p-4">
                <div class="mb-3">
                    <a-radio-group
                        v-model:value="filterMode"
                        class="flex w-full text-center"
                    >
                        <a-radio-button class="flex-grow" value="custom"
                            ><fa icon="fal filter" class="pushtop"></fa
                        ></a-radio-button>
                        <a-radio-button class="flex-grow" value="saved"
                            ><fa icon="fal list-alt" class="pushtop"></fa
                        ></a-radio-button>
                    </a-radio-group>
                </div>

                <div v-show="filterMode === 'custom'" class="flex-grow">
                    <AssetFilters
                        :initial-filters="initialFilters"
                        @refresh="handleFilterChange"
                    ></AssetFilters>
                </div>

                <div v-show="filterMode === 'saved'">
                    <!--     <SavedFilters @refresh="handleSavedSearchChange"></SavedFilters> -->
                </div>
            </div>
        </div>

        <div
            class="flex flex-col items-stretch flex-grow mt-3 mb-1 bg-white"
            style="overflow: hidden"
        >
            <div class="flex flex-col h-full">
                <div class="flex px-3">
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
                        v-model:value="queryText"
                        placeholder="Search for assets"
                        size="default"
                        :class="$style.searchbar"
                        @change="handleSearchChange"
                    >
                        <template #prefix>
                            <Fa
                                icon="fal search"
                                class="mr-2 text-gray-description"
                            />
                        </template>
                    </a-input>
                    <a-popover
                        v-model:visible="isFilterVisible"
                        trigger="click"
                        placement="bottomLeft"
                    >
                        <template #content>
                            <Preferences
                                :default-projection="projection"
                                @change="handleChangePreferences"
                                @sort="handleChangeSort"
                                @state="handleState"
                            ></Preferences>
                        </template>
                        <div
                            tabindex="0"
                            class="flex items-center px-2 py-1 transition-shadow border rounded  border-gray-bg hover:border-gray-300"
                            @keyup.enter="isFilterVisible = !isFilterVisible"
                        >
                            <span>Options</span>
                            <Fa
                                icon="fas chevron-down"
                                class="ml-1 transition-transform transform"
                                :class="
                                    isFilterVisible ? '-rotate-180' : 'rotate-0'
                                "
                            />
                        </div>
                    </a-popover>
                </div>

                <AssetTabs
                    v-model="assetType"
                    :asset-type-list="assetTypeList"
                    :asset-type-map="assetTypeMap"
                    :total="totalSum"
                ></AssetTabs>

                <div
                    v-if="
                        list && list.length <= 0 && !isLoading && !isValidating
                    "
                    class="flex-grow"
                >
                    <EmptyView></EmptyView>
                </div>
                <AssetList
                    v-else
                    ref="assetlist"
                    :list="list"
                    :score="searchScoreList"
                    :projection="projection"
                    :is-loading="isLoading || isValidating"
                    @preview="handlePreview"
                ></AssetList>
                <div class="flex w-full px-3 py-1">
                    <div class="flex items-center justify-between w-full">
                        <div
                            v-if="isLoading || isValidating"
                            class="flex items-center text-sm leading-none"
                        >
                            <a-spin
                                size="small"
                                class="mr-2 leading-none"
                            ></a-spin
                            ><span>searching results</span>
                        </div>
                        <AssetPagination
                            v-else
                            :label="assetTypeLabel"
                            :list-count="list.length"
                            :total-count="totalCount"
                        ></AssetPagination>

                        <div
                            v-if="isLoadMore && (!isLoading || !isValidating)"
                            class="text-sm cursor-pointer text-primary"
                            @click="loadMore"
                        >
                            load more...
                        </div>
                    </div>
                </div>
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
    import ConnectorDropdown from '@common/dropdown/connector/index.vue'

    import AssetDropdown from '@common/dropdown/asset/index.vue'

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
        },
        emits: ['preview'],
        setup(props, { emit }) {
            // initializing the discovery store
            const { initialFilters } = props
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
            assetTypeList.value.push({
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

            console.log(
                assetTypeListString,
                initialBody,
                assetType.value,
                'useAssetList type'
            )

            const updateBody = (dontScroll) => {
                initialBody = {
                    typeName: assetTypeListString,
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
                    isAggregate.value = false
                    // abort();
                    offset.value = 0
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
            }, 100)

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

            onMounted(() => {
                fetchBMonStore()
            })

            return {
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
        @apply mr-2 border-none rounded;
        @apply bg-gray-bg bg-opacity-50;
        @apply outline-none;
        :global(.ant-input) {
            @apply h-6;
            @apply bg-transparent;
            @apply text-gray-description;
        }
        ::placeholder {
            @apply text-gray-description opacity-80 text-sm;
        }
    }
</style>
<style scoped>
    .facets {
        min-width: 280px;
        width: 340px;
    }
</style>
