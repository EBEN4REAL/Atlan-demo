<template>
    <div class="flex w-full">
        <div
            v-if="showFilters"
            class="flex flex-col hidden h-full overflow-y-auto bg-gray-100 border-r border-gray-300  md:block facets"
        >
            <AssetFilters
                v-model="facets"
                @change="handleFilterChange"
                v-if="showFilters"
            ></AssetFilters>
        </div>

        <div class="flex flex-col items-stretch flex-1 mb-1 w-80">
            <div class="flex flex-col h-full">
                <div class="flex px-3 py-1 border-b border-gray-200">
                    <SearchAdvanced
                        v-model="queryText"
                        :autofocus="true"
                        @change="handleSearchChange"
                    >
                        <template #filter>
                            <a-popover
                                class="sm:block md:hidden"
                                placement="bottom"
                                :trigger="['click']"
                                :overlay-class-name="$style.filterPopover"
                            >
                                <template #content
                                    ><AssetFilters
                                        v-model="facets"
                                        :isAccordion="true"
                                        @change="handleFilterChange"
                                    ></AssetFilters
                                ></template>
                                <AtlanIcon
                                    icon="FilterFunnel"
                                    class="mr-1"
                                ></AtlanIcon>
                            </a-popover>
                        </template>
                        <template #postFilter>
                            <Preferences />
                        </template>
                    </SearchAdvanced>
                </div>

                <div class="w-full px-4">
                    <AggregationTabs
                        v-model="postFacets.typeName"
                        class="mt-3"
                        :list="assetTypeAggregationList"
                        @change="handleAssetTypeChange"
                    >
                        <a-popover trigger="click" placement="bottomLeft">
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

                <div
                    v-if="isLoading"
                    class="flex items-center justify-center flex-grow"
                >
                    <AtlanIcon
                        icon="Loader"
                        class="w-auto h-10 animate-spin"
                    ></AtlanIcon>
                </div>
                <div
                    v-else-if="list.length === 0 && !isLoading"
                    class="flex-grow"
                >
                    <EmptyView></EmptyView>
                </div>

                <AssetList
                    v-else
                    ref="assetlistRef"
                    :list="list"
                    :isLoadMore="isLoadMore"
                    :isLoading="isValidating"
                    @preview="handlePreview"
                    @loadMore="handleLoadMore"
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
    import { useDebounceFn } from '@vueuse/core'
    import SearchAdvanced from '@/common/input/searchAdvanced.vue'
    import AggregationTabs from '@/common/tabs/aggregationTabs.vue'
    import Preferences from '@/assets/preference/index.vue'
    import AssetList from '@/assets/list/assetList.vue'
    import AssetFilters from '@/assets/filters/index.vue'

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
    import AtlanIcon from '../common/icon/atlanIcon.vue'

    export default defineComponent({
        name: 'AssetDiscovery',
        components: {
            AssetList,
            AggregationTabs,
            AssetFilters,
            SearchAdvanced,
            Preferences,
            EmptyView,
            AtlanIcon,
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
            const aggregations = ref(['typeName'])
            const postFacets = ref({})
            const dependentKey = ref('DEFAULT_TABLE')
            const defaultAttributes = ref([
                ...InternalAttributes,
                ...AssetAttributes,
                ...SQLAttributes,
            ])
            const relationAttributes = ref([...AssetRelationAttributes])

            if (!facets.value.typeName) {
                facets.value.typeName = '__all'
            }

            const {
                list,
                isLoading,
                assetTypeAggregationList,
                isLoadMore,
                isValidating,
                fetch,
                quickChange,
                handleSelectedAsset,
            } = useDiscoverList({
                isCache: true,
                dependentKey,
                queryText,
                facets,
                postFacets,
                aggregations,
                limit,
                offset,
                attributes: defaultAttributes,
                relationAttributes,
            })

            const handlePreview = (item) => {
                handleSelectedAsset(item)
            }

            // const store = useBusinessMetadataStore()
            // const BMListLoaded = computed(
            //     () => store.getBusinessMetadataListLoaded
            // )
            // const BMAttributeProjection = computed(
            //     () => store.getBusinessMetadataListProjections
            // )

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

            const handleSearchChange = useDebounceFn(() => {
                offset.value = 0
                quickChange()
                // tracking.send(events.EVENT_ASSET_SEARCH, {
                //     trigger: 'discover',
                // })
            }, 150)

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
                offset.value = 0
                quickChange()
            }

            const handleAssetTypeChange = () => {
                offset.value = 0
                quickChange()
            }

            const handleLoadMore = () => {
                if (isLoadMore.value) {
                    offset.value += limit.value
                }
                quickChange()
            }

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
                handleSearchChange,
                isValidating,
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
    .filterPopover {
        max-width: 200px;
        min-width: 200px;
        :global(.ant-popover-content) {
            @apply shadow-sm;
        }

        :global(.ant-popover-inner-content) {
            @apply p-0;
        }
    }

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
