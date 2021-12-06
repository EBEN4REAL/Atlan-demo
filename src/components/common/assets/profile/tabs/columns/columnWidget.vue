<template>
    <div>
        <!-- Search and Filter -->
        <div class="w-1/2 mb-3">
            <SearchAndFilter
                v-model:value="queryText"
                :autofocus="true"
                :placeholder="`Search ${totalCount} columns`"
                @change="handleSearchChange"
                size="minimal"
            />
        </div>
        <!-- Table -->
        <div
            class="flex items-center justify-center w-full border rounded  h-96 border-gray-light"
        >
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
                <ErrorView />
            </div>
            <div
                v-else-if="columnsList.length === 0 && !isLoading"
                class="flex-grow"
            >
                <EmptyView
                    empty-screen="EmptyDiscover"
                    desc="No columns found"
                ></EmptyView>
            </div>
            <a-table
                v-else
                :columns="columns"
                :data-source="columnsData.filteredList"
                :scroll="{ y: 300 }"
                :class="$style.columnTable"
                :pagination="false"
                :custom-row="customRow"
                :row-class-name="rowClassName"
                size="small"
            >
                <template #bodyCell="{ column, record, text }">
                    <template v-if="column.key === 'hash_index'">
                        <div
                            :class="{
                                'border-primary': record.key === selectedRow,
                            }"
                            class="border-l-4 border-transparent"
                        >
                            <span class="mr-1">{{ text }}</span>
                        </div>
                    </template>
                    <template v-else-if="column.key === 'column_name'">
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

                                <!--  <div v-if="record.is_primary" class="mb-1 ml-2">
                                    <AtlanIcon icon="Pin" />
                                </div> -->
                            </div>
                            <div v-if="record.is_primary">
                                <AtlanIcon icon="PrimaryKey" />
                            </div>
                        </div>
                    </template>
                    <template v-else-if="column.key === 'description'">
                        <Tooltip :tooltip-text="text" />
                    </template>
                </template>
            </a-table>

            <!-- <div
                v-if="isLoadMore"
                class="flex items-center justify-center mt-3"
            >
                <button
                    v-if="!isLoading"
                    class="flex items-center justify-between py-2 transition-all duration-300 bg-white rounded-full text-primary"
                    @click="handleLoadMore"
                >
                    <p
                        class="m-0 mr-1 overflow-hidden text-sm transition-all duration-300 overflow-ellipsis whitespace-nowrap"
                    >
                        Load more
                    </p>
                    <AtlanIcon icon="ArrowDown" />
                </button>
            </div> -->
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
    import { defineComponent, watch, computed, ref, Ref, nextTick } from 'vue'

    import { useDebounceFn } from '@vueuse/core'
    import { useRoute } from 'vue-router'

    // Components
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'
    import AssetDrawer from '@/common/assets/preview/drawer.vue'
    import EmptyView from '@common/empty/index.vue'
    import ErrorView from '@common/error/discover.vue'
    import Tooltip from '@/common/ellipsis/index.vue'

    // Composables
    import { images, dataTypeCategoryList } from '~/constant/dataType'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import {
        AssetAttributes,
        AssetRelationAttributes,
        InternalAttributes,
        SQLAttributes,
    } from '~/constant/projection'
    import { useDiscoverList } from '~/composables/discovery/useDiscoverList'
    import useTypedefData from '~/composables/typedefs/useTypedefData'

    // Interfaces
    import { assetInterface } from '~/types/assets/asset.interface'

    export default defineComponent({
        components: {
            SearchAndFilter,
            AssetDrawer,
            EmptyView,
            ErrorView,
            Tooltip,
        },
        setup() {
            /** DATA */
            const columnsData = ref({})
            const selectedRow = ref(null)
            const selectedRowData = ref({})
            const showColumnSidebar = ref<boolean>(false)
            const queryText = ref('')
            const columnsList: Ref<assetInterface[]> = ref([])
            const columnFromUrl: Ref<assetInterface[]> = ref([])

            const { selectedAsset } = useAssetInfo()

            const aggregationAttributeName = 'dataType'
            const limit = ref(20)
            const offset = ref(0)
            const facets = ref({
                typeName: 'Column',
            })
            const aggregations = ref([aggregationAttributeName])
            const postFacets = ref({})
            const dependentKey = ref('DEFAULT_COLUMNS')
            const { customMetadataProjections } = useTypedefData()
            const defaultAttributes = ref([
                ...InternalAttributes,
                ...AssetAttributes,
                ...SQLAttributes,
                ...customMetadataProjections,
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
                isLoadMore,
                quickChange,
                totalCount,
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

            /** UTILS */
            const route = useRoute()

            const column = computed(() => route?.query?.column || '')

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
                selectedRow.value = null
                selectedRowData.value = {}
                showColumnSidebar.value = false
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

            // filterColumnsList
            const filterColumnsList = () => {
                columnsList.value = [...list.value, ...columnFromUrl.value]

                const filteredListData = columnsList.value.map((i) => ({
                    key: i.attributes.order,
                    hash_index: i.attributes.order,
                    column_name: i.attributes.name,
                    data_type: i.attributes.dataType,
                    is_primary: i.attributes.isPrimary,
                    description:
                        i.attributes.userDescription ||
                        i.attributes.description ||
                        '---',
                }))
                columnsData.value = {
                    filteredList: filteredListData,
                }
            }

            const handleListUpdate = (asset: any) => {
                updateList(asset)
                selectedRowData.value = asset

                // In case column from url was updated instead of the other list (20 items)
                if (asset.guid === columnFromUrl.value[0]?.guid) {
                    columnFromUrl.value[0] = asset
                }

                filterColumnsList()
            }

            const handleLoadMore = () => {
                if (isLoadMore.value) {
                    offset.value += limit.value
                }
                quickChange()
            }

            const handleSearchChange = useDebounceFn(() => {
                offset.value = 0
                quickChange()
            }, 150)

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
                // If redirected from asset column discovery
                if (column.value !== '') {
                    const limit = ref(1)
                    const offset = ref(0)
                    const facets = ref({
                        guid: column.value,
                    })
                    const fetchKey = computed(() => {
                        if (
                            list.value.some(
                                (item) => item.guid === column.value
                            )
                        ) {
                            return null
                        }
                        return column.value
                    })
                    const dependentKey = ref(fetchKey.value)

                    const { list: urlColumnList } = useDiscoverList({
                        isCache: false,
                        dependentKey,
                        facets,
                        limit,
                        offset,
                        attributes: defaultAttributes,
                        relationAttributes,
                    })
                    watch([urlColumnList], () => {
                        columnFromUrl.value = urlColumnList.value
                        filterColumnsList()

                        columnsList.value?.forEach((singleRow) => {
                            if (singleRow.guid === column.value) {
                                openColumnSidebar(singleRow.attributes.order)
                            }
                        })

                        nextTick(() => {
                            scrollToElement()
                        })
                    })
                } else {
                    filterColumnsList()
                }
            })

            return {
                rowClassName,
                customRow,
                handleSearchChange,
                isLoadMore,
                handleListUpdate,
                handleCloseColumnSidebar,
                isLoading,
                columnsList,
                totalCount,
                error,
                isValidating,
                selectedRow,
                columnsData,
                queryText,
                showColumnSidebar,
                selectedRowData,
                images,
                handleLoadMore,
                columns: [
                    {
                        width: 50,
                        title: '#',
                        dataIndex: 'hash_index',
                        key: 'hash_index',
                    },
                    {
                        width: 240,
                        title: 'Column Name',
                        dataIndex: 'column_name',
                        key: 'column_name',
                    },
                    {
                        width: 150,
                        title: 'Data Type',
                        dataIndex: 'data_type',
                        key: 'data_type',
                    },
                    {
                        title: 'Description',
                        dataIndex: 'description',
                        key: 'description',
                    },
                ],
            }
        },
    })
</script>

<style lang="less" module>
    .columnTable {
        .ant-table {
            @apply !important;
        }
        .ant-table th {
            @apply whitespace-nowrap font-bold !important;
        }

        .ant-table td {
            @apply max-w-xs relative cursor-pointer !important;
        }
    }
</style>
