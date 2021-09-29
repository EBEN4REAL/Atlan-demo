<template>
    <div>
        <!-- Search and Filter -->
        <div class="mb-4">
            <SearchAndFilter
                v-model:value="queryText"
                :autofocus="true"
                placeholder="Search columns..."
                @change="handleSearchChange"
            >
                <template #filter>
                    <div class="flex items-center justify-between mb-2 text-sm">
                        <span>Data type</span>
                        <span
                            class="text-gray-500 cursor-pointer hover:text-gray"
                            @click="clearAllFilters"
                            >Clear</span
                        >
                    </div>
                    <DataTypes
                        v-model:filters="filters"
                        :data-type-map="dataTypeMap"
                        @update:filters="handleFilterChange"
                    />
                </template>
            </SearchAndFilter>
        </div>
        <!-- Table -->
        <div class="relative">
            <a-table
                :columns="columns"
                :data-source="columnsData.filteredList"
                :scroll="{ y: 240 }"
                :pagination="false"
                :loading="isLoading"
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
                    <div class="flex items-center w-full">
                        <div class="flex items-center flex-grow">
                            <component
                                :is="images[record.data_type]"
                                class="w-4 h-4 mr-3"
                            ></component>
                            <Tooltip :tooltip-text="text" />
                        </div>
                        <div v-if="record.is_primary" class="">
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
                v-if="list.length <= 0 && !isLoading"
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
    } from 'vue'
    import { useDebounceFn } from '@vueuse/core'
    import { useRoute } from 'vue-router'

    // Components
    import DataTypes from '@common/facets/dataType.vue'
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'

    import preferences from './preferences.vue'
    import Tooltip from '@/common/ellipsis/index.vue'
    import AssetPreview from '@/discovery/preview/assetPreview.vue'

    // Composables
    import { images, dataTypeList } from '~/constant/datatype'
    import {
        useColumns2,
        useColumnAggregation,
    } from '~/composables/asset/useColumns2'

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
            const { dataTypeMap, dataTypeSum, isAggregateLoading } =
                useColumnAggregation({
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

            const getDataType = (type: string) => {
                let label = ''
                dataTypeList.forEach((i) => {
                    if (i.type.includes(type)) label = i.label
                })
                return label
            }

            // filterColumnsList
            const filterColumnsList = () => {
                const filteredListData = list.value.map((i) => ({
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
                columnPreviewData.value = { list }

                columnsData.value = {
                    filteredList: filteredListData,
                }

                // If redirected from asset column discovery
                if (column.value !== '') {
                    list.value?.forEach((singleRow: {}) => {
                        if (singleRow.guid === column.value) {
                            openColumnSidebar(singleRow.attributes.order)
                        }
                    })
                    nextTick(() => {
                        scrollToElement(selectedRow.value)
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
                list.value.forEach((singleRow: {}) => {
                    if (singleRow.attributes.order === columnOrder) {
                        selectedRowData.value = singleRow
                    }
                })

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
                filterColumnsList()
            }

            // rowClassName Antd
            const rowClassName = (record: { key: null }, index: any) =>
                record.key === selectedRow.value
                    ? 'bg-primary-light'
                    : 'bg-transparent'

            /** WATCHERS */
            watch(list, () => {
                filterColumnsList()
            })

            return {
                rowClassName,
                customRow,
                handleSearchChange,
                clearAllFilters,
                clearFiltersAndSearch,
                filters,
                isLoadMore,
                dataTypeMap,
                isLoading,
                loadMore,
                handleFilterChange,
                handleCloseColumnSidebar,
                propagateToColumnList,
                list,
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
    .chip {
        @apply px-1  mr-1;
        @apply rounded;
        @apply flex;
        @apply items-center;
        @apply text-xs;
    }
</style>
