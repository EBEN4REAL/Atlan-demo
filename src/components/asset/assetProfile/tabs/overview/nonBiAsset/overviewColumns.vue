<template>
    <div>
        <!-- Search and Filter -->
        <div class="flex items-center justify-between mb-4">
            <div class="flex items-center flex-1">
                <a-input-search
                    :value="query"
                    placeholder="Search columns..."
                    class="mr-3"
                    size="default"
                    :allow-clear="true"
                    @change="filterByQuery"
                ></a-input-search>
                <a-button class="px-2"
                    ><atlan-icon icon="FilterDot" class="w-auto h-5"
                /></a-button>
            </div>
            <div class="flex justify-end flex-1">
                <a-button class="flex items-center">
                    <span>View column profile</span>
                    <atlan-icon icon="ArrowRight" class="w-auto h-4 ml-2"
                /></a-button>
            </div>
        </div>
        <!-- Table -->
        <div
            class="overflow-scroll border-t border-gray-light"
            style="max-width: calc(100vw - 28rem); max-height: 20rem"
        >
            <a-table
                :columns="columns"
                :data-source="columnsData.filteredList"
                :pagination="false"
                :scroll="{ x: true }"
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
                        {{ text }}
                    </div>
                </template>
                <!-- column_name col -->
                <template #column_name="{ text, record }">
                    <div class="flex items-center">
                        <component
                            :is="images[record.data_type]"
                            class="w-4 h-4 mr-3"
                        ></component>
                        <span class="truncate">{{ text }}</span>
                    </div>
                </template>
                <!-- popularity col -->
                <template #popularity="{ text }">
                    <a-progress :percent="text" :show-info="false" />
                </template>
                <!-- terms col -->
                <template #terms="{ text }">
                    <div
                        class="
                            inline-flex
                            px-3
                            py-1.5
                            rounded-full
                            items-center
                            cursor-pointer
                            select-none
                            text-sm text-primary
                            hover:text-white hover:bg-primary
                            whitespace-nowrap
                            _bg-primary-light
                        "
                    >
                        <fa icon="fal plus" class="" />
                        <span class="ml-2">Add Terms</span>
                    </div>
                </template>
                <!-- classifications col -->
                <template #classifications="{ text }">
                    <div
                        class="
                            inline-flex
                            px-3
                            py-1.5
                            rounded-full
                            items-center
                            cursor-pointer
                            select-none
                            text-sm text-primary
                            whitespace-nowrap
                            hover:text-white hover:bg-primary
                            _bg-primary-light
                        "
                    >
                        <fa icon="fal plus" class="" />
                        <span class="ml-2">Add Classifications</span>
                    </div>
                </template>
            </a-table>
        </div>
        <!-- <div
            class="flex flex-col h-full bg-white border-l z-25 column-preview-container"
        >
            <ColumnPreview />
        </div> --><teleport to="#overAssetColumnPreview">
            <a-drawer
                v-model:visible="showColumnPreview"
                placement="right"
                :mask="false"
                :wrap-style="{ position: 'absolute' }"
                :get-container="false"
                wrap-class-name=""
                :destroy-on-close="true"
                width="420"
                ><div class="flex flex-col bg-white border-l">
                    <ColumnPreview
                        :selected-row="selectedRowData"
                        page="columnPreview"
                    />
                </div>
                <!-- <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p> -->
            </a-drawer>
        </teleport>
    </div>
</template>

<script lang="ts">
    // Vue
    import { defineComponent, inject, watch, computed, ref } from 'vue'

    // Composables
    import useColumns from '~/composables/asset/useColumns'
    import useColumnsFilter from '~/composables/asset/useColumnsFilter'
    import { images, dataTypeList } from '~/constant/datatype'

    // Components
    import ColumnPreview from './columnPreview/index.vue'
    import AssetPreview from '~/components/discovery/preview/assetPreview.vue'

    export default defineComponent({
        components: { ColumnPreview },
        setup() {
            /** DATA */
            const query = ref('')
            const filters = ref([])
            const filtersSelected = ref([])
            const columnsData = ref({})
            const selectedRow = ref(null)
            const selectedRowData = ref({})
            const showColumnPreview = ref<boolean>(false)

            /** INJECTIONS */
            const assetDataInjection = inject('assetData')

            /** COMPUTED */
            const assetData = computed(() => assetDataInjection?.asset)

            /** METHODS */

            // getColumnTypes
            const getColumnTypes = (filteredList: any[]) => {
                const filtersIdSet = new Set()
                dataTypeList.forEach((i) => {
                    filteredList.forEach(
                        (j: { attributes: { dataType: string } }) => {
                            if (
                                i.type.includes(j.attributes.dataType) ||
                                i.type.includes(
                                    j.attributes.dataType.toLowerCase()
                                )
                            )
                                filtersIdSet.add(i.id)
                        }
                    )
                })
                filters.value = Array.from(filtersIdSet)
                filtersSelected.value = Array.from(filtersIdSet)
            }

            //  filterByQuery
            const filterByQuery = (e: { target: { value: string } }) => {
                query.value = e.target.value
                handleFilter()
            }

            // filterByType
            const filterByType = (e: never[]) => {
                filtersSelected.value = e
                handleFilter()
            }

            // handleFilter
            const handleFilter = () => {
                const { columnList } = columnsData.value

                filterColumnsList(columnList)
            }

            // filterColumnsList
            const filterColumnsList = (columnList: any) => {
                const { filteredList } = useColumnsFilter(
                    columnList,
                    query,
                    filtersSelected
                )

                if (filters.value.length === 0)
                    getColumnTypes(filteredList.value)

                const getDataType = (type: string) => {
                    let label = ''
                    dataTypeList.forEach((i) => {
                        if (
                            i.type.includes(type) ||
                            i.type.includes(type.toLowerCase())
                        )
                            label = i.label
                    })
                    return label
                }
                const filteredListData = filteredList.value.map(
                    (i: {
                        attributes: {
                            order: any
                            name: any
                            dataType: any
                            description: any
                            popularityScore: any
                        }
                    }) => ({
                        key: i.attributes.order,
                        hash_index: i.attributes.order,
                        column_name: i.attributes.name,
                        data_type: getDataType(i.attributes.dataType),
                        description: i.attributes.description || '---',
                        popularity: i.attributes.popularityScore || 8,
                        terms: 'N/A',
                        classifications: 'N/A',
                    })
                )

                columnsData.value = {
                    filteredList: filteredListData,
                    columnList,
                }
            }

            // useColumns
            const { columnList } = useColumns(assetData.value.guid)

            // customRow Antd
            const customRow = (record: { key: null }) => ({
                onClick: () => {
                    if (selectedRow.value === record.key)
                        selectedRow.value = null
                    else {
                        selectedRow.value = record.key
                        columnsData.value.filteredList.forEach(
                            (singleRow: {}) => {
                                if (singleRow.key === record.key) {
                                    selectedRowData.value = singleRow
                                }
                            }
                        )
                        showColumnPreview.value = true
                    }
                    // emit record here for column asset preview

                    console.log(selectedRowData.value)
                },
            })

            // rowClassName Antd
            const rowClassName = (record: { key: null }, index: any) =>
                record.key === selectedRow.value
                    ? 'bg-primary-light'
                    : 'bg-transparent'

            /** Watchers */
            watch(columnList, () => {
                filterColumnsList(columnList.value)
            })

            return {
                rowClassName,
                customRow,
                selectedRow,
                filterByQuery,
                filterByType,
                columnsData,
                query,
                images,
                filters,
                filtersSelected,
                showColumnPreview,
                selectedRowData,
                columns: [
                    {
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
                        title: 'Data type',
                        dataIndex: 'data_type',
                        key: 'data_type',
                    },
                    {
                        title: 'Description',
                        dataIndex: 'description',
                        key: 'description',
                    },
                    {
                        title: 'Popularity',
                        sorter: true,
                        dataIndex: 'popularity',
                        slots: { customRender: 'popularity' },
                        key: 'popularity',
                    },
                    {
                        title: 'Terms',
                        dataIndex: 'terms',
                        slots: { customRender: 'terms' },
                        key: 'terms',
                    },
                    {
                        title: 'Classifications',
                        dataIndex: 'classifications',
                        slots: { customRender: 'classifications' },
                        key: 'classifications',
                    },
                ],
            }
        },
    })
</script>

<style lang="less" scoped>
    .column-preview-container {
        width: 420px;
    }
    :global(.ant-table th) {
        @apply whitespace-nowrap font-bold !important;
    }
    :global(.ant-table td) {
        @apply max-w-xs relative cursor-pointer !important;
    }
    :global(.ant-progress-status-success .ant-progress-bg) {
        background-color: #1890ff !important;
    }
</style>
