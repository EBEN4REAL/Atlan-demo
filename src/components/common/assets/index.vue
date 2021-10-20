<template>
    <div class="flex flex-col overflow-hidden">
        <div class="px-2 pt-5 pb-4 bg-gray-100 border-b">
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
            class="pt-2 bg-white"
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
    import {
        generateAggregationDSL,
        generateAssetQueryDSL,
    } from '@/discovery/useDiscoveryDSL'

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
                type: Object as PropType<Record<string, any>>,
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
            const { dataMap: facets } = toRefs(props)

            const autoSelect = ref(true)

            // const tracking = useTracking()
            // const events = tracking.getEventsName()
            const isAggregate = ref(true)

            // Temporary, not saved in url
            const limit = ref(20)
            const offset = ref(0)

            // Permanents
            const selectedTab = ref('Catalog')
            const queryText = ref('')
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
                assetTypeList.value?.forEach((element) => {
                    if (assetTypeMap.value?.[element.id]) {
                        sum += assetTypeMap.value?.[element.id]
                    }
                })
                return sum
            })

            const totalCount = computed(() => {
                if (selectedTab.value == 'Catalog') {
                    return totalSum.value
                }
                return assetTypeMap.value?.[selectedTab.value]
            })

            // Push all asset type
            const isLoadMore = computed(
                () => totalCount.value > list.value.length
            )

            const updateBody = () => {
                const initialBody = {
                    relationAttributes: [
                        'readme',
                        'displayText',
                        'name',
                        'description',
                        'shortDescription',
                    ],
                    dsl: {
                        size: limit.value,
                        from: offset.value,
                        ...generateAssetQueryDSL(
                            facets.value,
                            queryText.value,
                            selectedTab.value
                        ),
                    },
                    attributes: [
                        ...BaseAttributes,
                        ...BasicSearchAttributes,
                        ...tableauAttributes,
                    ],
                }
                replaceBody(initialBody)
                if (isAggregate.value)
                    refreshAggregation({
                        dsl: generateAggregationDSL(
                            facets.value,
                            queryText.value
                        ),
                    })
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

            const loadMore = () => {
                autoSelect.value = false
                offset.value += limit.value
                isAggregate.value = false
                updateBody()
            }

            const handleClearFiltersFromList = () => {
                queryText.value = ''
            }

            watch(
                facets,
                () => {
                    updateBody()
                },
                { immediate: true }
            )
            return {
                autoSelect,
                handleClearFiltersFromList,
                facets,
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
                assetTypeListString,
            }
        },
    })
</script>
