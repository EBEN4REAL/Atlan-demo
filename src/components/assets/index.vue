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
                @change="handleFilterChange"
                @reset="handleResetEvent"
                @change-active-key="handleActiveKeyChange"
            ></AssetFilters>
        </div>

        <div class="flex flex-col items-stretch flex-1 mb-1 w-80">
            <div class="flex flex-col h-full">
                <div class="flex">
                    <SearchAdvanced
                        :key="searchDirtyTimestamp"
                        ref="searchBox"
                        v-model="queryText"
                        :connector-name="facets?.hierarchy?.connectorName"
                        :autofocus="true"
                        :allow-clear="true"
                        size="large"
                        :class="
                            ['admin', 'classifications'].includes(page)
                                ? ''
                                : 'px-6'
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
                        <template #postFilter>
                            <div style="max-width: 330px">
                                <PreferenceSelector
                                    v-model="preference"
                                    @change="handleChangePreference"
                                    @display="handleDisplayChange"
                                />
                            </div>
                        </template>
                    </SearchAdvanced>
                    <slot name="searchAction"></slot>
                </div>

                <div
                    v-if="showAggrs"
                    class="w-full"
                    :class="page === 'admin' ? '' : 'px-6'"
                >
                    <AggregationTabs
                        v-model="postFacets.typeName"
                        class="mt-2 mb-1"
                        :list="assetTypeAggregationList"
                        :shortcut-enabled="true"
                        @change="handleAssetTypeChange"
                    >
                    </AggregationTabs>
                </div>

                <div
                    v-if="isLoading"
                    class="flex items-center justify-center flex-grow"
                >
                    <AtlanLoader class="h-10" />
                </div>
                <div
                    v-if="!isLoading && error"
                    class="flex items-center justify-center flex-grow"
                >
                    <ErrorView></ErrorView>
                </div>
                <div
                    v-else-if="list.length === 0 && !isLoading"
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

                <!--                             :show-check-box="
                                preference?.display?.includes('enableCheckbox')
                            " -->
                <ListNavigator
                    v-else
                    :list="list"
                    :start-index="selectedAssetIndex"
                    :blocked="isCmndKVisible || isAssetProfile"
                    :html-id-getter="getAssetId"
                    @change="onKeyboardNavigate"
                >
                    <AssetList
                        ref="assetlistRef"
                        :list="list"
                        :selected-asset="selectedAsset"
                        :is-load-more="isLoadMore"
                        :is-loading="isValidating"
                        @loadMore="handleLoadMore"
                    >
                        <template #default="{ item, itemIndex }">
                            <AssetItem
                                :item="item"
                                :item-index="itemIndex"
                                :selected-guid="
                                    page === 'admin' || page === 'glossary'
                                        ? null
                                        : selectedAsset.guid
                                "
                                :preference="preference"
                                :show-check-box="showCheckBox"
                                :id="getAssetId(item)"
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
                                :class="page !== 'admin' ? 'mx-3' : 'mx-3'"
                                @preview="handleClickAssetItem"
                                @updateDrawer="updateCurrentList"
                                @listItem:check="
                                    (e, item) => updateBulkSelectedAssets(item)
                                "
                                :openAssetProfileInNewTab="
                                    item.typeName.toLowerCase() === 'query'
                                "
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
    import SearchAdvanced from '@/common/input/searchAdvanced.vue'
    import AggregationTabs from '@/common/tabs/aggregationTabs.vue'
    import PreferenceSelector from '@/assets/preference/index.vue'

    import AssetFilters from '@/common/assets/filters/index.vue'
    import AssetList from '@/common/assets/list/index.vue'
    import AssetItem from '@/common/assets/list/assetItem.vue'
    import useTypedefData from '~/composables/typedefs/useTypedefData'

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
    import { useRoute } from 'vue-router'

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

            const { customMetadataProjections } = useTypedefData()
            const defaultAttributes = ref([
                ...InternalAttributes,
                ...AssetAttributes,
                ...SQLAttributes,
                ...customMetadataProjections,
            ])
            if (page.value === 'glossary') {
                defaultAttributes.value.push(...GlossaryAttributes)
            }
            const relationAttributes = ref([...AssetRelationAttributes])

            const activeKey: Ref<string[]> = ref([])
            const dirtyTimestamp = ref(`dirty_${Date.now().toString()}`)
            const searchDirtyTimestamp = ref(`dirty_${Date.now().toString()}`)
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
            /* Watcher for parent component changes initial filters otherwise req won't be triggered */
            watch(initialFilters, () => {
                facets.value = {
                    ...facets.value,
                    ...initialFilters.value,
                }
                quickChange()
            })

            watch(
                () => discoveryStore.globalState,
                () => {
                    globalState.value = discoveryStore.globalState
                    handleResetEvent()
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

            const sendFilterEvent = useDebounceFn((filterItem) => {
                if (filterItem && filterItem.analyticsKey) {
                    useAddEvent('discovery', 'filter', 'changed', {
                        type: filterItem.analyticsKey,
                    })
                }
            }, 600)

            const handleClickAssetItem = (...args) => {
                if (allCheckboxAreaClick.value) {
                    updateBulkSelectedAssets(...args)
                }
                useAddEvent('discovery', 'asset_card', 'clicked', {
                    click_index: args[1],
                })
                if (handlePreview && !disableHandlePreview.value) {
                    handlePreview(...args)
                }
            }

            const handleSearchChange = useDebounceFn(() => {
                offset.value = 0
                sendSearchEvent()
                quickChange()
            }, 100)

            const handleFilterChange = (filterItem) => {
                sendFilterEvent(filterItem)
                offset.value = 0
                quickChange()
                discoveryStore.setActiveFacet(facets.value)
            }

            const handleAssetTypeChange = (tabName) => {
                offset.value = 0
                quickChange()
                if (page.value !== 'admin')
                    discoveryStore.setActivePostFacet(postFacets.value)
                useAddEvent('discovery', 'aggregate_tab', 'changed', {
                    name: tabName,
                })
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
                facets.value = { ...initialFilters.value }
                queryText.value = ''
                handleFilterChange()
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

            const keys = useMagicKeys()
            const { tab, shift_tab } = keys

            const handleFocusOnInput = () => {
                // sear.value?.focus()
                searchBox?.value?.focusInput()
            }

            const { allowedTabShortcut } = useShortcuts()

            whenever(tab, () => {
                console.log('tab allowedTabShortcut', allowedTabShortcut.value)
                if (
                    shift_tab.value ||
                    isCmndKVisible.value ||
                    !allowedTabShortcut.value
                ) {
                    // don't run if cmd k is on
                    return
                }
                rotateAggregateTab(1, handleFocusOnInput)
            })

            whenever(shift_tab, () => {
                if (isCmndKVisible.value || !allowedTabShortcut.value) {
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
                watchOnce(isLoading, (v) => {
                    if (!v && list.value?.length && page.value === 'assets') {
                        const isNone =
                            typeof selectedAsset.value === 'object' &&
                            Object.keys(selectedAsset.value).length === 0
                        if (isNone) handleClickAssetItem(list.value[0])
                        else {
                            handleClickAssetItem(selectedAsset.value)
                        }
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
