<template>
    <div class="flex w-full">
        <div
            v-if="showFilters"
            class="flex flex-col h-full overflow-y-auto bg-gray-100 border-r border-gray-300  facets"
        >
            <AssetFilters
                v-model="facets"
                @change="handleFilterChange"
            ></AssetFilters>
        </div>
        <div class="flex flex-col items-stretch flex-1 mb-1 w-80">
            <div class="flex flex-col h-full">
                <div class="px-3 py-1 border-b border-gray-200">
                    <SearchAdvanced v-model:value="queryText" :autofocus="true">
                        <template #postFilter>
                            <Preferences />
                        </template>
                    </SearchAdvanced>
                </div>

                <div class="w-full px-4">
                    <AggregationTabs
                        class="mt-3"
                        v-model="postFacets.typeName"
                        :list="assetTypeAggregationList"
                        @change="handleAssetTypeChange"
                    >
                        <a-popover
                            trigger="click"
                            placement="bottomLeft"
                            class=""
                        >
                            <template #content>
                                <div
                                    class="flex flex-col py-1 rounded  gap-y-3 preference-container"
                                ></div>
                            </template>

                            <div
                                class="flex items-center hover:text-primary"
                                :class="$style.tab"
                            >
                                <AtlanIcon icon="Globe" class="w-auto h-5" />
                                <AtlanIcon icon="ChevronDown" class="w-3 h-3" />
                            </div>
                        </a-popover>
                    </AggregationTabs>
                </div>

                <!-- <div
                    class="flex items-center justify-center flex-grow"
                    v-if="isLoading"
                >
                    <AtlanIcon
                        icon="Loader"
                        class="w-auto h-10 animate-spin"
                    ></AtlanIcon>
                </div> -->
                <!--       <div
                    class="flex-grow"
                    v-else-if="list.length === 0 && !isLoading"
                >
                    <EmptyView></EmptyView>
                </div> -->

                <AssetList
                    ref="assetlistRef"
                    :list="list"
                    @loadMore="handleLoadMore"
                    :isLoadMore="isLoadMore"
                    :isLoading="isLoading"
                    @preview="handlePreview"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch, Ref } from 'vue'
import EmptyView from '@common/empty/discover.vue'
// import AssetPagination from '@common/pagination/index.vue'

// import { useDebounceFn } from '@vueuse/core'

// import { useRouter } from 'vue-router'
import SearchAdvanced from '@/common/input/searchAdvanced.vue'
import AggregationTabs from '@/common/tabs/aggregationTabs.vue'
import Preferences from '@/discovery/preference.vue'
import AssetList from '~/components/discovery/list/assetList.vue'
import AssetFilters from '@/discovery/filters/index.vue'

import useIndexSearch from '~/composables/discovery/useIndexSearch'
import { useAssetListing } from '~/composables/discovery/useAssetListing'
import {
    AssetAttributes,
    AssetRelationAttributes,
    InternalAttributes,
    SQLAttributes,
} from '~/constant/projection'
import useEvaluate from '~/composables/auth/useEvaluate'
import { useDiscoverList } from '~/composables/discovery/useDiscoverList'
// import AssetDropdown from '~/components/common/dropdown/assetDropdown.vue'
// import ConnectorDropdown from '~/components/common/dropdown/connectorDropdown.vue'

// import { useAssetListing, useAssetAggregation } from './useAssetListing'
// import useDiscoveryPreferences from '~/composables/preference/useDiscoveryPreference'
// import { AssetTypeList } from '~/constant/assetType'
// import {
//     BaseAttributes,
//     BasicSearchAttributes,
//     tableauAttributes,
//     SavedQueryAttributes,
// } from '~/constant/projection'
// // TODO: Uncomment all tracing related code
// // import useTracking from '~/modules/tracking'

// import { decodeQuery, serializeQuery } from '~/utils/helper/routerHelper'

// import useBusinessMetadataStore from '~/store/businessMetadata'
// import { useFilteredTabs } from './useTabMapped'
// import useFilterUtils from './filters/useFilterUtils'
// import {
//     generateAggregationDSL,
//     generateAssetQueryDSL,
//     generateAssetPostQueryDSL,
// } from './useDiscoveryDSL'

import { assetTypeList } from '~/constant/assetType'

export default defineComponent({
    name: 'AssetDiscovery',
    components: {
        AssetList,
        AggregationTabs,
        AssetFilters,
        SearchAdvanced,
        Preferences,
        EmptyView,

        // AssetPagination,
        // ConnectorDropdown,
        // Preferences,
        // EmptyView,
        // AssetDropdown,
        // SearchAndFilter,
        // AssetCategoryFilter,
    },
    props: {
        showFilters: {
            type: Boolean,
            required: false,
            default: true,
        },
    },
    setup(props, { emit }) {
        const showFilters = ref(props.showFilters)
        const limit = ref(20)
        const offset = ref(0)
        const queryText = ref('')
        const facets = ref({})
        const aggregations = ref({})
        const postFacets = ref({})
        const dependentKey = ref('DISCOVERY')
        const defaultAttributes = ref([
            ...InternalAttributes,
            ...AssetAttributes,
            ...SQLAttributes,
        ])
        const relationAttributes = ref([...AssetRelationAttributes])

        if (!facets.value.typeName) {
            facets.value.typeName = '__all'
        }

        // const {
        //     handleFacetDSL,
        //     handlePostFacetDSL,
        //     handleAggregationDSL,
        //     getAssetTypeList,
        //     handleSelectedAsset,
        // } = useAssetListing()

        // const body = ref({
        //     dsl: {
        //         size: limit.value,
        //         from: offset.value,
        //         ...handleFacetDSL(facetMap.value),
        //         ...handleAggregationDSL(facetMap.value),
        //         post_filter: handlePostFacetDSL(facetMap.value)?.query,
        //     },
        //     attributes: [
        //         ...InternalAttributes,
        //         ...AssetAttributes,
        //         ...SQLAttributes,
        //     ],
        //     relationAttributes: [...AssetRelationAttributes],
        // })

        const { list, isLoading, assetTypeAggregationList, isLoadMore, fetch } =
            useDiscoverList(
                true,
                dependentKey,
                queryText,
                facets,
                aggregations,
                postFacets,
                limit,
                offset,
                defaultAttributes,
                relationAttributes
            )

        const handlePreview = (item) => {
            handleSelectedAsset(item)
        }

        // watch(data, () => {
        //     // if (!isLoading.value.value) {
        //     //     const entities = list.value.map((i) => ({
        //     //         typeName: i.typeName,
        //     //         entityGuid: i.guid,
        //     //         action: 'ENTITY_UPDATE',
        //     //     }))
        //     //     useEvaluate(
        //     //         {
        //     //             entities,
        //     //         },
        //     //         ref('DEFAULT_EVALUATE'),
        //     //         null,
        //     //         false
        //     //     )
        //     // }
        // })

        // const assetCategoryFilter = ref([])
        // // Initialization via IIFE
        // ;(() => {
        //     const qry = decodeQuery(
        //         Object.keys(router.currentRoute.value?.query)[0]
        //     )
        //     if (qry.selectedTab) selectedTab.value = qry.selectedTab
        //     if (qry.queryText) queryText.value = qry.queryText
        //     if (qry.sortOrder) sortOrder.value = qry.sortOrder
        //     if (qry.state) state.value = qry.state
        //     if (qry.facets) facets.value = qry.facets
        //     if (qry.category) assetCategoryFilter.value = qry.category
        // })()
        // // Get All Disoverable Asset Types
        // const applicableTabs: Ref<string[]> = computed(() =>
        //     useFilteredTabs({
        //         connector: facets.value?.connector,
        //         category: assetCategoryFilter.value,
        //     })
        // )
        // const assetTypeList = computed(() => {
        //     const filteredTabs = AssetTypeList.filter(
        //         (item) =>
        //             item.isDiscoverable == true &&
        //             applicableTabs.value.includes(item.id)
        //     )
        //     return [
        //         {
        //             id: 'Catalog',
        //             label: 'All',
        //         },
        //         ...filteredTabs,
        //     ]
        // })
        // const {
        //     list,
        //     replaceBody,
        //     assetTypeMap,
        //     isLoading,
        //     searchScoreList,
        //     mutateAssetInList,
        // } = useAssetListing('', false)
        // // const { assetTypeMap, refreshAggregation } = useAssetAggregation(
        // //     '',
        // //     false
        // // )
        // const store = useBusinessMetadataStore()
        // const BMListLoaded = computed(
        //     () => store.getBusinessMetadataListLoaded
        // )
        // const BMAttributeProjection = computed(
        //     () => store.getBusinessMetadataListProjections
        // )
        // const assetTypeLabel = computed(() => {
        //     const found = AssetTypeList.find(
        //         (item) => item.id == selectedTab.value
        //     )
        //     return found?.label
        // })
        // const totalSum = computed(() => {
        //     let sum = 0
        //     assetTypeList.value?.forEach((element) => {
        //         if (assetTypeMap.value?.[element.id]) {
        //             sum += assetTypeMap.value?.[element.id]
        //         }
        //     })
        //     return sum
        // })

        // const placeholderLabel: Ref<Record<string, string>> = ref({})
        // const dynamicSearchPlaceholder = computed(() => {
        //     let placeholder = 'Search assets across Atlan...'
        //     if (placeholderLabel.value.asset) {
        //         placeholder = `Search for assets in ${placeholderLabel.value.asset}`
        //     } else if (placeholderLabel.value.connector) {
        //         placeholder = `Search for assets in ${placeholderLabel.value.connector}`
        //     }
        //     return placeholder
        // })
        // function setPlaceholder(label: string, type: string) {
        //     placeholderLabel.value[type] = label
        //     if (type === 'connector') placeholderLabel.value.asset = ''
        // }
        // // Push all asset type

        // const updateBody = () => {
        //     const initialBody = {
        //         relationAttributes: [
        //             'readme',
        //             'displayText',
        //             'name',
        //             'description',
        //             'shortDescription',
        //         ],
        //         dsl: {
        //             size: limit.value,
        //             from: offset.value,
        //             post_filter: generateAssetPostQueryDSL(
        //                 facets.value,
        //                 queryText.value,
        //                 selectedTab.value,
        //                 applicableTabs.value
        //             ).query,
        //             ...generateAggregationDSL(),
        //             ...generateAssetQueryDSL(
        //                 facets.value,
        //                 queryText.value,
        //                 selectedTab.value,
        //                 applicableTabs.value
        //             ),
        //         },
        //         attributes: [
        //             ...BaseAttributes,
        //             ...BasicSearchAttributes,
        //             ...tableauAttributes,
        //             ...SavedQueryAttributes,
        //             ...BMAttributeProjection.value,
        //         ],
        //     }
        //     if (state.value) {
        //         // if (state.value === 'all') {
        //         //     initialBody.excludeDeletedEntities = false
        //         // } else if (state.value === 'archived') {
        //         //     initialBody.excludeDeletedEntities = false
        //         //     initialBody.entityFilters.criterion.push({
        //         //         attributeName: '__state',
        //         //         attributeValue: 'DELETED',
        //         //         operator: 'eq',
        //         //     })
        //         // } else {
        //         //     initialBody.excludeDeletedEntities = true
        //         // }
        //     }
        //     if (sortOrder.value !== 'default') {
        //         // const split = sortOrder.value.split('|')
        //         // if (split.length > 1) {
        //         //     initialBody.sortBy = split[0]
        //         //     initialBody.sortOrder = split[1].toUpperCase()
        //         // }
        //     } else {
        //         // delete initialBody.sortBy
        //         // delete initialBody.sortOrder
        //     }
        //     replaceBody(initialBody)
        //     // if (isAggregate.value)
        //     //     refreshAggregation({
        //     //         dsl: generateAggregationDSL(
        //     //             facets.value,
        //     //             queryText.value
        //     //         ),
        //     //     })
        // }
        // const { generateFacetConfigForRouter } = useFilterUtils(facets)
        // const setRouterOptions = () => {
        //     const routerOptions: Record<string, any> = {}
        //     const urlFacets = generateFacetConfigForRouter()
        //     if (Object.keys(urlFacets).length)
        //         routerOptions.facets = urlFacets
        //     if (queryText.value) routerOptions.queryText = queryText.value
        //     if (selectedTab.value !== 'Catalog')
        //         routerOptions.selectedTab = selectedTab.value
        //     if (sortOrder.value !== 'default')
        //         routerOptions.sortOrder = sortOrder.value
        //     if (state.value !== 'active') routerOptions.state = state.value
        //     if (assetCategoryFilter.value.length)
        //         routerOptions.category = assetCategoryFilter.value
        //     const routerQuery = serializeQuery(routerOptions)
        //     router.push(`/assets?${routerQuery}`)
        // }
        // function handleTabChange() {
        //     isAggregate.value = false
        //     offset.value = 0
        //     updateBody()
        //     setRouterOptions()
        // }
        // const { projection } = useDiscoveryPreferences()
        // const handleSearchChange = useDebounceFn(() => {
        //     offset.value = 0
        //     isAggregate.value = true
        //     updateBody()
        //     setRouterOptions()
        //     // tracking.send(events.EVENT_ASSET_SEARCH, {
        //     //     trigger: 'discover',
        //     // })
        // }, 150)
        // const handleChangePreferences = (payload: any) => {
        //     projection.value = payload
        // }
        // const handleChangeSort = (payload: any) => {
        //     sortOrder.value = payload
        //     isAggregate.value = false
        //     updateBody()
        // }
        // const handleState = (payload: any) => {
        //     state.value = payload
        //     isAggregate.value = true
        //     updateBody()
        // }
        // function handleCategoryChange() {
        //     offset.value = 0
        //     isAggregate.value = true
        //     updateBody()
        //     setRouterOptions()
        // }

        const handleFilterChange = () => {
            // body.value = {
            //     dsl: {
            //         size: limit.value,
            //         from: offset.value,
            //         ...handleFacetDSL(facetMap.value),
            //         ...handleAggregationDSL(facetMap.value),
            //         post_filter: handlePostFacetDSL(facetMap.value)?.query,
            //     },
            //     attributes: [
            //         ...InternalAttributes,
            //         ...AssetAttributes,
            //         ...SQLAttributes,
            //     ],
            //     relationAttributes: [...AssetRelationAttributes],
            // }
            // refresh()
        }

        const handleAssetTypeChange = () => {
            // assetlistRef.value.scrollTop = 0
            // offset.value = 0
            fetch()
        }

        // function handleFilterChange(filterMapData: Record<string, any>) {
        //     facets.value = filterMapData
        //     offset.value = 0
        //     isAggregate.value = true
        //     console.log(facets.value)
        //     updateBody()
        //     setRouterOptions()
        // }
        // // function handlePreview = (item) => {
        // //     emit('preview', item)
        // // }

        const handleLoadMore = () => {
            // const found = assetTypeMappedList.value.find(
            //     (i) => i.id === facetMap.value.typeName
            // )
            // if (found) {
            //     if (list.value.length < found.count) {
            //         offset.value += limit.value
            //     }
            //     body.value = {
            //         dsl: {
            //             size: limit.value,
            //             from: offset.value,
            //             ...handleFacetDSL(facetMap.value),
            //             ...handleAggregationDSL(facetMap.value),
            //             post_filter: handlePostFacetDSL(facetMap.value)
            //                 ?.query,
            //         },
            //         attributes: [
            //             ...InternalAttributes,
            //             ...AssetAttributes,
            //             ...SQLAttributes,
            //         ],
            //         relationAttributes: [...AssetRelationAttributes],
            //     }
            //     refresh(true)
            // }
        }
        // function loadMore() {
        //     autoSelect.value = false
        //     offset.value += limit.value
        //     isAggregate.value = false
        //     updateBody()
        // }
        // function handleClearFiltersFromList() {
        //     queryText.value = ''
        //     assetFilterRef.value?.resetAllFilters()
        // }
        // watch(
        //     BMListLoaded,
        //     (val) => {
        //         if (val) {
        //             isAggregate.value = true
        //             try {
        //                 updateBody()
        //             } catch (error) {
        //                 console.error(error)
        //             }
        //         }
        //     },
        //     { immediate: true }
        // )
        // console.log(list)
        // return {
        //     autoSelect,
        //     handleClearFiltersFromList,
        //     handleCategoryChange,
        //     assetFilterRef,
        //     applicableTabs,
        //     searchScoreList,
        //     list,
        //     selectedTab,
        //     assetCategoryFilter,
        //     assetTypeLabel,
        //     assetTypeList,
        //     assetTypeMap,
        //     isAggregate,
        //     handleSearchChange,
        //     projection,
        //     handleChangePreferences,
        //     handleChangeSort,
        //     isLoading,
        //     handleFilterChange,
        //     // handlePreview,
        //     queryText,
        //     facets,
        //     totalCount,
        //     assetlist,
        //     isLoadMore,
        //     loadMore,
        //     totalSum,
        //     handleState,
        //     mutateAssetInList,
        //     handleTabChange,
        //     dynamicSearchPlaceholder,
        //     setPlaceholder,
        //     placeholderLabel,
        // }

        return {
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
        }
    },
    // data() {
    //     return {
    //         activeKey: '',
    //         debounce: null,
    //     }
    // },
})
</script>

<style scoped>
.facets {
    max-width: 264px;
    width: 25%;
}
</style>

<style lang="less" module>
.tab {
    @apply bg-white text-sm !important;
    border: 1px solid #e6e6eb;
    border-radius: 24px !important;
    border: 1px solid #e6e6eb !important;

    padding: 3px 8px !important;
    box-shadow: 0px 2px 0px rgba(0, 0, 0, 0.05) !important;

    transition: all 0.8s ease-out;
}
</style>
