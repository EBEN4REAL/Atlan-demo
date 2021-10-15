<template>
    <div>
        <!-- Search and Filter -->
        <div class="w-1/2 mb-3">
            <SearchAndFilter
                v-model:value="queryText"
                :autofocus="true"
                :placeholder="`Search ${colCount} columns`"
                @change="handleSearchChange"
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
        </div>
        <!-- Table -->
        <div class="relative">
            <a-table
                :columns="columns"
                :data-source="columnsData.filteredList"
                :scroll="{ y: 300 }"
                :pagination="false"
                :loading="isLoading"
                :custom-row="customRow"
                :row-class-name="rowClassName"
                size="small"
            >
                <!-- hash_index col -->
                <template #hash_index="{ text, record }">
                    <div
                        :class="{
                            'border-primary': record.key === selectedRow,
                        }"
                        class="absolute top-0 left-0 flex items-center justify-center w-full h-full border-l-4 border-transparent "
                    >
                        <span class="mr-1">{{ text }}</span>
                    </div>
                </template>
                <!-- column_name col -->
                <template #column_name="{ text, record }">
                    <div :class="record.is_primary && 'flex items-center'">
                        <div
                            class="flex items-center"
                            :class="record.is_primary && 'flex-grow'"
                        >
                            <component
                                :is="images[record.data_type]"
                                class="w-4 h-4 mr-3"
                            ></component>
                            <Tooltip :tooltip-text="text" />
                            <div v-if="record.is_primary" class="mb-1 ml-2">
                                <AtlanIcon icon="Pin" />
                            </div>
                        </div>
                        <div v-if="record.is_primary">
                            <AtlanIcon icon="PrimaryKey" />
                        </div>
                    </div>
                </template>
                <!-- description col -->
                <template #description="{ text }">
                    <Tooltip :tooltip-text="text" />
                </template>
                <!-- popularity col -->
                <template #popularity="{ text }">
                    <a-progress :percent="text" :show-info="false" />
                </template>
            </a-table>
            <div
                v-if="columnsList.length <= 0 && !isLoading"
                class="flex items-center justify-center mt-3"
            >
                <a-button @click="clearFiltersAndSearch"
                    >Clear all filters</a-button
                >
            </div>
            <div
                v-if="isLoadMore"
                class="flex items-center justify-center mt-3"
            >
                <button
                    v-if="!isLoading"
                    class="flex items-center justify-between py-2 transition-all duration-300 bg-white rounded-full  text-primary"
                    @click="loadMore"
                >
                    <p
                        class="m-0 mr-1 overflow-hidden text-sm transition-all duration-300  overflow-ellipsis whitespace-nowrap"
                    >
                        Load more
                    </p>
                    <AtlanIcon icon="ArrowDown" />
                </button>
            </div>
        </div>
        <teleport to="#overAssetPreviewSidebar">
            <a-drawer
                v-if="showColumnPreview"
                v-model:visible="showColumnPreview"
                placement="right"
                :mask="false"
                :get-container="false"
                :wrap-style="{ position: 'absolute', width: '100%' }"
                :keyboard="false"
                :destroy-on-close="true"
                :closable="false"
                width="100%"
            >
                <AssetPreview
                    :selected-asset="selectedRowData"
                    page="nonBiOverview"
                    :show-cross-icon="true"
                    @closeSidebar="handleCloseColumnSidebar"
                    @asset-mutation="propagateToColumnList"
                />
            </a-drawer>
        </teleport>
    </div>
</template>

<script lang="ts">
    // Vue
    import {
        defineComponent,
        inject,
        watch,
        computed,
        ref,
        Ref,
        nextTick,
        onMounted,
    } from 'vue'
    import { useDebounceFn } from '@vueuse/core'
    import { useRoute } from 'vue-router'

    // Components
    import DataTypes from '@common/facets/dataType.vue'
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'

    import Tooltip from '@/common/ellipsis/index.vue'
    import AssetPreview from '@/discovery/preview/assetPreview.vue'

    // Composables
    import { images, dataTypeList } from '~/constant/datatype'
    import useAssetInfo from '~/composables/asset/useAssetInfo'
    import {
        useColumnsList,
        useColumnAggregation,
    } from '~/composables/asset/useColumns2'

    // Interfaces
    import { assetInterface } from '~/types/assets/asset.interface'

    export default defineComponent({
        components: {
            SearchAndFilter,
            Tooltip,
            AssetPreview,
            DataTypes,
        },
        setup() {
            /** DATA */
            const columnsData = ref({})
            const selectedRow = ref(null)
            const selectedRowData = ref({})
            const showColumnPreview = ref<boolean>(false)
            const queryText = ref('')
            const filters: Ref<string[]> = ref([])
            const columnsList: Ref<assetInterface[]> = ref([])
            const certificationFilters: Ref<string[]> = ref([])
            const sortOrder = ref('order|ascending')
            const clearAllFilters = ref<boolean>(false)
            const columnFromUrl: Ref<assetInterface[]> = ref([])
            const { columnCount } = useAssetInfo()

            /** INJECTIONS */
            const assetDataInjection = inject('assetData')

            /** UTILS */
            const route = useRoute()

            /** COMPUTED */
            const assetData = computed(() => assetDataInjection?.asset)
            const column = computed(() => route?.query?.column || '')

            const assetQualifiedName = computed(
                () => assetData.value.attributes?.qualifiedName
            )
            const colCount = computed(() => columnCount(assetData.value))

            const { list, isLoading, isLoadMore, reFetch, loadMore } =
                useColumnsList(assetQualifiedName, {
                    query: queryText,
                    dataTypes: filters,
                    pinned: false,
                    sort: sortOrder,
                    certification: certificationFilters,
                })

            const { list: pinnedList } = useColumnsList(assetQualifiedName, {
                pinned: true,
            })

            const { dataTypeMap } = useColumnAggregation(assetQualifiedName)

            const handleSearchChange = useDebounceFn(() => {
                reFetch()
            }, 150)

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

            const scrollToElement = () => {
                const tableRow = document.querySelector(
                    `tr[data-row-key="${selectedRow.value}"]`
                )

                if (tableRow) {
                    tableRow.scrollIntoView({
                        block: 'nearest',
                        inline: 'nearest',
                    })
                }
            }

            const handleCloseColumnSidebar = () => {
                showColumnPreview.value = false
                selectedRow.value = null
                selectedRowData.value = {}
            }
            const openColumnSidebar = (columnOrder) => {
                selectedRow.value = columnOrder
                columnsList.value.forEach((singleRow) => {
                    if (singleRow.attributes.order === columnOrder) {
                        selectedRowData.value = singleRow
                    }
                })

                showColumnPreview.value = true
            }

            const getDataType = (type: string) => {
                let label = ''
                dataTypeList.forEach((i) => {
                    if (i.type.includes(type)) label = i.label
                })
                return label
            }

            // filterColumnsList
            const filterColumnsList = () => {
                columnsList.value = [
                    ...pinnedList.value,
                    ...list.value,
                    ...columnFromUrl.value,
                ]

                // In case column is selected from discovery and after clicking load more duplication of the same column happens
                const uniqueColumns = {}
                const filteredColumnsList = columnsList.value.filter(
                    (col) =>
                        !uniqueColumns[col.guid] &&
                        (uniqueColumns[col.guid] = true)
                )

                const filteredListData = filteredColumnsList.map((i) => ({
                    key: i.attributes.order,
                    hash_index: i.attributes.order,
                    column_name: i.attributes.name,
                    data_type: getDataType(i.attributes.dataType),
                    is_primary: i.attributes.isPrimary,
                    description:
                        i.attributes.userDescription ||
                        i.attributes.description ||
                        '---',
                    popularity: i.attributes.popularityScore || 8,
                }))
                columnsData.value = {
                    filteredList: filteredListData,
                }

                if (column.value !== '') {
                    columnsList.value?.forEach((singleRow) => {
                        if (singleRow.guid === column.value) {
                            openColumnSidebar(singleRow.attributes.order)
                        }
                    })

                    nextTick(() => {
                        scrollToElement()
                    })
                }
            }

            // customRow Antd
            const customRow = (record: { key: null }) => ({
                onClick: () => {
                    // Column preview trigger
                    if (selectedRow.value === record.key)
                        handleCloseColumnSidebar()
                    else {
                        openColumnSidebar(record.key)
                    }
                },
            })

            const propagateToColumnList = (updatedAsset: assetInterface) => {
                selectedRowData.value = updatedAsset
                filterColumnsList()
            }

            // rowClassName Antd
            const rowClassName = (record: { key: null }) =>
                record.key === selectedRow.value
                    ? 'bg-primary-light'
                    : 'bg-transparent'

            /** WATCHERS */
            watch([list, pinnedList, columnFromUrl], () => {
                filterColumnsList()
            })

            onMounted(() => {
                // If redirected from asset column discovery
                if (column.value !== '') {
                    const { list: urlColumnList } = useColumnsList(
                        assetQualifiedName,
                        { columnGuid: column }
                    )
                    watch([urlColumnList], () => {
                        columnFromUrl.value = urlColumnList.value
                    })
                }
            })

            return {
                rowClassName,
                customRow,
                handleSearchChange,
                handleChangeSort,
                handleCertificationFilter,
                clearFiltersAndSearch,
                isLoadMore,
                dataTypeMap,
                isLoading,
                loadMore,
                handleFilterChange,
                handleCloseColumnSidebar,
                propagateToColumnList,
                clearAllFilters,
                columnsList,
                selectedRow,
                columnsData,
                queryText,
                images,
                colCount,
                showColumnPreview,
                selectedRowData,
                columns: [
                    {
                        width: 40,
                        title: '#',
                        dataIndex: 'hash_index',
                        slots: { customRender: 'hash_index' },
                        key: 'hash_index',
                    },
                    {
                        width: 200,
                        title: 'Column name',
                        dataIndex: 'column_name',
                        slots: { customRender: 'column_name' },
                        key: 'column_name',
                    },
                    {
                        width: 150,
                        title: 'Data type',
                        dataIndex: 'data_type',
                        key: 'data_type',
                    },
                    {
                        width: 150,
                        title: 'Description',
                        dataIndex: 'description',
                        key: 'description',
                        slots: { customRender: 'description' },
                    },
                    {
                        width: 150,
                        title: 'Popularity',
                        dataIndex: 'popularity',
                        slots: { customRender: 'popularity' },
                        key: 'popularity',
                    },
                ],
            }
        },
    })
</script>

<style lang="less" scoped>
    :global(.ant-table) {
        @apply border border-gray-light !important;
    }
    :global(.ant-table th) {
        @apply whitespace-nowrap font-bold !important;
    }
    :global(.ant-table) {
        -webkit-box-sizing: border-box !important;
        -moz-box-sizing: border-box !important;
        box-sizing: border-box !important;
    }

    :global(.ant-table td) {
        @apply max-w-xs relative cursor-pointer !important;
    }
    :global(.ant-progress-status-success .ant-progress-bg) {
        background-color: #1890ff !important;
    }
    :global(.ant-progress-inner) {
        background-color: rgba(189, 205, 244, 0.53) !important;
    }

    .chip {
        @apply px-1  mr-1;
        @apply rounded;
        @apply flex;
        @apply items-center;
        @apply text-xs;
    }
</style>
