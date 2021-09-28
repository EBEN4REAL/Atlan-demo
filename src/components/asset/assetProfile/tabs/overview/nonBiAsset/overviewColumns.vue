<template>
    <div>
        <!-- Search and Filter -->
        <div class="flex items-center justify-between mb-4">
            <div class="flex items-center w-1/2">
                <SearchAndFilter
                    v-model:value="queryText"
                    @change="handleSearchChange"
                    :autofocus="true"
                    placeholder="Search columns..."
                >
                    <template #filter>
                        <div
                            class="flex items-center justify-between mb-2 text-sm "
                        >
                            <span>Data type</span>
                            <span
                                class="text-gray-500 cursor-pointer  hover:text-gray"
                                @click="clearAllFilters"
                                >Clear</span
                            >
                        </div>
                        <DataTypes
                            v-model:filters="filters"
                            @update:filters="handleFilterChange"
                        />
                    </template>
                </SearchAndFilter>
            </div>
        </div>
        <!-- Table -->
        <div class="relative">
            <a-table
                :columns="columns"
                :data-source="columnsData.filteredList"
                :scroll="{ y: 240, scrollToFirstRowOnChange: true }"
                :loading="!columnsData.filteredList"
                :custom-row="customRow"
                :row-class-name="rowClassName"
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
                    <div class="flex items-center">
                        <component
                            :is="record.data_type"
                            class="w-4 h-4 mr-3"
                        ></component>
                        <Tooltip :tooltip-text="text" />
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
        <teleport to="#overAssetPreviewSidebar">
            <a-drawer
                v-model:visible="showColumnPreview"
                placement="right"
                :mask="false"
                :get-container="false"
                :wrap-style="{ position: 'absolute' }"
                :keyboard="false"
                :destroy-on-close="true"
                :closable="false"
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
        provide,
        nextTick,
    } from 'vue'
    import { useDebounceFn } from '@vueuse/core'
    import { useRoute } from 'vue-router'

    // Components
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'
    import DataTypes from '@common/facets/dataType.vue'

    import preferences from './preferences.vue'
    import Tooltip from '@/common/ellipsis/index.vue'
    import AssetPreview from '@/discovery/preview/assetPreview.vue'

    // Composables
    import useColumns from '~/composables/asset/useColumns'
    import useColumnsFilter from '~/composables/asset/useColumnsFilter'
    import { images, dataTypeList } from '~/constant/datatype'
    import useColumns2 from '~/composables/asset/useColumns2'
    import useAssetInfo from '~/composables/asset/useAssetInfo'

    // Interfaces
    import { assetInterface } from '~/types/assets/asset.interface'

    import {
        BasicSearchAttributes,
        ColumnAttributes,
    } from '~/constant/projection'
    import { useBusinessMetadataStore } from '~/store/businessMetadata'

    export default defineComponent({
        components: {
            preferences,
            SearchAndFilter,
            Tooltip,
            AssetPreview,
            DataTypes,
        },
        setup() {
            /** DATA */
            const columnsData = ref({})
            const columnPreviewData = ref({})
            const selectedRow = ref(null)
            const selectedRowData = ref({})
            const showColumnPreview = ref<boolean>(false)
            const queryText = ref('')
            const limit = ref(20)
            const offset = ref(0)
            const filters: Ref<string[]> = ref([])
            const dataTypeFilters = ref([])

            const { dataTypeImage } = useAssetInfo()

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

            const { list, isLoading, replaceBody, isLoadMore } = useColumns2({
                entityParentQualifiedName: assetQualifiedName,
            })

            const updateBody = () => {
                const initialBody = {
                    typeName: 'Column',
                    excludeDeletedEntities: true,
                    includeClassificationAttributes: true,
                    includeSubClassifications: true,
                    includeSubTypes: true,
                    entityFilters: {},
                    limit: limit.value,
                    offset: offset.value,
                    attributes: [
                        'description',
                        'userDescription',
                        'customDescription',
                        'owner',
                        'expert',
                        'files',
                        'table',
                        'database',
                        'atlanSchema',
                        'profileSchedule',
                        'isProfileScheduled',
                        'order',
                        'extra',
                        'metadata',
                        'commits',
                        'siteName',
                        'siteQualifiedName',
                        'topLevelProjectName',
                        'topLevelProjectQualifiedName',
                        'isTopLevelProject',
                        'projectHierarchy',
                        'projectName',
                        'workbookName',
                        'datasourceName',
                        ...BasicSearchAttributes,
                        ...useBusinessMetadataStore()
                            .getBusinessMetadataListProjections,
                        ...ColumnAttributes,
                    ],
                }
                initialBody.entityFilters = {
                    condition: 'AND',
                    criterion: [
                        {
                            condition: 'OR',
                            criterion: [...dataTypeFilters.value],
                        },
                        {
                            condition: 'OR',
                            criterion: [
                                {
                                    attributeName: 'tableQualifiedName',
                                    attributeValue: assetQualifiedName.value,
                                    operator: 'eq',
                                },
                                {
                                    attributeName: 'viewQualifiedName',
                                    attributeValue: assetQualifiedName.value,
                                    operator: 'eq',
                                },
                            ],
                        },
                    ],
                }

                if (queryText.value) {
                    initialBody.query = queryText.value
                }
                replaceBody(initialBody)
            }

            const loadMore = () => {
                if (isLoadMore.value) {
                    offset.value += limit.value
                    updateBody()
                }
            }

            const handleSearchChange = useDebounceFn(() => {
                offset.value = 0
                updateBody()
            }, 150)

            const clearAllFilters = () => {
                filters.value = []
                dataTypeFilters.value = []
                offset.value = 0
                updateBody()
            }

            const clearFiltersAndSearch = () => {
                filters.value = []
                dataTypeFilters.value = []
                queryText.value = ''
                offset.value = 0
                updateBody()
            }
            const handleFilterChange = () => {
                offset.value = 0
                dataTypeFilters.value = dataTypeList
                    .filter((typeList) => filters.value.includes(typeList.id))
                    .reduce((acc: string[], dt) => [...acc, ...dt.type], [])
                    .map((filter) => ({
                        attributeName: 'dataType',
                        attributeValue: filter,
                        operator: 'eq',
                    }))
                updateBody()
            }

            /** METHODS */
            // getColumnTypes
            /* const getColumnTypes = (filteredList: any[]) => {
                const filtersIdSet = new Set()
                dataTypeList.forEach((i) => {
                    filteredList.forEach(
                        (j: { attributes: { dataType: string } }) => {
                            if (i.type.includes(j.attributes.dataType))
                                filtersIdSet.add(i.id)
                        }
                    )
                })
                filters.value = Array.from(filtersIdSet)
                typeFilters.value = Array.from(filtersIdSet)
            } */

            //  filterByQuery
            /*   const filterByQuery = (e: { target: { value: string } }) => {
                query.value = e.target.value
                handleFilter()
            }

            // handleFilter
            const handleFilter = (val) => {
                if (val) typeFilters.value = val

                const { columnList } = columnsData.value
                filterColumnsList(columnList)
            } */

            const scrollToElement = (selectedRow) => {
                let paginationOfSelectedColumn
                if (selectedRow % 10 === 0) {
                    paginationOfSelectedColumn = selectedRow / 10
                } else {
                    paginationOfSelectedColumn =
                        Math.floor(selectedRow / 10) + 1
                }
                document
                    .querySelector(`li[title="${paginationOfSelectedColumn}"]`)
                    .click()

                setTimeout(() => {
                    const tableRow = document.querySelector(
                        `tr[data-row-key="${selectedRow}"]`
                    )

                    if (tableRow) {
                        tableRow.scrollIntoView({
                            block: 'nearest',
                            inline: 'nearest',
                        })
                    }
                }, 500)
            }

            // filterColumnsList
            const filterColumnsList = (columnList: any) => {
                const { filteredList } = useColumnsFilter(
                    columnList,
                    query,
                    typeFilters
                )

                if (filters.value.length === 0)
                    getColumnTypes(filteredList.value)

                const getDataType = (type: string) => {
                    let label = ''
                    dataTypeList.forEach((i) => {
                        if (i.type.includes(type)) label = i.label
                    })
                    return label
                }
                const filteredListData = filteredList.value.map(
                    (i: {
                        attributes: {
                            order: any
                            name: any
                            dataType: any
                            userDescription: any
                            description: any
                            popularityScore: any
                        }
                    }) => ({
                        key: i.attributes.order,
                        hash_index: i.attributes.order,
                        column_name: i.attributes.name,
                        data_type: dataTypeImage(i),
                        description:
                            i.attributes.userDescription ||
                            i.attributes.description ||
                            '---',
                        popularity: i.attributes.popularityScore || 0,
                    })
                )
                columnPreviewData.value = { filteredList }

                columnsData.value = {
                    filteredList: filteredListData,
                    columnList,
                }

                // If redirected from asset column discovery
                if (column.value !== '') {
                    columnPreviewData.value.filteredList?.forEach(
                        (singleRow: {}) => {
                            if (singleRow.guid === column.value) {
                                openColumnSidebar(singleRow.attributes.order)
                            }
                        }
                    )
                    nextTick(() => {
                        scrollToElement(selectedRow.value)
                    })
                }
            }

            // useColumns
            const { columnList } = useColumns(assetData.value.guid)

            const handleCloseColumnSidebar = () => {
                showColumnPreview.value = false
                selectedRow.value = null
                selectedRowData.value = {}
            }
            const openColumnSidebar = (columnOrder) => {
                selectedRow.value = columnOrder
                columnPreviewData.value.filteredList.forEach(
                    (singleRow: {}) => {
                        if (singleRow.attributes.order === columnOrder) {
                            selectedRowData.value = singleRow
                        }
                    }
                )

                showColumnPreview.value = true
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
                handleFilter()
            }

            // rowClassName Antd
            const rowClassName = (record: { key: null }, index: any) =>
                record.key === selectedRow.value
                    ? 'bg-primary-light'
                    : 'bg-transparent'

            /** PROVIDERS */
            provide('handleFilter', handleFilter)
            provide('typeFilters', typeFilters)

            /** WATCHERS */
            watch(columnList, () => {
                filterColumnsList(columnList.value)
            })

            return {
                rowClassName,
                customRow,
                handleSearchChange,
                clearAllFilters,
                filters,
                isLoadMore,
                isLoading,
                handleFilterChange,
                handleCloseColumnSidebar,
                propagateToColumnList,
                selectedRow,
                columnsData,
                queryText,
                images,
                showColumnPreview,
                selectedRowData,
                columns: [
                    {
                        width: 40,
                        title: '#',
                        dataIndex: 'hash_index',
                        slots: { customRender: 'hash_index' },
                        key: 'hash_index',
                        defaultSortOrder: 'ascend',
                        sorter: (
                            a: { hash_index: number },
                            b: { hash_index: number }
                        ) => a.hash_index - b.hash_index,
                    },
                    {
                        width: 200,
                        title: 'Column name',
                        dataIndex: 'column_name',
                        slots: { customRender: 'column_name' },
                        key: 'column_name',
                        sorter: (
                            a: { column_name: number },
                            b: { column_name: number }
                        ) => a.column_name > b.column_name,
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
                        sorter: true,
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
    :global(.ant-drawer-content-wrapper) {
        width: 420px !important;
        background-color: white !important;
    }
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
</style>
