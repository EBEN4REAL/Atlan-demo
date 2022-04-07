<template>
    <div class="flex w-full h-full">
        <div
            v-if="showFilters"
            class="flex flex-col hidden h-full bg-gray-100 border-r border-gray-300 sm:block facets"
        >
            <AssetFilters
                v-if="showFilters"
                :key="dirtyTimestamp"
                v-model="facets"
                v-model:activeKey="activeKey"
                :filter-list="discoveryFilters"
                :type-name="postFacets.typeName"
                :deny-custom-metadata="denyCustomMetadata"
                @change="handleFilterChange"
                @reset="handleResetEvent"
                @change-active-key="handleActiveKeyChange"
            ></AssetFilters>
        </div>

        <div class="flex flex-col items-stretch flex-1 w-80 bg-primary-light">
            <div class="flex flex-col h-full">
                <div class="flex items-center bg-white shadow-sm">
                    <ConnectorSelect
                        style="min-width: 150px"
                        v-model="facets.connector"
                        class="px-1 border-r"
                        :persona="persona"
                        @change="handleConnectorChange"
                        :key="hierarchyDirtyTimestamp"
                    ></ConnectorSelect>
                    <SearchAdvanced
                        :key="searchDirtyTimestamp"
                        ref="searchBox"
                        v-model="queryText"
                        :autofocus="true"
                        :allow-clear="true"
                        :is-loading="isValidating"
                        size="large"
                        :class="
                            ['admin', 'classifications'].includes(page)
                                ? ''
                                : 'px-3 bg-white  border-none'
                        "
                        :placeholder="placeholder"
                        @change="handleSearchChange"
                    >
                        <template #filter>
                            <a-popover
                                v-if="showFilters"
                                class="sm:block md:hidden"
                                placement="bottom"
                                :trigger="['click']"
                                :overlay-class-name="$style.filterPopover"
                            >
                                <template #content>
                                    <AssetFilters
                                        :key="dirtyTimestamp"
                                        v-model="facets"
                                        v-model:activeKey="activeKey"
                                        :filter-list="discoveryFilters"
                                        :type-name="postFacets.typeName"
                                        @change="handleFilterChange"
                                        @change-active-key="
                                            handleActiveKeyChange
                                        "
                                    ></AssetFilters>
                                </template>
                                <AtlanIcon
                                    icon="FilterFunnel"
                                    class="mr-1"
                                ></AtlanIcon>
                            </a-popover>
                        </template>

                        <template #sort>
                            <Sorting
                                v-model="preference.sort"
                                @change="handleChangePreference"
                            />
                        </template>
                        <template #display>
                            <a-popover
                                trigger="click"
                                placement="bottomRight"
                                :overlay-class-name="$style.search"
                            >
                                <template #content>
                                    <div class="p-3" style="max-width: 250px">
                                        <PreferenceSelector
                                            v-model="preference.display"
                                            @change="handleChangePreference"
                                            @display="handleDisplayChange"
                                        />
                                    </div>
                                </template>

                                <a-badge
                                    :color="
                                        preference.display?.length > 0
                                            ? '#5278d7'
                                            : null
                                    "
                                >
                                    <button
                                        class="transition-colors rounded hover:bg-gray-100"
                                    >
                                        <AtlanIcon
                                            icon="Display"
                                            class="w-4 h-4 px-1"
                                        />
                                    </button>
                                </a-badge>
                            </a-popover>
                        </template>
                    </SearchAdvanced>
                    <slot name="searchAction"></slot>
                </div>

                <div
                    class="flex items-center w-full mt-2"
                    v-if="facets.connector"
                >
                    <Heirarchy
                        :connector="facets.connector"
                        v-model="facets.hierarchy"
                        @change="handleFilterChange"
                        :persona="persona"
                        :key="`${facets.connector}_${hierarchyDirtyTimestamp}`"
                    ></Heirarchy>
                </div>
                <div
                    v-if="showAggrs"
                    class="w-full"
                    :class="page === 'admin' ? '' : 'px-4 mt-2 mb-1'"
                >
                    <AggregationTabs
                        v-model="postFacets.typeName"
                        class=""
                        :list="assetTypeAggregationList"
                        :isReset="isConnectorChange"
                        :shortcut-enabled="true"
                        @change="handleAssetTypeChange"
                    >
                    </AggregationTabs>
                </div>

                <div
                    v-if="
                        error &&
                        error?.message !== 'operation cancelled' &&
                        !isValidating
                    "
                    class="flex items-center justify-center flex-grow"
                >
                    <ErrorView></ErrorView>
                </div>
                <div
                    v-else-if="list.length === 0 && !isValidating"
                    class="flex-grow"
                >
                    <EmptyView
                        empty-screen="NoAssetsFound"
                        image-class="h-44"
                        :desc="
                            staticUse && !queryText
                                ? emptyViewText || 'No assets found'
                                : queryText
                                ? 'We didn\'t find anything that matches your search criteria'
                                : emptyViewText || 'No assets found'
                        "
                        :button-text="
                            staticUse ? '' : queryText ? 'Reset Filter' : ''
                        "
                        class="mb-10"
                        @event="handleResetEvent"
                    ></EmptyView>
                </div>
                <div
                    v-else-if="list.length === 0 && isValidating"
                    class="flex items-center justify-center flex-grow"
                >
                    <AtlanLoader class="h-10" />
                </div>

                <ListNavigator
                    v-else
                    :list="list"
                    :start-index="selectedAssetIndex"
                    :blocked="listNavigationBlocked"
                    :html-id-getter="getAssetId"
                    @change="onKeyboardNavigate"
                >
                    <AssetList
                        ref="assetlistRef"
                        :list="list"
                        :selected-asset="selectedAsset"
                        :is-load-more="isLoadMore"
                        :is-loading="isValidating"
                        class="bg-primary-light"
                        @loadMore="handleLoadMore"
                    >
                        <template #default="{ item, itemIndex }">
                            <AssetItem
                                :id="getAssetId(item)"
                                :item="item"
                                :item-index="itemIndex"
                                :is-loading="isValidating"
                                :selected-guid="
                                    page === 'admin' || page === 'glossary'
                                        ? null
                                        : selectedAsset.guid
                                "
                                :page="page"
                                :preference="preference"
                                :show-check-box="showCheckBox"
                                :bulk-select-mode="
                                    bulkSelectedAssets &&
                                    bulkSelectedAssets.length
                                        ? true
                                        : false
                                "
                                :enable-sidebar-drawer="enableSidebarDrawer"
                                :is-checked="
                                    checkableItems
                                        ? checkSelectedCriteriaFxn(item)
                                        : false
                                "
                                :class="
                                    page == 'assets'
                                        ? 'mx-4 bg-white border hover:shadow'
                                        : 'mx-4 border-transparent hover:primary-menu-light'
                                "
                                :open-asset-profile-in-new-tab="
                                    item.typeName.toLowerCase() === 'query'
                                "
                                @preview="handleClickAssetItem"
                                @updateDrawer="updateCurrentList"
                                @listItem:check="
                                    (e, item) => updateBulkSelectedAssets(item)
                                "
                                @browseAsset="handleBrowseAsset"
                            ></AssetItem>
                        </template>
                    </AssetList>
                </ListNavigator>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {
        toRaw,
        PropType,
        defineComponent,
        ref,
        toRefs,
        Ref,
        computed,
        inject,
        watch,
        ComputedRef,
        onMounted,
    } from 'vue'
    import EmptyView from '@common/empty/index.vue'
    import ErrorView from '@common/error/discover.vue'
    import ListNavigator from '@common/keyboardShortcuts/listNavigator.vue'
    import {
        useDebounceFn,
        whenever,
        useMagicKeys,
        watchOnce,
    } from '@vueuse/core'
    // import PopOverAsset from '@common/popover/assets/index.vue'
    import { useRoute } from 'vue-router'
    import SearchAdvanced from '@/common/input/searchAdvanced.vue'
    import AggregationTabs from '@/common/tabs/aggregationTabs.vue'
    import PreferenceSelector from '@/assets/preference/index.vue'

    import Sorting from '@/common/dropdown/sorting.vue'

    import AssetFilters from '@/common/assets/filters/index.vue'
    import AssetList from '@/common/assets/list/index.vue'
    import AssetItem from '@/common/assets/list/assetItem.vue'
    import SchemaTree from './schema/index.vue'

    import {
        AssetAttributes,
        AssetRelationAttributes,
        InternalAttributes,
        SQLAttributes,
        GlossaryAttributes,
    } from '~/constant/projection'

    import { useDiscoverList } from '~/composables/discovery/useDiscoverList'
    import AtlanIcon from '../common/icon/atlanIcon.vue'
    import useAssetStore from '~/store/asset'
    import { discoveryFilters } from '~/constant/filters/discoveryFilters'
    import useBulkUpdateStore from '~/store/bulkUpdate'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'
    import useShortcuts from '~/composables/shortcuts/useShortcuts'
    import { usePersonaStore } from '~/store/persona'

    import ConnectorSelect from './hierarchy/connector.vue'

    import Heirarchy from './hierarchy/index.vue'
    const ANALYTICS_KEYS = {
        connector: 'connector',
    }

    export default defineComponent({
        name: 'AssetDiscovery',
        components: {
            AssetList,
            AggregationTabs,
            AssetFilters,
            SearchAdvanced,
            PreferenceSelector,
            EmptyView,
            ErrorView,
            AtlanIcon,
            AssetItem,
            ListNavigator,
            Heirarchy,
            ConnectorSelect,
            Sorting,
            SchemaTree,
            // PopOverAsset,
        },
        props: {
            showFilters: {
                type: Boolean,
                required: false,
                default: true,
            },
            initialFilters: {
                type: Object,
                required: false,
                default: () => {},
            },
            preference: {
                type: Object as PropType<any>,
                required: false,
                default: () => ({
                    sort: 'default',
                    display: [],
                }),
            },
            showAggrs: {
                type: Boolean,
                required: false,
                default: true,
            },
            showCheckBox: {
                type: Boolean,
                required: false,
                default: false,
            },
            checkedCriteria: {
                type: String,
                required: false,
                default: 'guid',
            },
            staticUse: {
                type: Boolean,
                required: false,
                default: false,
            },
            page: {
                type: String,
                required: false,
                default: 'assets',
            },
            enableSidebarDrawer: {
                type: Boolean,
                required: false,
                default: false,
            },
            emptyViewText: {
                type: String,
                default: '',
            },
            allCheckboxAreaClick: {
                type: Boolean,
                default: false,
            },
            checkableItems: {
                type: Boolean,
                required: false,
                default: true,
            },
            disableHandlePreview: {
                type: Boolean,
                default: false,
            },
            isCache: {
                type: Boolean,
                required: false,
                default: true,
            },
            cacheKey: {
                type: String,
                required: false,
            },
            /**
             * ref: https://linear.app/atlanproduct/issue/META-2830/add-flag-to-suppress-ranger-logs-in-indexsearch-api
             */
            suppressLogs: {
                type: Boolean,
                default: true,
                required: false,
            },
        },
        setup(props, { emit }) {
            const {
                preference: preferenceProp,
                checkedCriteria,
                initialFilters,
                page,
                projection,
                allCheckboxAreaClick,
                disableHandlePreview,
                isCache,
                cacheKey,
                suppressLogs,
            } = toRefs(props)

            const limit = ref(20)
            const offset = ref(0)
            const queryText = ref('')
            const facets = ref({})
            const globalState = ref([])
            const selectedAssetId = ref('')
            /* Assiging prefrence props if any from props */
            const preference = ref(toRaw(preferenceProp.value))

            const aggregations = ref(['typeName'])
            const postFacets = ref({
                typeName: '__all',
            })
            const dependentKey = ref(cacheKey.value || 'DEFAULT_ASSET_LIST')

            const defaultAttributes = ref([
                ...InternalAttributes,
                ...AssetAttributes,
                ...SQLAttributes,
                ...GlossaryAttributes,
            ])

            const relationAttributes = ref([...AssetRelationAttributes])

            const activeKey: Ref<string[]> = ref([])
            const dirtyTimestamp = ref(`dirty_${Date.now().toString()}`)
            const searchDirtyTimestamp = ref(`dirty_${Date.now().toString()}`)
            const hierarchyDirtyTimestamp = ref(
                `dirty_${Date.now().toString()}`
            )
            const searchBox: Ref<null | HTMLInputElement> = ref(null)

            const discoveryStore = useAssetStore()

            if (discoveryStore.activeFacet && page.value === 'assets') {
                facets.value = discoveryStore.activeFacet
            }
            if (discoveryStore.activePostFacet && page.value === 'assets') {
                postFacets.value = discoveryStore.activePostFacet
            }
            if (discoveryStore.preferences && page.value !== 'admin') {
                preference.value.sort =
                    discoveryStore.preferences.sort || preference.value.sort
                preference.value.display =
                    discoveryStore.preferences.display ||
                    preference.value.display
            }
            if (discoveryStore.activeFacetTab?.length > 0) {
                activeKey.value = discoveryStore.activeFacetTab
            } else {
                activeKey.value = ['hierarchy']
            }

            if (discoveryStore.globalState?.length > 0) {
                globalState.value = discoveryStore.globalState
            }

            if (props.initialFilters) {
                facets.value = {
                    ...facets.value,
                    ...initialFilters.value,
                }
            }

            const personaStore = usePersonaStore()
            const { globalState: stateAsset } = toRefs(discoveryStore)
            const denyCustomMetadata = computed(
                () =>
                    personaStore.list.find(
                        (persona) => persona.id === stateAsset?.value[1]
                    )?.attributes?.preferences?.customMetadataDenyList || []
            )
            /* Watcher for parent component changes initial filters otherwise req won't be triggered */
            watch(initialFilters, () => {
                facets.value = {
                    ...facets.value,
                    ...initialFilters.value,
                }
                quickChange()
            })

            const persona = computed(() => {
                if (discoveryStore.globalState.length === 2) {
                    if (discoveryStore.globalState[0] === 'persona') {
                        return discoveryStore.globalState[1]
                    }
                }
                return ''
            })

            watch(
                () => discoveryStore.globalState,
                () => {
                    globalState.value = discoveryStore.globalState
                    handleResetEvent()
                    useAddEvent('discovery', 'global_context', 'changed', {
                        type:
                            discoveryStore.globalState[0] === 'all'
                                ? 'all_assets'
                                : discoveryStore.globalState[0],
                    })
                },
                {
                    deep: true,
                }
            )

            const {
                list,
                isLoading,
                assetTypeAggregationList,
                isLoadMore,
                isValidating,
                fetch,

                error,
                selectedAsset,
                quickChange,
                updateList,
                rotateAggregateTab,
            } = useDiscoverList({
                isCache: isCache.value,
                dependentKey,
                queryText,
                facets,
                postFacets,
                aggregations,
                preference,
                limit,
                offset,
                attributes: defaultAttributes,
                relationAttributes,
                globalState,
                suppressLogs: suppressLogs?.value,
            })

            const selectedAssetIndex = computed(() => {
                // return 0
                if (selectedAsset.value?.guid) {
                    return list.value.findIndex(
                        (asset) => asset.guid === selectedAsset.value?.guid
                    )
                }
                return -1
            })

            const handlePreview = inject('preview')
            const isCmndKVisible: ComputedRef<boolean | undefined> =
                inject('isCmndKVisible')

            const updateCurrentList = (asset) => {
                updateList(asset)
            }

            const sendSearchEvent = useDebounceFn(() => {
                useAddEvent('discovery', 'search', 'changed')
            }, 600)

            // analytic key for connection filter should be different based on the level of filter selected
            const getAnalyticKey = (k) => {
                if (k === 'connection') {
                    if (
                        facets.value.hierarchy?.attributeName ===
                        'schemaQualifiedName'
                    )
                        return 'schema'
                    if (
                        facets.value.hierarchy?.attributeName ===
                        'databaseQualifiedName'
                    )
                        return 'database'
                    if (facets.value.hierarchy?.connectionQualifiedName)
                        return 'connection'
                    if (facets.value.hierarchy?.connectorName)
                        return 'connector'
                }
                return k
            }
            const sendFilterEvent = useDebounceFn((filterItem) => {
                if (filterItem && filterItem.analyticsKey) {
                    const parsedAnalyticKey = getAnalyticKey(
                        filterItem.analyticsKey
                    )
                    useAddEvent('discovery', 'filter', 'changed', {
                        type: parsedAnalyticKey,
                    })
                }
            }, 600)

            const firstAssetAutoClicked = ref(false)

            const handleClickAssetItem = (...args) => {
                if (allCheckboxAreaClick.value) {
                    updateBulkSelectedAssets(...args)
                }
                if (firstAssetAutoClicked.value) {
                    useAddEvent('discovery', 'asset_card', 'clicked', {
                        click_index: args[1],
                    })
                }

                if (handlePreview && !disableHandlePreview.value) {
                    handlePreview(...args)
                }
            }

            const handleSearchChange = useDebounceFn(() => {
                offset.value = 0
                sendSearchEvent()
                quickChange()
            }, 100)

            const isConnectorChange = ref(false)
            const isGlossaryChange = ref(false)
            const connector = ref('')

            const handleBrowseAsset = (val) => {
                facets.value.connector = val.connector
                facets.value.hierarchy.connectionQualifiedName =
                    val.connectionQualifiedName
                facets.value.hierarchy.attributeName = val.attributeName
                facets.value.hierarchy.attributeValue = val.attributeValue

                hierarchyDirtyTimestamp.value = `dirty_${Date.now().toString()}`
                offset.value = 0
                quickChange()
            }

            const handleFilterChange = (filterItem) => {
                console.log('handleFilterChange', filterItem)
                isConnectorChange.value = false
                isGlossaryChange.value = false
                offset.value = 0
                quickChange()
                discoveryStore.setActiveFacet(facets.value)
                sendFilterEvent(filterItem)
            }

            const handleConnectorChange = (filterItem) => {
                facets.value.hierarchy = {}

                if (!facets.value.connector) {
                    connector.value = ''
                    // facets.value.glossary = ''
                    isGlossaryChange.value = false
                    isConnectorChange.value = false
                } else if (facets.value.connector == '__glossary') {
                    connector.value = ''
                    isConnectorChange.value = false
                    isGlossaryChange.value = true
                } else if (connector.value !== facets.value.connector) {
                    isConnectorChange.value = true
                    connector.value = facets.value.connector
                }
                offset.value = 0
                quickChange()
                discoveryStore.setActiveFacet(facets.value)
                sendFilterEvent({
                    analyticsKey: ANALYTICS_KEYS.connector,
                })
            }

            const handleGlossaryChange = (filterItem) => {
                // console.log('changed glossary')
                // isConnectorChange.value = false
                // isGlossaryChange.value = true
                // connector.value = ''
                // facets.value.hierarchy = {}
                // facets.value.glossary = facets.value.connector
                // facets.value.connector = ''
                // console.log('changed glossary', facets.value)
                // offset.value = 0
                // quickChange()
                // discoveryStore.setActiveFacet(facets.value)
                // sendFilterEvent(filterItem)
            }

            const handleAssetTypeChange = (tabName) => {
                offset.value = 0
                quickChange()
                if (page.value !== 'admin')
                    discoveryStore.setActivePostFacet(postFacets.value)
                useAddEvent('discovery', 'aggregate_tab', 'changed', {
                    name: tabName,
                })
                handleFocusOnInput()
            }

            const handleLoadMore = () => {
                if (isLoadMore.value) {
                    offset.value += limit.value
                }
                quickChange()
            }

            const handleChangePreference = () => {
                quickChange()
                discoveryStore.setPreferences(preference.value)
            }

            const handleDisplayChange = () => {
                discoveryStore.setPreferences(preference.value)
            }

            const handleResetEvent = () => {
                facets.value = {
                    ...initialFilters.value,
                    connector: facets.value.connector,
                    hierarchy: facets.value.hierarchy,
                }
                queryText.value = ''
                handleFilterChange(facets.value)
                dirtyTimestamp.value = `dirty_${Date.now().toString()}`
                searchDirtyTimestamp.value = `dirty_${Date.now().toString()}`
            }

            const handleActiveKeyChange = () => {
                discoveryStore.setActivePanel(activeKey.value)
            }

            const route = useRoute()
            const isAssetProfile = computed(() => !!route.params.id)
            const onKeyboardNavigate = (index, asset) => {
                handleClickAssetItem(asset, index)
                console.log('onKeyboardNavigate', {
                    isAssetProfile: isAssetProfile.value,
                    index,
                    asset: asset.attributes.name,
                    selectedAssetIndex: selectedAssetIndex.value,
                    selectedAsset: selectedAsset.value?.attributes?.name,
                })
            }

            const placeholder = computed(() => {
                const found = assetTypeAggregationList.value.find(
                    (item) => item.id === postFacets.value.typeName
                )

                if (found) {
                    return `Search ${found.label.toLowerCase()} assets`
                }
                return 'Search all assets'
            })

            const getAssetId = (item) => item.guid

            const { allowedTabAndArrowShortcuts } = useShortcuts()
            const listNavigationBlocked = computed(
                () =>
                    !allowedTabAndArrowShortcuts.value ||
                    isCmndKVisible.value ||
                    isAssetProfile.value
            )
            const keys = useMagicKeys()
            const { tab, shift_tab } = keys

            const handleFocusOnInput = () => {
                // sear.value?.focus()
                searchBox?.value?.focusInput()
            }

            whenever(tab, () => {
                if (
                    shift_tab.value ||
                    isCmndKVisible.value ||
                    !allowedTabAndArrowShortcuts.value
                ) {
                    // don't run if cmd k is on
                    return
                }
                rotateAggregateTab(1, handleFocusOnInput)
            })

            whenever(shift_tab, () => {
                if (
                    isCmndKVisible.value ||
                    !allowedTabAndArrowShortcuts.value
                ) {
                    // don't run if cmd k is on
                    return
                }
                rotateAggregateTab(-1, handleFocusOnInput)
            })

            /* BULK SELECTION */
            const store = useBulkUpdateStore()
            const bulkSelectedAssets: Ref<any[]> = ref(
                toRaw(store.bulkSelectedAssets)
            )
            watch(store, () => {
                bulkSelectedAssets.value = store.$state.bulkSelectedAssets
            })
            const updateBulkSelectedAssets = (listItem) => {
                switch (checkedCriteria.value) {
                    case 'guid': {
                        const itemIndex = bulkSelectedAssets?.value?.findIndex(
                            (item) => item?.guid === listItem?.guid
                        )
                        if (itemIndex >= 0)
                            bulkSelectedAssets.value.splice(itemIndex, 1)
                        else bulkSelectedAssets.value.push(listItem)
                        break
                    }
                    case 'qualifiedName': {
                        const itemIndex = bulkSelectedAssets?.value?.findIndex(
                            (qualifiedName) =>
                                qualifiedName ===
                                listItem?.attributes?.qualifiedName
                        )
                        if (itemIndex >= 0)
                            bulkSelectedAssets.value.splice(itemIndex, 1)
                        else
                            bulkSelectedAssets.value.push(
                                listItem?.attributes?.qualifiedName
                            )
                        break
                    }
                    default: {
                        const itemIndex = bulkSelectedAssets?.value?.findIndex(
                            (item) => item?.guid === listItem?.guid
                        )
                        if (itemIndex >= 0)
                            bulkSelectedAssets.value.splice(itemIndex, 1)
                        else bulkSelectedAssets.value.push(listItem)
                    }
                }
                store.setBulkMode(!!bulkSelectedAssets.value.length)
                store.setBulkSelectedAssets(bulkSelectedAssets.value)
            }
            /* By default it will be guid, but it can be through qualifiedName */
            const checkSelectedCriteriaFxn = (item) => {
                switch (checkedCriteria.value) {
                    case 'guid': {
                        return (
                            bulkSelectedAssets.value.findIndex(
                                (listItem) => listItem.guid === item.guid
                            ) > -1
                        )
                        break
                    }
                    case 'qualifiedName': {
                        return (
                            bulkSelectedAssets.value.findIndex(
                                (qualifiedName) =>
                                    qualifiedName ===
                                    item?.attributes.qualifiedName
                            ) > -1
                        )
                        break
                    }
                    default: {
                        return (
                            bulkSelectedAssets.value.findIndex(
                                (listItem) => listItem.guid === item.guid
                            ) > -1
                        )
                    }
                }
            }

            onMounted(() => {
                watchOnce(isValidating, (v) => {
                    if (!v && list.value?.length && page.value === 'assets') {
                        const isNone =
                            typeof selectedAsset.value === 'object' &&
                            Object.keys(selectedAsset.value).length === 0
                        if (isNone) handleClickAssetItem(list.value[0])
                        else handleClickAssetItem(selectedAsset.value)

                        firstAssetAutoClicked.value = true
                    }
                })
            })

            return {
                checkSelectedCriteriaFxn,
                selectedAssetId,
                projection,
                handleFilterChange,
                isLoading,
                queryText,
                assetTypeAggregationList,
                list,
                facets,
                isLoadMore,
                postFacets,
                handleLoadMore,
                handleAssetTypeChange,
                handlePreview,
                fetch,
                placeholder,
                handleSearchChange,
                isValidating,
                preference,
                handleChangePreference,
                handleResetEvent,
                dirtyTimestamp,
                handleDisplayChange,
                handleActiveKeyChange,
                activeKey,
                discoveryFilters,
                error,
                selectedAsset,
                updateList,
                updateCurrentList,
                searchDirtyTimestamp,
                updateBulkSelectedAssets,
                bulkSelectedAssets,
                handleClickAssetItem,
                searchBox,
                onKeyboardNavigate,
                selectedAssetIndex,
                isCmndKVisible,
                getAssetId,
                quickChange,
                isAssetProfile,
                listNavigationBlocked,
                isConnectorChange,
                connector,
                denyCustomMetadata,
                persona,
                handleConnectorChange,
                handleGlossaryChange,
                isGlossaryChange,
                handleBrowseAsset,
                hierarchyDirtyTimestamp,
            }
        },
    })
</script>

<style lang="less">
    .facets {
        max-width: 264px;
        width: 25%;
    }
</style>

<style lang="less" module>
    .filterPopover {
        max-width: 200px;
        min-width: 200px;
    }
</style>
