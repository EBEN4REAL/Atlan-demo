<template>
    <div class="flex flex-col px-5 py-4">
        <SearchAndFilter
            class="mb-4"
            v-model:value="queryText"
            @change="handleSearchChange"
            :autofocus="true"
            :placeholder="`Search ${colCount} columns`"
        >
            <template #filter>
                <DataTypes
                    :data-type-map="dataTypeMap"
                    :clear-all-filters="clearAllFilters"
                    @dataTypeFilter="handleFilterChange"
                    @sort="handleChangeSort"
                    @certification="handleCertificationFilter"
                />
            </template>
        </SearchAndFilter>

        <div
            v-if="isLoading && !isLoadMore"
            class="flex items-center justify-center mt-4 text-sm leading-none"
        >
            <a-spin size="small" class="mr-2 leading-none"></a-spin
            ><span>Getting column info</span>
        </div>
        <div
            v-else-if="list?.length + pinnedList?.length <= 0 && !isLoading"
            class="flex flex-col items-center"
        >
            <img
                :src="emptyScreen"
                alt="No columns"
                class="w-2/5 m-auto mb-4"
            />
            <span class="text-gray-500">No columns found</span>
            <a-button class="mt-3" @click="clearFiltersAndSearch"
                >Clear all filters</a-button
            >
        </div>
        <div
            v-else
            class="flex flex-col gap-y-4"
            :class="{ 'animate-pulse': isLoading }"
        >
            <a-collapse
                v-if="pinnedList.length"
                expand-icon-position="right"
                :bordered="false"
                v-model:activeKey="pinnedExpanded"
                class="bg-transparent"
                :class="$style.filter"
            >
                <template #expandIcon="{ isActive }">
                    <div>
                        <AtlanIcon
                            icon="ChevronDown"
                            class="text-gray-500 transition-transform duration-300 transform "
                            :class="isActive ? '-rotate-180' : 'rotate-0'"
                        />
                    </div>
                </template>
                <a-collapse-panel key="pin">
                    <template #header>
                        <span class="text-sm text-gray-500">Pinned</span>
                    </template>
                    <ColumnListItem
                        v-for="(asset, index) in pinnedList"
                        :key="index"
                        :asset="asset"
                        @asset-mutation="propagateToColumnList"
                    />
                </a-collapse-panel>
            </a-collapse>

            <ColumnListItem
                v-for="(asset, index) in list"
                :key="index"
                :asset="asset"
                @asset-mutation="propagateToColumnList"
            />
        </div>

        <div v-if="isLoadMore" class="flex items-center justify-center">
            <button
                :disabled="isLoading"
                class="flex items-center justify-between py-2 transition-all duration-300 bg-white rounded-full  text-primary"
                :class="isLoading ? 'px-2 w-9' : 'px-5 w-32'"
                @click="loadMore"
            >
                <template v-if="!isLoading">
                    <p
                        class="m-0 mr-1 overflow-hidden text-sm transition-all duration-300  overflow-ellipsis whitespace-nowrap"
                    >
                        Load more
                    </p>
                    <AtlanIcon icon="ArrowDown" />
                </template>
                <svg
                    v-else
                    class="w-5 h-5 text-primary animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        class="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="4"
                    ></circle>
                    <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                </svg>
            </button>
        </div>
    </div>
</template>

<script lang="ts">
    import DataTypes from '@common/facets/dataType.vue'
    import { toRefs, useDebounceFn } from '@vueuse/core'
    import {
        computed,
        defineComponent,
        PropType,
        ref,
        Ref,
        watch,
        nextTick,
    } from 'vue'
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'
    import ColumnListItem from '~/components/discovery/preview/tabs/columns/columnListItem.vue'
    import useAssetInfo from '~/composables/asset/useAssetInfo'
    import {
        useColumnsList,
        useColumnAggregation,
    } from '~/composables/asset/useColumns2'
    import emptyScreen from '~/assets/images/empty_search.png'

    import { dataTypeList } from '~/constant/datatype'
    import { assetInterface } from '~/types/assets/asset.interface'

    export default defineComponent({
        name: 'ColumnTab',
        components: { DataTypes, ColumnListItem, SearchAndFilter },
        props: {
            id: String,
            componentData: {
                type: Object as PropType<any>,
            },
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        setup(props) {
            const isFilterVisible = ref(false)
            const queryText = ref('')
            const filters: Ref<string[]> = ref([])
            const certificationFilters: Ref<string[]> = ref([])
            const pinnedExpanded = ref('pin')
            const sortOrder = ref('Column.order|ascending')
            const clearAllFilters = ref<boolean>(false)

            const { dataTypeImage, columnCount } = useAssetInfo()
            const { selectedAsset } = toRefs(props)

            const colCount = computed(() => columnCount(selectedAsset.value))

            const assetQualifiedName = computed(
                () => selectedAsset.value.attributes?.qualifiedName
            )

            const { list, isLoading, isLoadMore, reFetch, loadMore } =
                useColumnsList(assetQualifiedName, {
                    query: queryText,
                    dataTypes: filters,
                    pinned: false,
                    sort: sortOrder,
                    certification: certificationFilters,
                })

            const {
                list: pinnedList,
                isLoading: isPinnedLoading,
                reFetch: reFetchPinned,
            } = useColumnsList(assetQualifiedName, { pinned: true })

            const { dataTypeMap, isAggregateLoading, refreshAggregation } =
                useColumnAggregation(assetQualifiedName)

            const handleSearchChange = useDebounceFn(() => {
                reFetch()
            }, 150)

            const propagateToColumnList = () => {}

            const clearFiltersAndSearch = () => {
                queryText.value = ''
                clearAllFilters.value = true
                reFetch()
                nextTick(() => {
                    clearAllFilters.value = false
                })
            }
            const handleChangeSort = (payload: any) => {
                sortOrder.value = payload
                reFetch()
            }
            const handleCertificationFilter = (payload: any) => {
                certificationFilters.value = payload
                reFetch()
            }
            const handleFilterChange = (payload: any) => {
                filters.value = payload
                reFetch()
            }

            watch(assetQualifiedName, (newParent, oldParent) => {
                if (newParent !== oldParent) {
                    filters.value = []
                    list.value = []
                    reFetch()
                    reFetchPinned()
                    refreshAggregation()
                }
            })

            return {
                isFilterVisible,
                list,
                queryText,
                dataTypeMap,
                dataTypeImage,
                handleChangeSort,
                handleCertificationFilter,
                isLoading,
                isAggregateLoading,
                dataTypeList,
                filters,
                propagateToColumnList,
                isLoadMore,
                loadMore,
                handleSearchChange,
                handleFilterChange,
                emptyScreen,
                clearFiltersAndSearch,
                colCount,
                pinnedExpanded,
                pinnedList,
                isPinnedLoading,
                reFetchPinned,
                clearAllFilters,
            }
        },
    })
</script>

<style lang="less" module>
    .filter {
        :global(.ant-collapse-header) {
            @apply pl-0 !important;
        }
        :global(.ant-collapse-item:last-child) {
            @apply border-gray-300;
        }
        :global(.ant-collapse-content-box) {
            padding-right: 0px;
            padding-left: 0px;
        }
    }
</style>
