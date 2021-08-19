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
        <div style="max-width: calc(100vw - 28rem)">
            <a-table
                :columns="columns"
                :data-source="columnsData.filteredList"
                :pagination="false"
                :scroll="{ x: true }"
                :loading="!columnsData.filteredList"
            >
                <!-- column_name col -->
                <template #column_name="{ text, record }">
                    <div class="flex items-center">
                        <component
                            :is="images[record.data_type]"
                            class="w-5 h-5 mr-3 text-primary"
                        ></component>
                        {{ text }}
                    </div>
                </template>
                <!-- popularity col -->
                <template #popularity="{ text }">
                    <a-progress :percent="text" :show-info="false" />
                </template>
            </a-table>
        </div>
    </div>
</template>

<script lang="ts">
    // Vue
    import { defineComponent, inject, watch, computed, ref } from 'vue'

    // Composables
    import useColumns from '~/composables/asset/useColumns'
    import useColumnsFilter from '~/composables/asset/useColumnsFilter'
    import { images, dataTypeList } from '~/constant/datatype'

    export default defineComponent({
        setup() {
            /** DATA */
            const query = ref('')
            const filters = ref([])
            const filtersSelected = ref([])
            const columnsData = ref({})

            /** INJECTIONS */
            const assetDataInjection = inject('assetData')

            /** COMPUTED */
            const assetData = computed(() => assetDataInjection?.asset)

            /** METHODS */
            // getColumnTypes
            const getColumnTypes = (filteredList) => {
                const filtersIdSet = new Set()
                dataTypeList.forEach((i) => {
                    filteredList.forEach((j) => {
                        if (i.type.includes(j.attributes.dataType))
                            filtersIdSet.add(i.id)
                    })
                })
                filters.value = Array.from(filtersIdSet)
                filtersSelected.value = Array.from(filtersIdSet)
            }

            //  filterByQuery
            const filterByQuery = (e) => {
                query.value = e.target.value
                handleFilter()
            }

            // filterByType
            const filterByType = (e) => {
                filtersSelected.value = e
                handleFilter()
            }

            // handleFilter
            const handleFilter = () => {
                const { columnList } = columnsData.value

                filterColumnsList(columnList)
            }

            // filterColumnsList
            const filterColumnsList = (columnList) => {
                const { filteredList } = useColumnsFilter(
                    columnList,
                    query,
                    filtersSelected
                )

                if (filters.value.length === 0)
                    getColumnTypes(filteredList.value)

                const getDataType = (type) => {
                    let label = ''
                    dataTypeList.forEach((i) => {
                        if (i.type.includes(type)) label = i.label
                    })
                    return label
                }
                const filteredListData = filteredList.value.map((i) => ({
                    key: i.attributes.order,
                    hash_index: i.attributes.order,
                    column_name: i.attributes.name,
                    data_type: getDataType(i.attributes.dataType),
                    description: i.attributes.description || '---',
                    popularity: i.attributes.popularityScore || 8,
                    terms: 'N/A',
                    classification: 'N/A',
                }))

                columnsData.value = {
                    filteredList: filteredListData,
                    columnList,
                }
            }

            // useColumns
            const { columnList } = useColumns(assetData.value.guid)

            /** Watchers */
            watch(columnList, () => {
                filterColumnsList(columnList.value)
            })

            return {
                filterByQuery,
                filterByType,
                columnsData,
                query,
                images,
                filters,
                filtersSelected,
                columns: [
                    {
                        title: '#',
                        dataIndex: 'hash_index',
                        key: 'hash_index',
                        defaultSortOrder: 'ascend',
                        sorter: (a, b) => a.hash_index - b.hash_index,
                    },
                    {
                        title: 'Column name',
                        sorter: true,
                        dataIndex: 'column_name',
                        slots: { customRender: 'column_name' },
                        key: 'column_name',
                    },
                    {
                        title: 'Data type',
                        sorter: true,
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
                        key: 'terms',
                    },
                    {
                        title: 'Classification',
                        dataIndex: 'classification',
                        key: 'classification',
                    },
                ],
            }
        },
    })
</script>

<style lang="less" scoped>
    :global(.ant-table th) {
        @apply whitespace-nowrap font-bold !important;
    }
    :global(.ant-table td) {
        @apply max-w-xs !important;
    }
    :global(.ant-progress-status-success .ant-progress-bg) {
        background-color: #1890ff !important;
    }
</style>
