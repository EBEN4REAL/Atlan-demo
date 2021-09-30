<template>
    <div class="flex w-full" :class="$style.tabClasses">
        <div class="flex flex-col items-stretch flex-1 mb-1 bg-white w-80">
            <div class="flex flex-col h-full">
                <div v-if="checkedAssetList.length" class="flex">
                    <div
                        class="fixed left-0 z-10 flex justify-between w-full  bottom-8"
                    >
                        <div style="width: 264px"></div>
                        <div
                            v-if="showCheckBox"
                            class="flex items-center justify-between px-5 py-3 bg-gray-100 shadow-lg "
                            style="width: 545px"
                        >
                            <p class="p-0 m-0">
                                <span class="font-bold">{{
                                    checkedAssetList.length
                                }}</span>
                                assets selected
                            </p>
                            <div class="flex items-center">
                                <a-button
                                    class="px-3 mx-2 text-gray-700 bg-transparent outline-none "
                                    @click="handleCancelLinkAssets"
                                    >Cancel</a-button
                                >
                                <a-button
                                    class="px-6 text-white outline-none  bg-primary"
                                    @click="handleConfirmLinkAssets"
                                    >Link</a-button
                                >
                            </div>
                        </div>
                        <div style="width: 391px"></div>
                    </div>
                    <AssetDropdown
                        v-if="connectorsPayload?.connection"
                        :connector="filteredConnector"
                        :data="connectorsPayload"
                        @label-change="setPlaceholder($event, 'asset')"
                    ></AssetDropdown>
                </div>
                <div
                    v-if="showCheckBox"
                    class="flex items-center px-5 py-3 bg-gray-100"
                >
                    <a-button
                        class="p-0 mr-3 text-gray-700 bg-transparent border-0 shadow-none outline-none "
                        @click="handleCancelLinkAssets"
                    >
                        <AtlanIcon
                            class="w-auto h-5"
                            icon="ArrowRight"
                            style="transform: scaleX(-1)"
                        />
                    </a-button>
                    Link Assets
                </div>
                <div
                    class="flex items-center justify-between w-full px-3 mt-4 mb-2 "
                >
                    <a-button
                        class="flex items-center w-8 h-8 p-2 border-0 shadow-none outline-none "
                        @click="showFiltersPane = !showFiltersPane"
                    >
                        <AtlanIcon icon="FilterFunnel" />
                    </a-button>

                    <SearchAndFilter
                        v-model:value="queryText"
                        class="w-full mx-3 mt-1"
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
                    </SearchAndFilter>
                    <a-button
                        v-if="!showCheckBox"
                        class="px-3 text-white outline-none bg-primary"
                        @click="handleLinkAssets"
                        >Link assets</a-button
                    >
                </div>
                <AssetTabs
                    v-model="assetType"
                    :asset-type-list="assetTypeList"
                    :asset-type-map="assetTypeMap"
                    :total="totalSum"
                    @update:model-value="handleTabChange"
                    class="mt-2"
                ></AssetTabs>
                <div
                    v-if="
                        list && list.length <= 0 && !isLoading && !isValidating
                    "
                    class="flex-grow"
                >
                    <EmptyView @event="handleClearFiltersFromList"></EmptyView>
                </div>
                <div
                    v-else
                    class="pt-4 overflow-auto"
                    style="max-height: calc(100vh - 250px)"
                >
                    <AssetList
                        ref="assetlist"
                        :list="list"
                        :score="searchScoreList"
                        :projection="projection"
                        :is-loading="isLoading || isValidating"
                        :is-load-more="isLoadMore"
                        :isSelected="isSelected"
                        :showCheckBox="showCheckBox"
                        :automaticSelectFirstAsset="false"
                        :selectedAssetList="checkedAssetList"
                        @preview="handlePreview"
                        @loadMore="loadMore"
                        @updateCheckedAssetList="modifyLinkList"
                    ></AssetList>
                </div>
            </div>
        </div>
    </div>
    <teleport to="#filterPane">
        <a-drawer
            v-if="showFiltersPane"
            :visible="showFiltersPane"
            placement="left"
            :mask="false"
            :get-container="false"
            :wrap-style="{
                position: 'absolute',
                minWidth: '264px',
                backgroundColor: 'rgba(250, 250, 250, var(--tw-bg-opacity))',
            }"
            :keyboard="false"
            :destroy-on-close="true"
            :closable="false"
            width="100%"
            :class="$style.drawerClasses"
        >
            <div class="relative h-full mt-12 bg-gray-100">
                <a-button
                    class="absolute z-10 p-0 ml-5 text-gray-500 bg-transparent border-none rounded-none shadow-none outline-none  right-4"
                    @click="showFiltersPane = false"
                >
                    <AtlanIcon icon="Cancel" class="h-4" />
                </a-button>

                <AssetFilters
                    :ref="
                        (el) => {
                            assetFilterRef = el
                        }
                    "
                    @refresh="handleFilterChange"
                ></AssetFilters>

                <!-- <Filters
                    :initialFilters="initialFilters"
                    @filterUpdated="updateFilters"
                    @initialize="handleFilterInitialize"
                    @closePanel="showFiltersPane = false"
                /> -->
            </div>
        </a-drawer>
    </teleport>
</template>

<script lang="ts">
    import EmptyView from '@common/empty/discover.vue'
    import AssetPagination from '@common/pagination/index.vue'
    import HeirarchySelect from '@common/tree/heirarchy/index.vue'
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'

    import Filters from '@/glossary/common/filters.vue'
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
    import AssetList from '@/glossary/termProfile/glossaryAssetList.vue'
    import AssetDropdown from '~/components/common/dropdown/assetDropdown.vue'
    import ConnectorDropdown from '~/components/common/dropdown/connectorDropdown.vue'
    // import { DISCOVERY_FETCH_LIST } from "~/constant/cache";
    // import { Components } from "~/api/atlas/client";
    import useAssetList from '~/composables/bots/useAssetList'
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
    import { assetInterface } from '~/types/assets/asset.interface'
    import { useBusinessMetadataStore } from '~/store/businessMetadata'
    import { Components } from '~/api/atlas/client'
    import AssetFilters from '~/components/discovery/filters/discoveryFilters.vue'

    import useLinkAssets from '~/components/glossary/composables/useLinkAssets'

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
        name: 'GlossaryAssetDiscovery',
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
            Filters,
        },
        props: {
            initialFilters: {
                type: Object as PropType<initialFiltersType>,
                required: false,
                default: () => {},
            },
            termName: {
                type: String,
                required: true,
                default: '',
            },
            termGuid: {
                type: String,
                required: true,
                default: '',
            },
            showFilters: {
                type: Boolean,
                required: false,
                default: true,
            },
            isSelected: {
                type: Boolean,
                required: true,
                default: false,
            },
        },
        emits: ['preview'],
        setup(props, { emit }) {
            // initializing the discovery store
            const { initialFilters, termName, termGuid } = toRefs(props)
            const assetFilterRef = ref()
            const isFilterVisible = ref(false)
            const router = useRouter()
            const tracking = useTracking()
            const events = tracking.getEventsName()
            const filterMode = ref('custom')
            const now = ref(true)
            const showCheckBox = ref(false)

            const showFiltersPane = ref(true)
            const assetType = ref('Catalog')
            const queryText = ref(initialFilters.value.searchText)
            const connectorsPayload = ref(
                initialFilters.value.connectorsPayload
            )
            const checkedAssetList = ref<
                Components.Schemas.AtlasEntityHeader[]
            >([])
            const uncheckedAssetList = ref<
                Components.Schemas.AtlasEntityHeader[]
            >([])

            const filters = ref(initialFilters.value.initialBodyCriterion)
            const filterMap = ref<filterMapType>({
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
            assetTypeList.value = AssetTypeList.filter(
                (item) => item.isDiscoverable === true
            )
            const assetTypeListString = assetTypeList.value
                .map((item) => item.id)
                .join(',')

            const termQualifiedName = computed(() => {
                if (!showCheckBox.value) return termName.value
                return undefined
            })
            let initialBody: SearchParameters = reactive({
                typeName: assetTypeListString,
                termName: termQualifiedName.value,
                includeClassificationAttributes: true,
                includeSubClassifications: true,
                limit: limit.value,
                offset: offset.value,
                entityFilters: {},
                attributes: [
                    ...BaseAttributes,
                    ...BasicSearchAttributes,
                    ...tableauAttributes,
                ],
                aggregationAttributes: [],
            })
            const {
                list,
                replaceBody,
                isLoading,
                isValidating,
                searchScoreList,
                isAggregate,
                assetTypeMap,
                mutateAssetInList,
            } = useAssetList(
                now,
                assetTypeListString,
                initialBody,
                assetType.value,
                true
            )

            // const store = useBusinessMetadataStore()
            // const BMListLoaded = computed(
            //     () => store.getBusinessMetadataListLoaded
            // )
            // const BMAttributeProjection = computed(
            //     () => store.getBusinessMetadataListProjections
            // )

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
            assetTypeList.value.unshift({
                id: 'Catalog',
                label: 'All',
            })
            const assetlist = ref(null)
            const isLoadMore = computed(
                () => totalCount.value > list.value.length
            )

            const updateBody = () => {
                initialBody = {
                    typeName: assetTypeListString,
                    termName: termQualifiedName.value,
                    includeClassificationAttributes: true,
                    includeSubClassifications: true,
                    limit: limit.value,
                    offset: offset.value,
                    entityFilters: {},
                    attributes: [
                        ...BaseAttributes,
                        ...BasicSearchAttributes,
                        ...tableauAttributes,
                        // ...BMAttributeProjection.value,
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
            }

            function handleTabChange() {
                isAggregate.value = false
                offset.value = 0
                updateBody()
            }

            const { projection } = useDiscoveryPreferences()
            const handleSearchChange = useDebounceFn(() => {
                offset.value = 0
                updateBody()
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
                updateBody()
            }

            const handleClearFiltersFromList = () => {
                assetFilterRef.value?.resetAllFilters()
            }

            // watch(BMListLoaded, (val) => {
            //     if (val) {
            //         now.value = true
            //         isAggregate.value = true
            //         updateBody()
            //     }
            // })

            onMounted(() => {
                now.value = true
                isAggregate.value = false
            })

            const handleLinkAssets = () => {
                showCheckBox.value = !showCheckBox.value
                isAggregate.value = true

                updateBody()
            }
            const handleCancelLinkAssets = () => {
                showCheckBox.value = false
                checkedAssetList.value = []
                uncheckedAssetList.value = []
                isAggregate.value = true

                updateBody()
            }
            const handleConfirmLinkAssets = () => {
                const { assignLinkedAssets, unLinkAssets } = useLinkAssets()

                const { response: unlinkResponse } = unLinkAssets(
                    termGuid.value,
                    uncheckedAssetList.value
                )

                const { response } = assignLinkedAssets(
                    termGuid.value,
                    checkedAssetList.value
                )
                watch(response, (data) => {
                    showCheckBox.value = false
                    updateBody()
                })
            }

            const modifyLinkList = (
                e: Event,
                item: Components.Schemas.AtlasEntityHeader
            ) => {
                if (e?.target?.checked) {
                    if (
                        !checkedAssetList.value.find(
                            (asset) => asset.guid === item.guid
                        )
                    ) {
                        checkedAssetList.value.push(item)
                    }
                    uncheckedAssetList.value = uncheckedAssetList.value.filter(
                        (asset) => asset.guid !== item.guid
                    )
                } else {
                    checkedAssetList.value = checkedAssetList.value.filter(
                        (asset) => asset.guid !== item.guid
                    )
                    if (
                        !uncheckedAssetList.value.find(
                            (asset) => asset.guid === item.guid
                        )
                    ) {
                        uncheckedAssetList.value.push(item)
                    }
                }
            }

            const handleFilterChange = (
                payload: any,
                filterMapData: Record<string, Components.Schemas.FilterCriteria>
            ) => {
                console.log(payload)
                console.log(filterMapData)
                filters.value = payload
                offset.value = 0
                isAggregate.value = true
                updateBody()
            }

            // watch(showCheckBox, () => {
            //     updateBody()
            // }, {
            //     immediate: true
            // });
            watch(termName, () => {
                updateBody()
            })

            watch(list, (newList) => {
                if (!showCheckBox.value) {
                    checkedAssetList.value = [...newList]
                    uncheckedAssetList.value = []
                }
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
                mutateAssetInList,
                handleTabChange,
                dynamicSearchPlaceholder,
                setPlaceholder,
                placeholderLabel,
                showCheckBox,
                handleLinkAssets,
                handleCancelLinkAssets,
                handleConfirmLinkAssets,
                modifyLinkList,
                checkedAssetList,
                uncheckedAssetList,
                termQualifiedName,
                showFiltersPane,
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
    .facets {
        min-width: 264px;
        width: 25%;
    }
    .tabClasses {
        :global(.ant-tabs-tab) {
            margin: 0px 32px 0px 0px;
            padding: 0px 0px 18px 0px;
        }
        :global(.ant-tabs-nav) {
            margin: 0px !important;
        }
        :global(.ant-tabs-tab-active) {
            @apply text-gray-700 font-bold !important;
        }
        :global(.ant-tabs-bar) {
            @apply px-1 mb-0 !important;
        }
    }
    .drawerClasses {
        :global(.ant-drawer-wrapper-body) {
            @apply bg-gray-100 !important;
        }
    }
</style>
