<template>
    <div class="flex w-full">
        <div
            v-if="showFilters"
            class="flex flex-col hidden h-full bg-gray-100 border-r border-gray-300  md:block facets"
        >
            <AssetFilters
                :key="dirtyTimestamp"
                v-model="facets"
                @change="handleFilterChange"
                :typeName="postFacets.typeName"
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
                                        :key="dirtyTimestamp"
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
                            <PreferenceSelector
                                v-model="preference"
                                @change="handleChangePreference"
                            />
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
                    <EmptyView @event="handleEvent"></EmptyView>
                </div>

                <AssetList
                    v-else
                    ref="assetlistRef"
                    :list="list"
                    :selected-asset="selectedAsset"
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
    import { computed, defineComponent, ref, watch, Ref, PropType } from 'vue'
    import EmptyView from '@common/empty/discover.vue'
    // import AssetPagination from '@common/pagination/index.vue'

    // import { useDebounceFn } from '@vueuse/core'

    // import { useRouter } from 'vue-router'
    import { useDebounceFn } from '@vueuse/core'
    import SearchAdvanced from '@/common/input/searchAdvanced.vue'
    import AggregationTabs from '@/common/tabs/aggregationTabs.vue'
    import PreferenceSelector from '@/assets/preference/index.vue'
    import AssetList from '@/assets/list/assetList.vue'
    import AssetFilters from '@/assets/filters/index.vue'

    import {
        AssetAttributes,
        AssetRelationAttributes,
        InternalAttributes,
        SQLAttributes,
    } from '~/constant/projection'

    import { useDiscoverList } from '~/composables/discovery/useDiscoverList'

    import AtlanIcon from '../common/icon/atlanIcon.vue'
    import useDiscoveryStore from '~/store/discovery'
    import { assetInterface } from '~/types/assets/asset.interface'

    export default defineComponent({
        name: 'AssetDiscovery',
        components: {
            AssetList,
            AggregationTabs,
            AssetFilters,
            SearchAdvanced,
            PreferenceSelector,
            EmptyView,
            AtlanIcon,
        },
        props: {
            showFilters: {
                type: Boolean,
                required: false,
                default: true,
            },
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: false,
            },
        },
        setup(props, { emit }) {
            const limit = ref(20)
            const offset = ref(0)
            const queryText = ref('')
            const facets = ref({})
            const preference = ref({
                sort: 'default',
            })
            const aggregations = ref(['typeName'])
            const postFacets = ref({
                typeName: '__all',
            })
            const dependentKey = ref('DEFAULT_ASSET_LIST')
            const defaultAttributes = ref([
                ...InternalAttributes,
                ...AssetAttributes,
                ...SQLAttributes,
            ])
            const relationAttributes = ref([...AssetRelationAttributes])
            const discoveryStore = useDiscoveryStore()
            const dirtyTimestamp = ref(`dirty_${Date.now().toString()}`)

            if (discoveryStore.activeFacet) {
                facets.value = discoveryStore.activeFacet
            }

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
                preference,
                limit,
                offset,
                attributes: defaultAttributes,
                relationAttributes,
            })

            const handlePreview = (item) => {
                handleSelectedAsset(item)
            }

            const handleSearchChange = useDebounceFn(() => {
                offset.value = 0
                quickChange()
                tracking.send(events.EVENT_ASSET_SEARCH, {
                    trigger: 'discover',
                })
            }, 150)

            const handleFilterChange = () => {
                offset.value = 0
                quickChange()
                discoveryStore.setActiveFacet(facets.value)
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

            const handleChangePreference = () => {
                quickChange()
            }

            const handleEvent = () => {
                facets.value = {}
                dirtyTimestamp.value = `dirty_${Date.now().toString()}`
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
                preference,
                handleChangePreference,
                handleEvent,
                dirtyTimestamp,
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
