<template>
    <div class="flex flex-col w-full">
        <div class="px-2 pt-5 pb-4 bg-gray-100">
            <SearchAndFilter
                v-model:value="queryText"
                class="mx-3 mb-5 bg-white"
                placeholder="Search"
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

            <AssetTabs
                v-model="selectedTab"
                class="mt-1"
                @update:model-value="handleTabChange"
                :asset-type-list="assetTypeList"
                :asset-type-map="assetTypeMap"
                :total="totalSum"
            ></AssetTabs>
        </div>

        <div v-if="list && list.length <= 0 && !isLoading" class="flex-grow">
            <EmptyView @event="handleClearFiltersFromList"></EmptyView>
        </div>
        <AssetList
            v-else
            class="pt-2 bg-white asset-list-height"
            :list="list"
            :score="searchScoreList"
            :projection="projection"
            :is-loading="isLoading"
            :is-load-more="isLoadMore"
            :typename="assetTypeListString"
            v-model:autoSelect="autoSelect"
            @loadMore="loadMore"
            @bulkSelectChange="(list) => $emit('bulkSelectChange', list)"
        ></AssetList>
    </div>
</template>

<script lang="ts">
    import EmptyView from '@common/empty/discover.vue'
    import AssetPagination from '@common/pagination/index.vue'
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'
    import { useDebounceFn } from '@vueuse/core'
    import {
        computed,
        defineComponent,
        ref,
        watch,
        toRefs,
        PropType,
        Ref,
    } from 'vue'
    import AssetTabs from '~/components/discovery/list/assetTypeTabs.vue'
    import Preferences from '~/components/discovery/list/preference.vue'
    import AssetList from '~/components/discovery/list/assetList.vue'
    import AssetFilters from '~/components/discovery/filters/discoveryFilters.vue'
    import AssetDropdown from '~/components/common/dropdown/assetDropdown.vue'
    import ConnectorDropdown from '~/components/common/dropdown/connectorDropdown.vue'

    import {
        useAssetListing,
        useAssetAggregation,
    } from '@/discovery/useAssetListing'
    import useDiscoveryPreferences from '~/composables/preference/useDiscoveryPreference'
    import { AssetTypeList } from '~/constant/assetType'
    import {
        BaseAttributes,
        BasicSearchAttributes,
        tableauAttributes,
    } from '~/constant/projection'
    // TODO: Uncomment all tracing related code
    // import useTracking from '~/modules/tracking'

    import { useFilteredTabs } from '@/discovery/useTabMapped'
    import useFilterPayload from '~/components/discovery/filters/useFilterPayload'

    export default defineComponent({
        name: 'DiscoveryList',
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
            dataMap: {
                type: Object as PropType<any>,
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
        },
        emits: ['preview', 'bulkSelectChange'],
        setup(props, { emit }) {
            const { dataMap } = toRefs(props)

            const autoSelect = ref(true)

            // const tracking = useTracking()
            // const events = tracking.getEventsName()
            const isAggregate = ref(true)

            // Clean Stuff
            const AllFilters: Ref = ref({
                searchText: '',
                selectedTab: 'Catalog',
            })

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

            const termName = ref<string | undefined>()

            // This is the actual filter body
            // FIXME: Can we make it a computed property?\
            const { payload: filters } = useFilterPayload(dataMap)

            const limit = ref(20)
            const offset = ref(0)
            const sortOrder = ref('default')
            const state = ref('active')

            // Get All Disoverable Asset Types
            const initialTabs: Ref<string[]> = computed(() =>
                useFilteredTabs({ connector: undefined, category: undefined })
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

            // Push all asset type
            const isLoadMore = computed(
                () => totalCount.value > list.value.length
            )

            const updateBody = () => {
                const initialBody = {
                    typeName: assetTypeListString.value,
                    termName: props.termName ?? termName.value,
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

            function handleTabChange() {
                isAggregate.value = false
                offset.value = 0
                updateBody()
            }

            const { projection } = useDiscoveryPreferences()
            const handleSearchChange = useDebounceFn(() => {
                offset.value = 0
                isAggregate.value = true
                updateBody()
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

            const termNameChange = (termQName: string) => {
                termName.value = termQName
                isAggregate.value = true
                updateBody()
            }

            const loadMore = () => {
                autoSelect.value = false
                offset.value += limit.value
                isAggregate.value = false
                updateBody()
            }

            const handleClearFiltersFromList = () => {
                queryText.value = ''
            }

            watch(dataMap, () => {
                updateBody()
            })
            return {
                autoSelect,
                handleClearFiltersFromList,
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
                queryText,
                totalCount,
                isLoadMore,
                loadMore,
                totalSum,
                handleState,
                mutateAssetInList,
                handleTabChange,
                filters,
                assetTypeListString,
                termNameChange,
            }
        },
    })
</script>

<style scoped>
    .asset-list-height {
        max-height: calc(100vh - 23rem);
    }
</style>
