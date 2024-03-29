<template>
    <div>
        <!-- Search and Filter -->
        <div class="w-1/2 mb-3">
            <SearchAdvanced
                v-model:value="queryText"
                :placeholder="`Search ${totalCount} columns`"
                size="minimal"
                @change="handleSearchChange"
            >
                <template #postFilter>
                    <div class="flex items-center justify-between py-1 rounded">
                        <p class="mr-4 text-sm text-gray-500">Sort By</p>

                        <Sorting
                            v-model="preference.sort"
                            asset-type="Column"
                            @change="handleChangeSort"
                        ></Sorting>
                    </div>
                </template>
            </SearchAdvanced>
        </div>
        <!-- Table -->
        <div
            class="flex items-center justify-center w-full border rounded border-gray-light h-96"
        >
            <div
                v-if="isLoading"
                class="flex items-center justify-center flex-grow"
            >
                <AtlanLoader class="h-10" />
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
                    empty-screen="NoAssetsFound"
                    image-class="h-44"
                    desc="No columns found"
                ></EmptyView>
            </div>

            <a-table
                v-else-if="columnsList.length > 0 && !isLoading"
                :columns="columns"
                :data-source="columnsData.filteredList"
                :scroll="{ y: 342, x: 780 }"
                :pagination="false"
                :custom-row="customRow"
                :row-class-name="rowClassName"
                class="self-start column-table"
            >
                <template #bodyCell="{ column, record, text }">
                    <template v-if="column.key === 'hash_index'">
                        <div
                            class="absolute top-0 left-0 flex items-center justify-center w-full h-full text-gray-500 bg-gray-100 border-r border-gray-light"
                            :class="{
                                'selected-row': record.key === selectedRow,
                            }"
                        >
                            {{ text }}
                        </div>
                    </template>
                    <template v-else-if="column.key === 'column_name'">
                        <div
                            :class="{
                                'flex items-center justify-between':
                                    record.is_primary ||
                                    record.is_foreign ||
                                    record.is_partition ||
                                    record.is_sort ||
                                    record.is_indexed,
                            }"
                        >
                            <div class="flex items-center">
                                <component
                                    :is="dataTypeCategoryImage(record.item)"
                                    class="h-4 mr-2 text-gray-500 mb-0.5"
                                ></component>

                                <Tooltip
                                    :tooltip-text="text"
                                    classes="hover:text-primary"
                                    :clamp-percentage="
                                        isScrubbed(record.item) ||
                                        certificateStatus(record.item)
                                            ? '88%'
                                            : '93%'
                                    "
                                />

                                <CertificateBadge
                                    :status="certificateStatus(record.item)"
                                    :username="
                                        certificateUpdatedBy(record.item)
                                    "
                                    :timestamp="
                                        certificateUpdatedAt(record.item)
                                    "
                                    class="mb-0.5 ml-1"
                                ></CertificateBadge>
                                <a-tooltip
                                    v-if="isScrubbed(record.item)"
                                    placement="right"
                                    ><template #title>Limited Access</template>
                                    <AtlanIcon
                                        icon="Lock"
                                        class="h-3.5 mb-0.5 ml-1"
                                    ></AtlanIcon
                                ></a-tooltip>
                            </div>
                            <div
                                v-if="
                                    record.is_primary ||
                                    record.is_foreign ||
                                    record.is_partition ||
                                    record.is_sort ||
                                    record.is_indexed
                                "
                                class="flex items-center"
                            >
                                <ColumnKeys
                                    :is-primary="record.is_primary"
                                    :is-foreign="record.is_foreign"
                                    :is-partition="record.is_partition"
                                    :is-sort="record.is_sort"
                                    :is-indexed="record.is_indexed"
                                />
                            </div>
                        </div>
                    </template>
                    <template v-else-if="column.key === 'data_type'">
                        <span class="data-type">{{ text?.toUpperCase() }}</span>
                    </template>
                    <template v-else-if="column.key === 'description'">
                        <EditableDescription
                            :asset-item="record.item"
                            :tooltip-text="text"
                            :allow-editing="
                                selectedAssetUpdatePermission(record.item, true)
                            "
                            :similar-list="similarListByName(record.item)"
                        />
                    </template>
                </template>
            </a-table>
        </div>

        <!-- Pagination -->
        <div
            v-if="
                ((columnsList && columnsList.length) || isLoading) &&
                Math.ceil(pagination.total) > 1
            "
            class="flex flex-row items-center justify-end w-full mt-4"
        >
            <AtlanBtn
                class="bg-transparent rounded-r-none"
                size="sm"
                color="secondary"
                padding="compact"
                :disabled="pagination.current === 1"
                @click="handlePagination(pagination.current - 1)"
            >
                <AtlanIcon icon="CaretLeft" />
            </AtlanBtn>
            <AtlanBtn
                class="bg-transparent border-l-0 border-r-0 rounded-none cursor-default"
                size="sm"
                color="secondary"
                padding="compact"
            >
                {{ pagination.current }} of
                <span v-if="Math.ceil(pagination.total)"
                    >{{ Math.ceil(pagination.total) }}
                </span>

                <div
                    v-else-if="isValidating"
                    class="flex items-center justify-center"
                >
                    <AtlanLoader />
                </div>
            </AtlanBtn>

            <AtlanBtn
                class="bg-transparent rounded-l-none"
                size="sm"
                color="secondary"
                padding="compact"
                :disabled="pagination.current === Math.ceil(pagination.total)"
                @click="handlePagination(pagination.current + 1)"
            >
                <AtlanIcon icon="CaretRight" />
            </AtlanBtn>
        </div>
        <AssetDrawer
            :guid="selectedRowGuid"
            :show-drawer="showColumnSidebar"
            :watch-guid="true"
            @closeDrawer="handleCloseColumnSidebar"
            @update="handleListUpdate"
        />
    </div>
</template>

<script lang="ts">
    // Vue
    import { defineComponent, watch, ref, Ref, nextTick, computed } from 'vue'

    import { useDebounceFn } from '@vueuse/core'
    import { useRoute } from 'vue-router'

    // Components
    import ErrorView from '@common/error/discover.vue'
    import EmptyView from '@common/empty/index.vue'
    import EditableDescription from '@common/assets/profile/tabs/columns/editableDescription/index.vue'
    import SearchAdvanced from '@/common/input/searchAdvanced.vue'
    import Sorting from '@/common/select/sorting.vue'
    import AssetDrawer from '@/common/assets/preview/drawer.vue'
    import Tooltip from '@/common/ellipsis/index.vue'
    import CertificateBadge from '@/common/badge/certificate/index.vue'
    import AtlanBtn from '@/UI/button.vue'
    import ColumnKeys from '~/components/common/column/columnKeys.vue'

    // Composables
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import { DefaultRelationAttributes } from '~/constant/projection'
    import { useDiscoverList } from '~/composables/discovery/useDiscoverList'
    import { useSimilarList } from '~/composables/discovery/useSimilarList'

    // Interfaces
    import { assetInterface } from '~/types/assets/asset.interface'
    import useEvaluate from '~/composables/auth/useEvaluate'

    export default defineComponent({
        components: {
            EditableDescription,
            SearchAdvanced,
            AssetDrawer,
            EmptyView,
            ErrorView,
            Tooltip,
            CertificateBadge,
            AtlanBtn,
            Sorting,
            ColumnKeys,
        },
        setup() {
            /** DATA */
            const columnsData = ref({})
            const selectedRow = ref(null)
            const selectedRowGuid = ref('')
            const showColumnSidebar = ref<boolean>(false)
            const queryText = ref('')
            const columnsList: Ref<assetInterface[]> = ref([])
            const columnFromUrl: Ref<assetInterface[]> = ref([])

            const openDrawerOnLoad = ref<boolean>(false)

            const {
                selectedAsset,
                certificateStatus,
                certificateUpdatedAt,
                certificateUpdatedBy,
                certificateStatusMessage,
                dataTypeCategoryImage,
                isScrubbed,
                selectedAssetUpdatePermission,
                title,
            } = useAssetInfo()

            const aggregationAttributeName = 'dataType'
            const limit = ref(20)
            const offset = ref(0)
            const facets = ref({
                typeName: 'Column',
            })
            const aggregations = ref([aggregationAttributeName])
            const postFacets = ref({})
            const dependentKey = ref('DEFAULT_COLUMNS')

            const columnAttributes = ref([
                'name',
                'displayName',
                'description',
                'displayDescription',
                'userDescription',
                'certificateStatus',
                'certificateUpdatedBy',
                'meanings',
                'category',
                'dataType',
                'isPrimary',
                'isCustom',
                'isPartition',
                'isSort',
                'isIndexed',
                'isForeign',
                'isDist',
                'order',
            ])

            const defaultAttributes = ref([...columnAttributes.value])
            const preference = ref({
                sort: 'order-asc',
            })
            const relationAttributes = ref([...DefaultRelationAttributes])

            const assetQualifiedName = computed(
                () => selectedAsset.value?.attributes?.qualifiedName
            )

            const updateFacet = () => {
                facets.value = {}
                if (
                    selectedAsset?.value.typeName?.toLowerCase() === 'table' ||
                    selectedAsset?.value.typeName?.toLowerCase() ===
                        'tablepartition'
                ) {
                    facets.value.tableQualifiedName = assetQualifiedName.value
                }
                if (
                    selectedAsset?.value.typeName?.toLowerCase() === 'view' ||
                    selectedAsset?.value.typeName?.toLowerCase() ===
                        'materialisedview'
                ) {
                    facets.value.viewQualifiedName = assetQualifiedName.value
                }
            }

            updateFacet()

            const {
                freshList: list,
                list: combinedList,
                isLoading,
                quickChange,
                totalCount,
                error,
                isValidating,
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
                suppressLogs: true,
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
                selectedRowGuid.value = ''
                showColumnSidebar.value = false
            }
            const openColumnSidebar = (columnOrder) => {
                selectedRow.value = columnOrder
                columnsList.value.forEach((singleRow) => {
                    if (singleRow.attributes.order === columnOrder) {
                        selectedRowGuid.value = singleRow?.guid
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
                    is_foreign: i.attributes.isForeign,
                    is_partition: i.attributes.isPartition,
                    is_sort: i.attributes.isSort,
                    is_indexed: i.attributes.isIndexed,
                    description:
                        i.attributes.userDescription ||
                        i.attributes.description ||
                        '---',
                    item: i,
                }))
                columnsData.value = {
                    filteredList: filteredListData,
                }
            }

            const handleListUpdate = (asset: any) => {
                const index = list.value?.findIndex(
                    (i) => i?.guid === asset?.guid
                )
                if (index > -1) {
                    list.value[index] = asset
                }

                // In case column from url was updated instead of the other list (20 items)
                if (asset?.guid === columnFromUrl.value[0]?.guid) {
                    columnFromUrl.value[0] = asset
                }

                filterColumnsList()
            }

            const pagination = computed(() => ({
                total: totalCount.value / limit.value,

                current: offset.value / limit.value + 1,
            }))

            const handlePagination = (page) => {
                offset.value = (page - 1) * 20
                quickChange()
            }

            const handleSearchChange = useDebounceFn(() => {
                offset.value = 0
                quickChange()
            }, 150)

            const handleChangeSort = () => {
                quickChange()
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

            const bodyEvaluation = ref({})
            const { refresh: refreshEvaluate } = useEvaluate(
                bodyEvaluation,
                false,
                true
            ) // true for secondaryEvaluations

            // rowClassName Antd
            const rowClassName = (record: { key: null }) =>
                record.key === selectedRow.value
                    ? 'bg-primary-light'
                    : 'bg-transparent'

            // Description suggestions

            const suggestionLimit = ref(0)
            const suggestionOffset = ref(0)
            const suggestionFacets = ref({
                typeNames: ['Column'],
                orExists: ['description', 'userDescription'],
                similarities: [],
            })
            const suggestionAggregations = ref(['name'])

            const { quickChange: quickSuggestionChange, similarListByName } =
                useSimilarList({
                    limit: suggestionLimit,
                    offset: suggestionOffset,
                    facets: suggestionFacets,
                    aggregations: suggestionAggregations,
                })

            /** WATCHERS */
            watch(
                () => [...list.value],
                () => {
                    // If redirected from asset column discovery
                    if (column.value !== '') {
                        columnFromUrl.value = []
                        const limit = ref(1)
                        const offset = ref(0)
                        const facets = ref({
                            guid: column.value,
                        })
                        const fetchKey = computed(() => {
                            if (
                                combinedList.value.some(
                                    (item) => item.guid === column.value
                                )
                            ) {
                                return null
                            }
                            return column.value
                        })
                        const dependentKey = ref(fetchKey.value)

                        const { freshList: urlColumnList } = useDiscoverList({
                            isCache: false,
                            dependentKey,
                            facets,
                            limit,
                            offset,
                            attributes: defaultAttributes,
                            relationAttributes,
                            suppressLogs: true,
                        })
                        watch([urlColumnList], () => {
                            columnFromUrl.value = urlColumnList.value
                            filterColumnsList()
                        })
                        if (fetchKey.value === null) {
                            filterColumnsList()
                        }
                    } else {
                        filterColumnsList()
                    }

                    bodyEvaluation.value = {
                        entities: list.value.map((item) => ({
                            typeName: item.typeName,
                            entityGuid: item.guid,
                            action: 'ENTITY_UPDATE',
                        })),
                    }
                    refreshEvaluate()

                    suggestionFacets.value = {
                        ...suggestionFacets.value,
                        similarities: list.value.map((item) => title(item)),
                    }

                    quickSuggestionChange()
                }
            )

            watch(
                () => [...columnsList.value],
                () => {
                    if (!openDrawerOnLoad.value) {
                        columnsList.value?.forEach((singleRow) => {
                            if (singleRow.guid === column.value) {
                                openColumnSidebar(singleRow.attributes.order)
                            }
                        })
                        openDrawerOnLoad.value = true

                        nextTick(() => {
                            scrollToElement()
                        })
                    }
                }
            )

            return {
                rowClassName,
                customRow,
                handleSearchChange,
                handleListUpdate,
                handleCloseColumnSidebar,
                isScrubbed,
                isLoading,
                columnsList,
                totalCount,
                preference,
                error,
                isValidating,
                certificateStatus,
                certificateUpdatedAt,
                certificateUpdatedBy,
                certificateStatusMessage,
                dataTypeCategoryImage,
                selectedRow,
                columnsData,
                queryText,
                handlePagination,
                handleChangeSort,
                showColumnSidebar,
                pagination,
                selectedRowGuid,
                defaultAttributes,
                similarListByName,
                columns: [
                    {
                        width: 50,
                        title: '#',
                        dataIndex: 'hash_index',
                        key: 'hash_index',
                        align: 'center',
                    },
                    {
                        width: 280,
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
                        width: 300,
                        title: 'Description',
                        dataIndex: 'description',
                        key: 'description',
                    },
                ],
                selectedAssetUpdatePermission,
            }
        },
    })
</script>

<style lang="less" scoped>
    @font-face {
        font-family: Hack;
        src: url('~/assets/fonts/hack/Hack-Regular.ttf');
    }
    .data-type {
        font-family: Hack !important;
        @apply text-gray-500 text-xs !important;
    }

    .selected-row {
        @apply border-r-2 border-primary !important;
    }
</style>
