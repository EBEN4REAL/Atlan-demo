<template>
    <div class="flex w-full h-full">
        <div
            v-if="showFilters"
            class="flex flex-col hidden h-full bg-gray-100 border-r border-gray-300  sm:block facets"
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
                <div class="flex px-6 py-1 border-b border-gray-200">
                    <SearchAdvanced
                        v-model="queryText"
                        :key="searchDirtyTimestamp"
                        :connector-name="facets?.hierarchy?.connectorName"
                        :autofocus="true"
                        :allow-clear="true"
                        placeholder="Search assets..."
                        @change="handleSearchChange"
                    >
                        <template #filter>
                            <a-popover
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
                                @display="handleDisplayChange"
                            />
                        </template>
                    </SearchAdvanced>
                </div>

                <div v-if="showAggrs" class="w-full px-4">
                    <AggregationTabs
                        v-model="postFacets.typeName"
                        class="mt-3"
                        :list="assetTypeAggregationList"
                        @change="handleAssetTypeChange"
                    >
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
                        empty-screen="EmptyDiscover"
                        :desc="
                            staticUse
                                ? 'No assets found'
                                : 'We didnt find anything that matches your search criteria'
                        "
                        :button-text="staticUse ? '' : 'Reset Filter'"
                        class="mb-10"
                        @event="handleResetEvent"
                    ></EmptyView>
                </div>

                <AssetList
                    v-else
                    ref="assetlistRef"
                    :list="list"
                    :selectedAsset="selectedAsset"
                    :isLoadMore="isLoadMore"
                    :isLoading="isValidating"
                    @loadMore="handleLoadMore"
                >
                    <template v-slot:default="{ item }">
                        <AssetItem
                            :item="item"
                            :selectedGuid="selectedAsset.guid"
                            @preview="handlePreview"
                            :preference="preference"
                        ></AssetItem>
                    </template>
                </AssetList>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, toRefs, Ref } from 'vue'

    import EmptyView from '@common/empty/index.vue'
    import ErrorView from '@common/error/discover.vue'

    import { useDebounceFn } from '@vueuse/core'
    import SearchAdvanced from '@/common/input/searchAdvanced.vue'
    import AggregationTabs from '@/common/tabs/aggregationTabs.vue'
    import PreferenceSelector from '@/assets/preference/index.vue'

    import AssetFilters from '@/common/assets/filters/index.vue'
    import AssetList from '@/common/assets/list/index.vue'
    import AssetItem from '@/common/assets/list/assetItem.vue'

    import {
        AssetAttributes,
        AssetRelationAttributes,
        InternalAttributes,
        SQLAttributes,
    } from '~/constant/projection'

    import { useDiscoverList } from '~/composables/discovery/useDiscoverList'

    import AtlanIcon from '../common/icon/atlanIcon.vue'
    import useAssetStore from '~/store/asset'
    import { assetInterface } from '~/types/assets/asset.interface'

    import { discoveryFilters } from '~/constant/filters/discoveryFilters'

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
            },
            showAggrs: {
                type: Boolean,
                required: false,
                default: true,
            },
            staticUse: {
                type: Boolean,
                required: false,
                default: false,
            },
        },
        setup(props, { emit }) {
            const limit = ref(20)
            const offset = ref(0)
            const queryText = ref('')
            const facets = ref({})
            const preference = ref({
                sort: 'default',
                display: [],
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
            const activeKey: Ref<string[]> = ref([])
            const dirtyTimestamp = ref(`dirty_${Date.now().toString()}`)
            const searchDirtyTimestamp = ref(`dirty_${Date.now().toString()}`)
            const { initialFilters } = toRefs(props)
            const discoveryStore = useAssetStore()

            if (discoveryStore.activeFacet) {
                facets.value = discoveryStore.activeFacet
            }
            if (discoveryStore.preferences) {
                preference.value = discoveryStore.preferences
            }
            if (discoveryStore.activeFacetTab?.length > 0) {
                activeKey.value = discoveryStore.activeFacetTab
            } else {
                activeKey.value = ['hierarchy']
            }
            if (props.initialFilters) {
                facets.value = {
                    ...facets.value,
                    ...initialFilters.value,
                }
            }

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
                handleSelectedAsset,
                updateList,
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

            const updateCurrentList = (asset) => {
                updateList(asset)
                handleSelectedAsset(asset)
            }

            const handleSearchChange = useDebounceFn(() => {
                offset.value = 0
                quickChange()
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
                discoveryStore.setPreferences(preference.value)
            }

            const handleDisplayChange = () => {
                discoveryStore.setPreferences(preference.value)
            }

            const handleResetEvent = () => {
                facets.value = {}
                queryText.value = ''
                handleFilterChange()
                dirtyTimestamp.value = `dirty_${Date.now().toString()}`
                searchDirtyTimestamp.value = `dirty_${Date.now().toString()}`
            }

            const handleActiveKeyChange = () => {
                discoveryStore.setActivePanel(activeKey.value)
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
        :global(.ant-popover-content) {
            @apply shadow-sm;
        }
    }
</style>
