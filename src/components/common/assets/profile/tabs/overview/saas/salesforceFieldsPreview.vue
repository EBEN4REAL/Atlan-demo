<template>
    <div class="max-profile-width">
        <!-- Search and Filter -->
        <div class="w-1/2 mb-3">
            <SearchAdvanced
                v-model:value="queryText"
                :placeholder="`Search ${totalCount} fields`"
                size="minimal"
                @change="handleSearchChange"
            >
                <template #postFilter>
                    <div class="flex items-center justify-between py-1 rounded">
                        <p class="mr-4 text-sm text-gray-500">Sort By</p>

                        <Sorting
                            v-model="preference.sort"
                            asset-type="SalesforceField"
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
                v-else-if="fieldsList.length === 0 && !isLoading"
                class="flex-grow"
            >
                <EmptyView
                    empty-screen="NoAssetsFound"
                    image-class="h-44"
                    desc="No fields found"
                ></EmptyView>
            </div>

            <a-table
                v-else-if="fieldsList.length > 0 && !isLoading"
                :columns="columns"
                :data-source="fieldsData.filteredList"
                :scroll="{ y: 342, x: true }"
                :pagination="false"
                :custom-row="customRow"
                :row-class-name="rowClassName"
                class="self-start overflow-hidden column-table"
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
                    <template v-else-if="column.key === 'field_name'">
                        <div
                            :class="{
                                'flex items-center justify-between':
                                    record.is_primary,
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
                                />

                                <CertificateBadge
                                    v-if="certificateStatus(record.item)"
                                    :status="certificateStatus(record.item)"
                                    :username="
                                        certificateUpdatedBy(record.item)
                                    "
                                    :timestamp="
                                        certificateUpdatedAt(record.item)
                                    "
                                    class="mb-0.5 ml-1"
                                ></CertificateBadge>
                                <a-tooltip placement="right"
                                    ><template #title>Limited Access</template>
                                    <AtlanIcon
                                        v-if="isScrubbed(record.item)"
                                        icon="Lock"
                                        class="h-3.5 mb-0.5 ml-1"
                                    ></AtlanIcon
                                ></a-tooltip>
                            </div>
                            <div v-if="record.is_primary">
                                <AtlanIcon icon="PrimaryKey" />
                            </div>
                        </div>
                    </template>
                    <template v-else-if="column.key === 'data_type'">
                        <div class="flex items-center data-type">
                            <span class="mr-1">{{ text?.toUpperCase() }}</span>

                            <span
                                v-if="record?.lookup?.length > 0"
                                class="truncate"
                                style="max-width: 10rem"
                                >({{ record?.lookup?.join(', ') }})</span
                            >
                        </div>
                    </template>
                    <template v-else-if="column.key === 'description'">
                        <Tooltip :tooltip-text="text" />
                    </template>
                </template>
            </a-table>
        </div>

        <!-- Pagination -->
        <div
            v-if="(fieldsList && fieldsList.length) || isLoading"
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
            :data="selectedRowData"
            :show-drawer="showFieldSidebar"
            @closeDrawer="handleCloseFieldSidebar"
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
    import ErrorView from '@common/error/discover.vue'
    import EmptyView from '@common/empty/index.vue'
    import SearchAdvanced from '@/common/input/searchAdvanced.vue'
    import Sorting from '@/common/select/sorting.vue'
    import AssetDrawer from '@/common/assets/preview/drawer.vue'
    import Tooltip from '@/common/ellipsis/index.vue'
    import CertificateBadge from '@/common/badge/certificate/index.vue'
    import AtlanBtn from '@/UI/button.vue'

    // Composables
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
            SearchAdvanced,
            AssetDrawer,
            EmptyView,
            ErrorView,
            Tooltip,
            CertificateBadge,
            AtlanBtn,
            Sorting,
        },

        setup() {
            /** DATA */
            const fieldsData = ref({})
            const selectedRow = ref(null)
            const selectedRowData = ref({})
            const showFieldSidebar = ref<boolean>(false)
            const queryText = ref('')
            const fieldsList: Ref<assetInterface[]> = ref([])
            const fieldFromUrl: Ref<assetInterface[]> = ref([])

            const openDrawerOnLoad = ref<boolean>(false)

            const {
                selectedAsset,
                certificateStatus,
                certificateUpdatedAt,
                certificateUpdatedBy,
                certificateStatusMessage,
                dataTypeCategoryImage,
                isScrubbed,
            } = useAssetInfo()

            const aggregationAttributeName = 'fieldDataType'
            const limit = ref(20)
            const offset = ref(0)
            const facets = ref({
                typeName: 'SalesforceField',
            })
            const aggregations = ref([aggregationAttributeName])
            const postFacets = ref({})
            const dependentKey = ref('DEFAULT_FIELDS')
            const { customMetadataProjections } = useTypedefData()
            const defaultAttributes = ref([
                ...InternalAttributes,
                ...AssetAttributes,
                ...SQLAttributes,
                ...customMetadataProjections,
                'lookupObjects',
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

                if (
                    selectedAsset?.value.typeName?.toLowerCase() ===
                    'salesforceobject'
                ) {
                    facets.value.typeName = 'SalesforceField'
                    facets.value.objectQualifiedName = assetQualifiedName.value
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

            const field = computed(() => route?.query?.field || '')

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

            const handleCloseFieldSidebar = () => {
                selectedRow.value = null
                selectedRowData.value = {}
                showFieldSidebar.value = false
            }
            const openFieldSidebar = (fieldOrder) => {
                selectedRow.value = fieldOrder
                fieldsList.value.forEach((singleRow) => {
                    if (singleRow.attributes.order === fieldOrder) {
                        selectedRowData.value = singleRow
                    }
                })

                showFieldSidebar.value = true
            }

            // filterFieldsList
            const filterFieldsList = () => {
                fieldsList.value = [...list.value, ...fieldFromUrl.value]

                const filteredListData = fieldsList.value.map((i) => ({
                    key: i.attributes.order,
                    hash_index: i.attributes.order,
                    field_name: i.attributes.name,
                    data_type: i.attributes.dataType,
                    lookup: i.attributes?.lookupObjects?.map(
                        (obj) => obj?.attributes?.name
                    ),
                    description:
                        i.attributes.userDescription ||
                        i.attributes.description ||
                        '---',
                    item: i,
                }))
                fieldsData.value = {
                    filteredList: filteredListData,
                }
            }

            const handleListUpdate = (asset: any) => {
                selectedRowData.value = asset

                const index = list.value.findIndex((i) => i.guid === asset.guid)
                if (index > -1) {
                    list.value[index] = asset
                }

                // In case field from url was updated instead of the other list (20 items)
                if (asset.guid === fieldFromUrl.value[0]?.guid) {
                    fieldFromUrl.value[0] = asset
                }

                filterFieldsList()
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
                    // Field drawer trigger
                    if (selectedRow.value === record.key)
                        handleCloseFieldSidebar()
                    else {
                        openFieldSidebar(record.key)
                    }
                },
            })

            // rowClassName Antd
            const rowClassName = (record: { key: null }) =>
                record.key === selectedRow.value
                    ? 'bg-primary-light'
                    : 'bg-transparent'

            /** WATCHERS */
            watch(
                () => [...list.value],
                () => {
                    // If redirected from salesforce fields discovery
                    if (field.value !== '') {
                        fieldFromUrl.value = []
                        const limit = ref(1)
                        const offset = ref(0)
                        const facets = ref({
                            guid: field.value,
                        })
                        const fetchKey = computed(() => {
                            if (
                                combinedList.value.some(
                                    (item) => item.guid === field.value
                                )
                            ) {
                                return null
                            }
                            return field.value
                        })
                        const dependentKey = ref(fetchKey.value)

                        const { freshList: urlFieldList } = useDiscoverList({
                            isCache: false,
                            dependentKey,
                            facets,
                            limit,
                            offset,
                            attributes: defaultAttributes,
                            relationAttributes,
                            suppressLogs: true,
                        })
                        watch([urlFieldList], () => {
                            fieldFromUrl.value = urlFieldList.value
                            filterFieldsList()
                        })
                        if (fetchKey.value === null) {
                            filterFieldsList()
                        }
                    } else {
                        filterFieldsList()
                    }
                }
            )

            watch(
                () => [...fieldsList.value],
                () => {
                    if (!openDrawerOnLoad.value) {
                        fieldsList.value?.forEach((singleRow) => {
                            if (singleRow.guid === field.value) {
                                openFieldSidebar(singleRow.attributes.order)
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
                handleCloseFieldSidebar,
                isScrubbed,
                isLoading,
                fieldsList,
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
                fieldsData,
                queryText,
                handlePagination,
                handleChangeSort,
                showFieldSidebar,
                pagination,
                selectedRowData,
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
                        title: 'Field Name',
                        dataIndex: 'field_name',
                        key: 'field_name',
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

    .max-profile-width {
        max-width: calc(100vw - 516px);
    }
</style>
