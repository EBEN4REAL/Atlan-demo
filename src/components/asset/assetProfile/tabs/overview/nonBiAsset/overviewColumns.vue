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
                    <a-button class="px-2"
                        ><atlan-icon icon="FilterDot" class="w-auto h-5"
                    /></a-button>
                </a-popover>
            </div>
        </div>
        <!-- Table -->
        <div
            class="overflow-auto border border-gray-light"
            style="max-width: calc(100vw - 28rem); max-height: 20rem"
        >
            <a-table
                :columns="columns"
                :data-source="columnsData.filteredList"
                :pagination="false"
                :scroll="{ x: 'calc(700px + 50%)', y: 240 }"
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
    </div>
</template>

<script lang="ts">
    // Vue
    import { defineComponent, inject, watch, computed, ref, provide } from 'vue'
    // Components
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'
    import preferences from './preferences.vue'
    // Composables
    import useColumns from '~/composables/asset/useColumns'
    import useColumnsFilter from '~/composables/asset/useColumnsFilter'
    import { images, dataTypeList } from '~/constant/datatype'

    export default defineComponent({
        components: { preferences, SearchAndFilter },
        setup() {
            /** DATA */
            const query = ref('')
            const filters = ref([])
            const typeFilters = ref([])
            const columnsData = ref({})
            const selectedRow = ref(null)

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
                typeFilters.value = Array.from(filtersIdSet)
            }

            //  filterByQuery
            const filterByQuery = (e) => {
                query.value = e.target.value
                handleFilter()
            }

            // handleFilter
            const handleFilter = (val) => {
                if (val) typeFilters.value = val

                const { columnList } = columnsData.value
                filterColumnsList(columnList)
            }

            // filterColumnsList
            const filterColumnsList = (columnList) => {
                const { filteredList } = useColumnsFilter(
                    columnList,
                    query,
                    typeFilters
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
                    classifications: 'N/A',
                }))

                columnsData.value = {
                    filteredList: filteredListData,
                    columnList,
                }
            }

            // useColumns
            const { columnList } = useColumns(assetData.value.guid)

            // customRow Antd
            const customRow = (record) => ({
                onClick: (event) => {
                    if (selectedRow.value === record.key)
                        selectedRow.value = null
                    else selectedRow.value = record.key
                    // TODO:  emit record here for column asset preview
                },
            })

            // rowClassName Antd
            const rowClassName = (record, index) =>
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
                filterByQuery,
                selectedRow,
                columnsData,
                query,
                images,
                columns: [
                    {
                        width: 50,
                        fixed: 'left',
                        title: '#',
                        dataIndex: 'hash_index',
                        slots: { customRender: 'hash_index' },
                        key: 'hash_index',
                        defaultSortOrder: 'ascend',
                        sorter: (a, b) => a.hash_index - b.hash_index,
                    },
                    {
                        width: 200,
                        title: 'Column name',
                        dataIndex: 'column_name',
                        slots: { customRender: 'column_name' },
                        key: 'column_name',
                        sorter: (a, b) => a.column_name > b.column_name,
                    },
                    {
                        width: 100,
                        title: 'Data type',
                        dataIndex: 'data_type',
                        key: 'data_type',
                    },
                    {
                        width: 100,
                        title: 'Description',
                        dataIndex: 'description',
                        key: 'description',
                        ellipsis: true,
                    },
                    {
                        width: 150,
                        title: 'Popularity',
                        sorter: true,
                        dataIndex: 'popularity',
                        slots: { customRender: 'popularity' },
                        key: 'popularity',
                    },
                    {
                        width: 150,
                        title: 'Terms',
                        dataIndex: 'terms',
                        slots: { customRender: 'terms' },
                        key: 'terms',
                    },
                    {
                        width: 150,
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
