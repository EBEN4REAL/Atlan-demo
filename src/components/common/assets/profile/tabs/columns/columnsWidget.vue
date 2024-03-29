<template>
    <div
        class="h-full bg-white border border-gray-300 rounded-lg"
        :class="showColumnSidebar ? 'max-collapsed-width' : 'max-full-width'"
    >
        <!-- Search and Filter -->
        <div class="flex items-center w-full px-5 py-4 gap-x-4">
            <div
                class="px-4 border rounded-md border-gray-light w-72 min-w-max"
            >
                <SearchAdvanced
                    v-model:value="queryText"
                    :placeholder="`Search ${totalCount} columns`"
                    :autofocus="true"
                    :allow-clear="true"
                    :is-loading="isValidating"
                    @change="handleSearchChange"
                >
                    <template #sort>
                        <Sorting
                            v-model="preference.sort"
                            asset-type="Column"
                            @change="handleChangeSort"
                        />
                    </template>
                </SearchAdvanced>
            </div>
            <AggregationTabs
                v-model="postFacets.dataType"
                :list="columnDataTypeAggregationList"
                class="mt-1 overflow-auto"
                @change="handleDataTypeChange"
            ></AggregationTabs>
        </div>
        <!-- Table -->
        <div
            class="flex items-center justify-center w-full border-t border-gray-light"
            style="height: calc(100vh - 330px)"
        >
            <div
                v-if="
                    !isValidating &&
                    error?.message !== 'operation cancelled' &&
                    error
                "
                class="flex items-center justify-center flex-grow"
            >
                <ErrorView />
            </div>

            <div
                v-else-if="columnsList.length === 0 && !isValidating"
                class="flex-grow"
            >
                <EmptyView
                    empty-screen="NoAssetsFound"
                    image-class="h-44"
                    desc="No columns found"
                ></EmptyView>
            </div>

            <div
                v-else-if="columnsList.length === 0 && isValidating"
                class="flex items-center justify-center flex-grow"
            >
                <AtlanLoader class="h-8" />
            </div>

            <a-table
                v-else
                ref="tableRef"
                :columns="columns"
                :data-source="columnsData.filteredList"
                :scroll="{
                    x: 1200,
                    y: 'calc(100vh - 378px)',
                    scrollToFirstRowOnChange: false,
                }"
                :pagination="false"
                :custom-row="customRow"
                :row-class-name="rowClassName"
                class="self-start columns-widget"
                :class="{ 'opacity-60': isValidating }"
            >
                <template #bodyCell="{ column, record, text }">
                    <template v-if="column.key === 'hash_index'">
                        <div
                            class="absolute top-0 left-0 flex justify-center w-full h-full pt-3 text-gray-500 bg-gray-100 border-r border-gray-light"
                            :class="{
                                'selected-row': record.key === selectedRow,
                            }"
                        >
                            {{ text }}
                        </div>
                    </template>
                    <template v-else-if="column.key === 'column_name'">
                        <div class="flex flex-col gap-y-1">
                            <div class="flex items-center">
                                <component
                                    :is="dataTypeCategoryImage(record.item)"
                                    class="h-4 mr-1 text-gray-500 mb-0.5"
                                    style="min-width: 16px"
                                ></component>

                                <Tooltip
                                    :tooltip-text="text"
                                    classes="hover:text-primary font-bold text-new-gray-800 hover:underline"
                                    width="1000px"
                                    :clamp-percentage="
                                        record.is_primary ||
                                        record.is_foreign ||
                                        record.is_partition ||
                                        record.is_sort ||
                                        record.is_indexed
                                            ? '60%'
                                            : isScrubbed(record.item) ||
                                              certificateStatus(record.item)
                                            ? '80%'
                                            : '84%'
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

                                <div class="ml-2 data-type">
                                    {{ record.data_type }}
                                </div>

                                <div
                                    v-if="
                                        record.is_primary ||
                                        record.is_foreign ||
                                        record.is_partition ||
                                        record.is_sort ||
                                        record.is_indexed
                                    "
                                    class="flex items-center ml-2"
                                >
                                    <ColumnKeys
                                        :is-primary="record.is_primary"
                                        :is-foreign="record.is_foreign"
                                        :is-partition="record.is_partition"
                                        :is-sort="record.is_sort"
                                        :is-indexed="record.is_indexed"
                                    />
                                </div>

                                <div
                                    v-if="record.item?.attributes?.__hasLineage"
                                    class="ml-2"
                                >
                                    <a-tooltip placement="top" color="#2A2F45"
                                        ><template #title
                                            >This column has lineage</template
                                        >
                                        <AtlanIcon
                                            icon="LineageSmall"
                                            class="w-4 h-4 cursor-pointer mb-0.5 text-gray-500"
                                        ></AtlanIcon>
                                    </a-tooltip>
                                </div>
                            </div>

                            <EditableDescription
                                :asset-item="record.item"
                                :tooltip-text="record.description"
                                :allow-editing="
                                    columnUpdatePermission(record.item)
                                "
                                :similar-list="similarListByName(record.item)"
                                @update="handleExtraDrawerClick"
                            />
                        </div>
                    </template>

                    <template v-else-if="column.key === 'classifications'">
                        <EditableClassifications
                            :asset="record.item"
                            @update="handleExtraDrawerClick"
                            @popoverActive="() => (preventClick = true)"
                        />
                    </template>
                    <template v-else-if="column.key === 'terms'">
                        <EditableTerms
                            :asset="record.item"
                            @update="handleExtraDrawerClick"
                            @popoverActive="() => (preventClick = true)"
                        />
                    </template>
                </template>
            </a-table>
        </div>

        <!-- Pagination -->
        <div
            v-if="(columnsList && columnsList.length) || isValidating"
            class="flex items-center justify-between w-full p-5 text-sm border-t border-gray-light"
        >
            <div class="text-new-gray-600">
                Showing
                <span class="font-bold">{{ columnsList?.length || 0 }}</span>
                out of {{ totalCount }} columns
            </div>
            <div
                v-if="isValidating && columnsList?.length !== 0"
                class="text-new-gray-600"
            >
                Loading <span class="font-bold">20</span> more...
                <AtlanLoader class="h-4 mb-0.5" />
            </div>
        </div>

        <AssetDrawer
            :data="drawerData"
            :guid="selectedRowGuid"
            :show-mask="false"
            :show-drawer="showColumnSidebar"
            :show-collapse-button="true"
            :watch-guid="true"
            @closeDrawer="handleCloseColumnSidebar"
            @update="handleListUpdate"
        />
    </div>
</template>

<script lang="ts">
    // Vue
    import { defineComponent, watch, ref, Ref, computed, provide } from 'vue'

    import { useDebounceFn, watchOnce, useInfiniteScroll } from '@vueuse/core'

    // Components
    import ErrorView from '@common/error/discover.vue'
    import EmptyView from '@common/empty/index.vue'
    import EditableDescription from './editableDescription/index.vue'
    import SearchAdvanced from '@/common/input/searchAdvanced.vue'
    import Sorting from '@/common/dropdown/sorting.vue'
    import AssetDrawer from '@/common/assets/preview/drawer.vue'
    import Tooltip from '@/common/ellipsis/index.vue'
    import CertificateBadge from '@/common/badge/certificate/index.vue'
    import AtlanBtn from '@/UI/button.vue'
    import ColumnKeys from '~/components/common/column/columnKeys.vue'
    import AggregationTabs from '@/common/tabs/aggregationTabs.vue'
    import EditableClassifications from './editableClassifications.vue'
    import EditableTerms from './editableTerms.vue'
    import Pill from '~/components/UI/pill/pill.vue'

    // Composables
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import { DefaultRelationAttributes } from '~/constant/projection'
    import { useDiscoverList } from '~/composables/discovery/useDiscoverList'
    import { useSimilarList } from '~/composables/discovery/useSimilarList'
    import useEvaluate from '~/composables/auth/useEvaluate'

    // Interfaces
    import { assetInterface } from '~/types/assets/asset.interface'

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
            AggregationTabs,
            EditableClassifications,
            EditableTerms,
            Pill,
        },
        setup() {
            /** DATA */
            const columnsData = ref({})
            const selectedRow = ref(null)
            const selectedRowGuid = ref('')
            const showColumnSidebar = ref<boolean>(false)
            const queryText = ref('')
            const columnsList: Ref<assetInterface[]> = ref([])
            const tableRef = ref(null)

            const drawerData = ref({})
            const preventClick = ref(false)
            const shouldLoadMore = ref(true)

            const {
                selectedAsset,
                certificateStatus,
                certificateUpdatedAt,
                certificateUpdatedBy,
                certificateStatusMessage,
                dataTypeCategoryImage,
                isScrubbed,
                columnUpdatePermission,
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
                'certificateUpdatedAt',
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
                '__hasLineage',
            ])

            const defaultAttributes = ref([...columnAttributes.value])
            const preference = ref({
                sort: 'order-asc',
            })
            const relationAttributes = ref([
                ...DefaultRelationAttributes,
                '__state',
            ])

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
                freshList,
                list,
                isLoading,
                quickChange,
                getAggregationList,
                totalCount,
                error,
                isValidating,
                isLoadMore,
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

            const columnDataTypeAggregationList = computed(() =>
                getAggregationList(
                    `group_by_${aggregationAttributeName}`,
                    [],
                    true
                )
            )

            const scrollToTop = () => {
                const tableRow = document.querySelector(
                    `tr[data-row-key="${columnsList.value[0]?.attributes?.order}"]`
                )

                if (tableRow) {
                    tableRow.scrollIntoView({
                        block: 'nearest',
                        inline: 'nearest',
                        behavior: 'smooth',
                    })
                }
            }

            const handleCloseColumnSidebar = () => {
                if (!preventClick.value) {
                    selectedRow.value = null
                    selectedRowGuid.value = ''
                    showColumnSidebar.value = false
                }
            }
            const openColumnSidebar = (columnOrder) => {
                if (!preventClick.value) {
                    selectedRow.value = columnOrder
                    columnsList.value.forEach((singleRow) => {
                        if (singleRow.attributes.order === columnOrder) {
                            selectedRowGuid.value = singleRow?.guid
                        }
                    })

                    showColumnSidebar.value = true
                }
            }

            // filterColumnsList
            const filterColumnsList = () => {
                columnsList.value = [...list.value]

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
                const index = list.value.findIndex((i) => i.guid === asset.guid)
                if (index > -1) {
                    list.value[index] = asset
                }

                filterColumnsList()
            }

            const handleLoadMore = async () => {
                if (isLoadMore.value) {
                    offset.value += limit.value
                    await quickChange()
                }
            }

            const handleSearchChange = useDebounceFn(() => {
                offset.value = 0
                quickChange()
            }, 150)

            const handleDataTypeChange = () => {
                offset.value = 0
                quickChange()
            }

            const handleChangeSort = async () => {
                list.value = []
                await scrollToTop()
                offset.value = 0
                await quickChange()
            }

            // customRow Antd
            const customRow = (record: { key: null }) => ({
                onClick: () => {
                    // Column drawer trigger
                    if (!preventClick.value) {
                        if (selectedRow.value === record.key)
                            handleCloseColumnSidebar()
                        else {
                            openColumnSidebar(record.key)
                        }
                    }
                },
            })

            const updateColumnList = (asset) => {
                if (selectedRowGuid.value === asset?.guid) {
                    drawerData.value = asset
                }
            }

            provide('updateColumnList', updateColumnList)

            const bodyEvaluation = ref({})
            const { refresh: refreshEvaluate } = useEvaluate(
                bodyEvaluation,
                false,
                false,
                true
            ) // true for columnEvaluations

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

            // rowClassName Antd
            const rowClassName = (record: { key: null }) =>
                record.key === selectedRow.value ? 'bg-primary-menu' : ''

            const setAsyncTimeout = (cb, timeout = 0) =>
                new Promise<void>((resolve) => {
                    setTimeout(() => {
                        cb()
                        resolve()
                    }, timeout)
                })

            const handleExtraDrawerClick = async () => {
                preventClick.value = true
                await setAsyncTimeout(() => {
                    preventClick.value = false
                }, 600)
            }

            /** WATCHERS */
            watch(
                () => [...freshList.value],
                () => {
                    filterColumnsList()

                    let actions = []

                    freshList.value.forEach((item) =>
                        actions.push(
                            {
                                typeName: item.typeName,
                                entityId: item?.attributes?.qualifiedName,
                                action: 'ENTITY_UPDATE',
                            },
                            {
                                typeName: item.typeName,
                                entityId: item?.attributes?.qualifiedName,
                                action: 'ENTITY_ADD_CLASSIFICATION',
                                classification: '*',
                            },
                            {
                                typeName: item.typeName,
                                entityId: item?.attributes?.qualifiedName,
                                action: 'ENTITY_REMOVE_CLASSIFICATION',
                                classification: '*',
                            },
                            {
                                action: 'RELATIONSHIP_ADD',
                                relationShipTypeName:
                                    'AtlasGlossarySemanticAssignment',
                                entityIdEnd1: '*',
                                entityTypeEnd1: 'AtlasGlossaryTerm',
                                entityIdEnd2: item?.attributes?.qualifiedName,
                                entityTypeEnd2: item.typeName,
                            },
                            {
                                action: 'RELATIONSHIP_REMOVE',
                                relationShipTypeName:
                                    'AtlasGlossarySemanticAssignment',
                                entityIdEnd1: '*',
                                entityTypeEnd1: 'AtlasGlossaryTerm',
                                entityIdEnd2: item?.attributes?.qualifiedName,
                                entityTypeEnd2: item.typeName,
                            }
                        )
                    )
                    bodyEvaluation.value = {
                        entities: actions,
                    }

                    refreshEvaluate()

                    actions = []

                    suggestionFacets.value = {
                        ...suggestionFacets.value,
                        similarities: freshList.value.map((item) =>
                            title(item)
                        ),
                    }

                    quickSuggestionChange()
                }
            )

            const columnlistRef = ref<Element | null>(null)

            watchOnce(tableRef, () => {
                if (tableRef.value) {
                    columnlistRef.value = document.querySelector(
                        '.columns-widget .ant-table-body'
                    )
                }
            })

            useInfiniteScroll(
                columnlistRef,
                () => {
                    if (columnlistRef.value) {
                        handleLoadMore()
                    }
                },
                { distance: 10 }
            )

            return {
                rowClassName,
                customRow,
                handleSearchChange,
                handleListUpdate,
                handleCloseColumnSidebar,
                isScrubbed,
                columnDataTypeAggregationList,
                isLoading,
                columnsList,
                totalCount,
                preference,
                error,
                isValidating,
                postFacets,
                certificateStatus,
                certificateUpdatedAt,
                certificateUpdatedBy,
                certificateStatusMessage,
                dataTypeCategoryImage,
                handleDataTypeChange,
                selectedRow,
                columnsData,
                queryText,
                handleChangeSort,
                showColumnSidebar,
                selectedRowGuid,
                defaultAttributes,
                limit,
                offset,
                drawerData,
                tableRef,
                preventClick,
                columns: [
                    {
                        width: 50,
                        title: '#',
                        dataIndex: 'hash_index',
                        key: 'hash_index',
                        align: 'center',
                        fixed: 'left',
                    },
                    {
                        width: 600,
                        title: 'COLUMN',
                        dataIndex: 'column_name',
                        key: 'column_name',
                    },
                    {
                        title: 'CLASSIFICATIONS',
                        dataIndex: 'classifications',
                        key: 'classifications',
                        width: 275,
                    },
                    {
                        title: 'TERMS',
                        dataIndex: 'terms',
                        key: 'terms',
                        width: 275,
                    },
                    {
                        width: 100,
                    },
                ],
                columnUpdatePermission,
                similarListByName,
                handleExtraDrawerClick,
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
        padding: 2px 8px !important;
        @apply text-gray-500 text-xs border border-gray-200 rounded-full bg-white !important;
    }

    .selected-row {
        @apply border-r-2 border-primary !important;
    }

    .max-collapsed-width {
        max-width: calc(100vw - 528px);
        transition: max-width 0.3s ease-in-out;
    }

    .max-full-width {
        max-width: calc(100vw - 108px);
        transition: max-width 0.3s ease-in-out;
    }
</style>
