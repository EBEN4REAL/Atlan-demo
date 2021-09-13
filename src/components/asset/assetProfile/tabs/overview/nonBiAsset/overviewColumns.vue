<template>
    <div>
        <!-- Search and Filter -->
        <div class="flex items-center justify-between mb-4">
            <div class="flex items-center w-1/2">
                <a-input-search
                    :value="query"
                    placeholder="Search columns..."
                    class="mr-3"
                    size="default"
                    :allow-clear="true"
                    @change="filterByQuery"
                ></a-input-search>

                <a-popover trigger="click" placement="right">
                    <template #content>
                        <preferences />
                    </template>
                    <a-button class="px-1.5"
                        ><atlan-icon icon="FilterDot" class="h-5"
                    /></a-button>
                </a-popover>
            </div>
        </div>
        <!-- Table -->
        <div class="relative">
            <a-table
                :columns="columns"
                :data-source="columnsData.filteredList"
                :pagination="{ position: 'bottom' }"
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
                            :is="images[record.data_type]"
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
    import { useRoute, useRouter } from 'vue-router'

    // Components
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'
    import preferences from './preferences.vue'
    import PreviewSidebar from '~/components/asset/assetProfile/tabs/overview/sidebar/index.vue'
    import Tooltip from '@/common/ellipsis/index.vue'
    import AssetPreview from '@/discovery/preview/assetPreview.vue'

    // Composables
    import useColumns from '~/composables/asset/useColumns'
    import useColumnsFilter from '~/composables/asset/useColumnsFilter'
    import { images, dataTypeList } from '~/constant/datatype'

    // Interfaces
    import { assetInterface } from '~/types/assets/asset.interface'

    export default defineComponent({
        components: {
            preferences,
            SearchAndFilter,
            PreviewSidebar,
            Tooltip,
            AssetPreview,
        },
        setup() {
            /** DATA */
            const query = ref('')
            const filters = ref([])
            const typeFilters = ref([])
            const columnsData = ref({})
            const columnPreviewData = ref({})
            const selectedRow = ref(null)
            const selectedRowData = ref({})
            const showColumnPreview = ref<boolean>(false)

            /** INJECTIONS */
            const assetDataInjection = inject('assetData')

            /** UTILS */
            const route = useRoute()

            /** COMPUTED */
            const assetData = computed(() => assetDataInjection?.asset)
            const column = computed(() => route?.query?.column || '')

            /** METHODS */
            // getColumnTypes
            const getColumnTypes = (filteredList: any[]) => {
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
            }

            //  filterByQuery
            const filterByQuery = (e: { target: { value: string } }) => {
                query.value = e.target.value
                handleFilter()
            }

            // handleFilter
            const handleFilter = (val) => {
                if (val) typeFilters.value = val

                const { columnList } = columnsData.value
                filterColumnsList(columnList)
            }

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
                        data_type: getDataType(i.attributes.dataType),
                        description:
                            i.attributes.userDescription ||
                            i.attributes.description ||
                            '---',
                        popularity: i.attributes.popularityScore || 8,
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
                    /* setTimeout(() => {
                        scrollToElement(selectedRow.value)
                    }, 500) */
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
                column,
                rowClassName,
                customRow,
                filterByQuery,
                handleCloseColumnSidebar,
                propagateToColumnList,
                selectedRow,
                columnsData,
                query,
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
