<template>
    <div class="flex w-full h-full">
        <div class="flex flex-col w-full h-full">
            <div class="flex w-full">
                <SearchAdvanced
                    :key="searchDirtyTimestamp"
                    v-model="queryText"
                    :autofocus="true"
                    :allow-clear="true"
                    :class="searchBarClass"
                    :size="searchBarSize"
                    :placeholder="placeholder"
                    @change="handleSearchChange"
                >
                    <template #postFilter>
                        <div style="max-width: 330px">
                            <PreferenceSelector
                                v-model="preference"
                                @change="fetchList(0)"
                            />
                        </div>
                    </template>
                </SearchAdvanced>
                <slot name="searchAction"></slot>
            </div>
            <div v-if="list.length !== 0" :class="aggregationTabClass">
                <AggregationTabs
                    v-model="postFilters.typeName"
                    class="mt-3"
                    :list="assetTypeAggregationList"
                    @change="fetchList(0)"
                />
            </div>
            <div
                v-if="isValidating && !list.length"
                class="flex items-center justify-center h-full"
            >
                <AtlanLoader class="h-10" />
            </div>
            <div
                v-else-if="!isValidating && error"
                class="flex items-center justify-center h-full"
            >
                <ErrorView></ErrorView>
            </div>
            <div v-if="list.length === 0 && !isValidating" class="h-full">
                <EmptyView
                    empty-screen="NoAssetsFound"
                    image-class="h-44"
                    :desc="
                        queryText
                            ? 'We didn\'t find anything that matches your search criteria'
                            : emptyViewText
                    "
                    :button-text="queryText ? 'Clear search' : null"
                    class="flex items-center justify-center h-full mt-4"
                    @event="handleClearSearch"
                ></EmptyView>
            </div>
            <div
                v-else
                class="overflow-auto"
                :class="assetListClass"
                :style="assetListStyleObj"
            >
                <AssetList
                    :list="list"
                    :is-load-more="isLoadMore"
                    :is-loading="isValidating"
                    @loadMore="handleLoadMore"
                >
                    <template #default="{ item }">
                        <AssetItem
                            :asset-name-truncate-percentage="
                                assetNameTruncatePercentage
                            "
                            :open-asset-profile-in-new-tab="
                                openAssetProfileInNewTab
                            "
                            :bulk-select-mode="
                                selectedItems && selectedItems.length
                                    ? true
                                    : false
                            "
                            :enable-sidebar-drawer="enableSidebarDrawer"
                            :preference="preference"
                            :item="item"
                            :show-check-box="selectable"
                            :is-checked="checkIfSelected(item.guid)"
                            :class="assetItemClass"
                            @updateDrawer="updateList"
                            @preview="$emit('handleAssetCardClick', item)"
                            @listItem:check="
                                (e, item) => $emit('listItem:check', item)
                            "
                        >
                            <template #cta>
                                <slot :item="item" name="assetItemCta"> </slot>
                            </template>
                        </AssetItem>
                    </template>
                </AssetList>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        ref,
        computed,
        toRefs,
        watch,
        PropType,
    } from 'vue'
    import { useDebounceFn } from '@vueuse/core'
    import EmptyView from '@common/empty/index.vue'
    import ErrorView from '@common/error/discover.vue'
    import SearchAdvanced from '@/common/input/searchAdvanced.vue'
    import AggregationTabs from '@/common/tabs/aggregationTabs.vue'
    import PreferenceSelector from '@/assets/preference/index.vue'
    import AssetList from '@/common/assets/list/index.vue'
    import AssetItem from '@/common/assets/list/assetItem.vue'
    import useAssetStore from '~/store/asset'
    import useFetchAssetList from './usefetchAssetList'
    import useTypedefData from '~/composables/typedefs/useTypedefData'
    import {
        AssetAttributes,
        InternalAttributes,
        SQLAttributes,
    } from '~/constant/projection'

    export default defineComponent({
        name: 'AssetListComponent',
        components: {
            SearchAdvanced,
            AggregationTabs,
            PreferenceSelector,
            AssetList,
            AssetItem,
            EmptyView,
            ErrorView,
        },
        props: {
            /**
             * @example { owners: {ownerUsers: ['harrypotter']} }
             * It uses discovery's useBody composable under the hood, anything that works there, you can pass here.
             * @see {@link src/composables/discovery/useBody.ts}
             */
            filters: {
                type: Object,
                default: () => {},
            },
            /**
             * Enables sidebar on asset card click; If you turn it off, you can also listen to `handleAssetCardClick` event that this component emits to implement custom functionality
             */
            enableSidebarDrawer: {
                type: Boolean,
                default: false,
                required: false,
            },
            openAssetProfileInNewTab: {
                type: Boolean,
                default: false,
            },
            emptyViewText: {
                type: String,
                default: 'No assets found',
            },
            assetNameTruncatePercentage: {
                type: String,
                default: '95%',
                required: false,
            },
            /** First cacheKey for assetList as we are using SWRV by default and we need a cacheKey, On subsequent fetching the key is replaced by timestamp. Try to pass this to according to your use case; shouldn't create much havoc in case you don't; Do pass it when using multiple instances of this component at the same place, though!  */
            initialCacheKey: {
                type: String,
                default: 'ASSET_LIST',
                required: false,
            },
            /** Asset attributes to be fetched; If you don't pass these, it'll use `defaultAttributes` 👇  */
            attributes: {
                type: Array,
                default: () => [],
            },
            /** Whether the list items are selectable are not. Pass true to show checkboxes */
            selectable: {
                type: Boolean,
                required: false,
                default: false,
            },
            /** List of GUIDs for the selected items */
            selectedItems: {
                type: Array as PropType<Array<string>>,
                required: false,
                default: () => [],
            },
            // custom placeholder for searchbar : will be given priority over computed placeholder
            customPlaceholder: {
                type: String,
                required: false,
                default: '',
            },

            /** Style Props */
            assetListClass: {
                type: String,
                default: '',
            },
            assetItemClass: {
                type: String,
                default: '',
            },
            assetListStyleObj: {
                type: Object,
                default: () => {},
            },
            aggregationTabClass: {
                type: String,
                default: '',
            },
            searchBarClass: {
                type: String,
                default: '',
            },
            /**
             * ref: https://linear.app/atlanproduct/issue/META-2830/add-flag-to-suppress-ranger-logs-in-indexsearch-api
             */
            suppressLogs: {
                type: Boolean,
                default: true,
                required: false,
            },
            searchBarSize: {
                type: String,
                default: 'large',
                required: false,
            },
        },
        emits: ['handleAssetCardClick', 'listItem:check'],
        setup(props) {
            const limit = ref(20)
            const offset = ref(0)
            const queryText = ref('')
            const preference = ref({ sort: 'default', display: [] })
            const postFilters = ref({
                typeName: '__all',
            })
            const aggregations = ref(['typeName'])
            const isCache = ref(true) // use SWRV or not

            /**
             * CacheKey for swrv, when changed causes asset list to get refetched
             */
            const dependentKey = ref(props.initialCacheKey)

            /**
             * needed for search component, otherwise clearing queryText from here doesn't get reflected in there
             */
            const searchDirtyTimestamp = ref(`dirty_${Date.now().toString()}`)

            // set all the attributes that would be fetched
            const { customMetadataProjections } = useTypedefData()
            const defaultAttributes = ref([
                ...InternalAttributes,
                ...AssetAttributes,
                ...SQLAttributes,
                ...customMetadataProjections,
            ])

            // Preferences are to be shared for all asset lists
            const discoveryStore = useAssetStore()

            if (discoveryStore.preferences) {
                preference.value.sort =
                    discoveryStore.preferences.sort || preference.value.sort
                preference.value.display =
                    discoveryStore.preferences.display ||
                    preference.value.display
            }

            const {
                filters,
                attributes,
                selectable,
                selectedItems,
                suppressLogs,
            } = toRefs(props)

            const {
                list,
                isLoadMore,
                quickChange,
                isValidating,
                assetTypeAggregationList,
                updateList,
                error,
            } = useFetchAssetList({
                queryText,
                offset,
                limit,
                facets: filters,
                postFacets: postFilters,
                aggregations,
                preference,
                isCache,
                dependentKey,
                attributes: attributes.value.length
                    ? attributes
                    : defaultAttributes,
                suppressLogs: suppressLogs?.value,
            })

            const fetchList = (skip = 0) => {
                offset.value = skip
                quickChange()
            }

            // LOAD MORE
            const handleLoadMore = () => {
                if (isLoadMore.value) {
                    fetchList((offset.value += limit.value))
                }
            }

            // SEARCH
            const handleSearchChange = useDebounceFn(() => {
                fetchList()
            }, 100)
            const handleClearSearch = () => {
                queryText.value = ''
                searchDirtyTimestamp.value = `dirty_${Date.now().toString()}`
                fetchList()
            }

            const placeholder = computed(() => {
                if (props.customPlaceholder) {
                    return props.customPlaceholder
                }
                const found = assetTypeAggregationList.value.find(
                    (item) => item.id === postFilters.value.typeName
                )

                if (found) {
                    return `Search ${found?.label?.toLowerCase()} assets`
                }
                return 'Search all assets'
            })

            const checkIfSelected = (guid: string) => {
                if (!selectable.value) return false
                return selectedItems.value.includes(guid)
            }

            watch(
                [filters, postFilters, aggregations],
                () => {
                    fetchList()
                },
                { deep: true }
            )

            return {
                limit,
                offset,
                queryText,
                list,
                preference,
                filters,
                postFilters,
                isLoadMore,
                isValidating,
                assetTypeAggregationList,
                searchDirtyTimestamp,
                error,
                placeholder,
                updateList,
                fetchList,
                handleLoadMore,
                handleSearchChange,
                handleClearSearch,
                checkIfSelected,
                quickChange,
            }
        },
    })
</script>

<style></style>
