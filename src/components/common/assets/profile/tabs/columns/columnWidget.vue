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
                <!-- <template #filter>
                    <DataTypes
                        :data-type-map="dataTypeMap"
                        :clear-all-filters="clearAllFilters"
                        @dataTypeFilter="handleFilterChange"
                        @sort="handleChangeSort"
                        @certification="handleCertificationFilter"
                    />
                </template> -->
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
                            <!-- <Tooltip :tooltip-text="text" /> -->
                            <a-tooltip placement="left">
                                {{ text }}
                            </a-tooltip>
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
                    <!-- <Tooltip :tooltip-text="text" /> -->
                    <a-tooltip placement="left">
                        {{ text }}
                    </a-tooltip>
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
        <AssetDrawer
            :data="selectedRowData"
            :showDrawer="showColumnSidebar"
            @closeDrawer="handleCloseColumnSidebar"
            @update="handleListUpdate"
        />
    </div>
</template>

<script lang="ts">
    // Vue
    import {
        defineComponent,
        // inject,
        watch,
        computed,
        ref,
        Ref,
        nextTick,
        onMounted,
    } from 'vue'
    import { useDebounceFn } from '@vueuse/core'
    import { useRoute } from 'vue-router'
    import { storeToRefs } from 'pinia'

    // Components
    // import DataTypes from '@common/facets/dataType.vue'
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'
    import AssetDrawer from '@/common/assets/preview/drawer.vue'

    // import Tooltip from '@/common/ellipsis/index.vue'
    // import AssetPreview from '@/discovery/preview/assetPreview.vue'

    // Composables
    import { images, dataTypeCategoryList } from '~/constant/dataType'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    // import {
    //     useColumnsList,
    //     // useColumnAggregation,
    // } from '~/composables/discovery/useColumns'
    import {
        AssetAttributes,
        AssetRelationAttributes,
        InternalAttributes,
        SQLAttributes,
    } from '~/constant/projection'
    import { useDiscoverList } from '~/composables/discovery/useDiscoverList'

    // Interfaces
    import { assetInterface } from '~/types/assets/asset.interface'

    export default defineComponent({
        components: {
            SearchAndFilter,
            AssetDrawer,
        },
        setup() {
            /** DATA */
            const columnsData = ref({})
            const selectedRow = ref(null)
            const selectedRowData = ref({})
            const showColumnSidebar = ref<boolean>(false)
            const queryText = ref('')
            const columnsList: Ref<assetInterface[]> = ref([])
            const clearAllFilters = ref<boolean>(false)
            const { columnCount, selectedAsset } = useAssetInfo()

            const aggregationAttributeName = 'dataType'
            const limit = ref(20)
            const offset = ref(0)
            const facets = ref({
                typeName: 'Column',
            })
            const aggregations = ref([aggregationAttributeName])
            const postFacets = ref({})
            const dependentKey = ref('DEFAULT_COLUMNS')
            const defaultAttributes = ref([
                ...InternalAttributes,
                ...AssetAttributes,
                ...SQLAttributes,
            ])
            const preference = ref({
                sort: 'order-asc',
            })
            const relationAttributes = ref([...AssetRelationAttributes])

            const assetQualifiedName = computed(
                () => selectedAsset.value?.attributes?.qualifiedName
            )

            const updateFacet = () => {
                facets.value = {}
                if (selectedAsset?.value.typeName?.toLowerCase() === 'table') {
                    facets.value.tableQualifiedName = assetQualifiedName.value
                }
                if (selectedAsset?.value.typeName?.toLowerCase() === 'view') {
                    facets.value.viewQualifiedName = assetQualifiedName.value
                }
            }

            updateFacet()

            const {
                list,
                isLoading,
                assetTypeAggregationList,
                isLoadMore,
                fetch,
                quickChange,
                totalCount,
                getAggregationList,
                error,
                isValidating,
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

            const handleListUpdate = (asset: any) => {
                updateList(asset)
            }

            const columnDataTypeAggregationList = computed(() =>
                getAggregationList(
                    `group_by_${aggregationAttributeName}`,
                    [],
                    true
                )
            )

            /** UTILS */
            const route = useRoute()

            const column = computed(() => route?.query?.column || '')

            const colCount = computed(() => columnCount(selectedAsset.value))

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
                showColumnSidebar.value = false
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

                showColumnSidebar.value = true
            }

            const getDataType = (type: string) => {
                let label = ''
                dataTypeCategoryList.forEach((i) => {
                    if (i.type.includes(type?.toUpperCase())) label = i.label
                })
                return label
            }

            // filterColumnsList
            const filterColumnsList = () => {
                columnsList.value = [
                    // ...pinnedList.value,
                    ...list.value,
                    // ...columnFromUrl.value,
                ]
                console.log(columnsList.value)

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
                    // Column drawer trigger
                    if (selectedRow.value === record.key)
                        handleCloseColumnSidebar()
                    else {
                        openColumnSidebar(record.key)
                    }
                },
            })

            // rowClassName Antd
            const rowClassName = (record: { key: null }) =>
                record.key === selectedRow.value
                    ? 'bg-primary-light'
                    : 'bg-transparent'

            /** WATCHERS */
            watch([list], () => {
                filterColumnsList()
            })

            // onMounted(() => {
            //     // If redirected from asset column discovery
            //     if (column.value !== '') {
            //         const { list: urlColumnList } = useColumnsList(
            //             assetQualifiedName,
            //             { columnGuid: column }
            //         )
            //         watch([urlColumnList], () => {
            //             columnFromUrl.value = urlColumnList.value
            //         })
            //     }
            // })

            return {
                rowClassName,
                customRow,
                // handleSearchChange,
                // handleChangeSort,
                // handleCertificationFilter,
                // clearFiltersAndSearch,
                // isLoadMore,
                // // dataTypeMap,
                // isLoading,
                // loadMore,
                // handleFilterChange,
                isLoadMore,
                handleListUpdate,
                handleCloseColumnSidebar,
                clearAllFilters,
                isLoading,
                columnsList,
                selectedRow,
                columnsData,
                queryText,
                colCount,
                showColumnSidebar,
                selectedRowData,
                images,
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
</style>
