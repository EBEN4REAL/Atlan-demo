<template>
    <a-drawer
        :visible="drawerFilter"
        :mask="false"
        :placement="'left'"
        :width="287"
        :closable="false"
        :class="'drawer-filter-request'"
    >
        <div class="relative h-full pt-4 pb-10 overflow-scroll bg-gray-50">
            <!-- <div
                :class="`close-icon ${
                    !drawerFilter && 'closed'
                } border border-solid order-gray-300`"
                @click="handleClickFilter"
            >
                <AtlanIcon icon="ChevronRight" />
            </div> -->
            <div
                v-if="drawerFilter"
                class="close-btn-sidebar button-close-drawer-request"
                @click="handleClickFilter"
            >
                <AtlanIcon icon="Add" class="text-white" />
            </div>
            <div class="px-2 filter-container">
                <AssetFilters
                    v-model="facets"
                    :filter-list="requestFilter"
                    :allow-custom-filters="false"
                    :no-filter-title="'No filters applied'"
                    :extra-count-filter="connectorsData.attributeValue ? 1 : 0"
                    class="bg-gray-100 drawer-request"
                    @change="handleFilterChange"
                    @reset="handleResetEvent"
                >
                    <div class="mt-4 mb-4 wrapper-filter">
                        <Connector
                            v-model:data="connectorsData"
                            class=""
                            :filter-source-ids="BItypes"
                            :is-leaf-node-selectable="false"
                            :item="{
                                id: 'connector',
                                label: 'Connector',
                                component: 'connector',
                                overallCondition: 'OR',
                                filters: [
                                    {
                                        attributeName: 'connector',
                                        condition: 'OR',
                                        isMultiple: false,
                                        operator: 'eq',
                                    },
                                ],
                                isDeleted: false,
                                isDisabled: false,
                                exclude: false,
                            }"
                            @change="handleChangeConnector"
                            @update:data="setConnector"
                        />
                    </div>
                </AssetFilters>
            </div>
        </div>
    </a-drawer>
    <DefaultLayout title="Requests" class="px-6 governance-request">
        <div class="relative mt-3 border rounded-md">
            <div class="wrapper-scoll left" @mouseenter="mouseEnterContainer" />
            <div
                class="wrapper-scoll right"
                @mouseenter="mouseEnterContainer"
            />
            <div class="flex justify-between m-4 mb-0">
                <SearchAndFilter
                    v-model:value="searchTerm"
                    class="max-w-lg shadow-none filter-request"
                    size="default"
                    :placeholder="
                        pagination.totalData
                            ? `Search all ${pagination.totalData} ${
                                  pagination.totalData > 0
                                      ? 'requests'
                                      : 'request'
                              }`
                            : listLoading
                            ? 'Loading..'
                            : 'search'
                    "
                >
                    <template #categoryFilter>
                        <div
                            class="relative flex items-center px-2 cursor-pointer filter-icon-wrapper"
                            :class="{
                                'border-primary border': drawerFilter,
                            }"
                            @click="handleClickFilter"
                        >
                            <AtlanIcon icon="FilterFunnelDot" />
                            <div
                                class="absolute border-r border-solid divide-gray-800 devider-filter"
                            />
                        </div>
                    </template>
                </SearchAndFilter>
                <a-tooltip placement="topLeft">
                    <template #title>
                        <span>refresh</span>
                    </template>
                    <div
                        class="flex items-center p-2 py-1 border rounded cursor-pointer reload-button"
                        @click="mutate"
                    >
                        <!-- <img :src="logoUrl" /> -->
                        <!-- <AtlanIcon icon="Retry" /> -->
                        <img :src="retryImage" />
                    </div>
                </a-tooltip>
            </div>
            <!-- <RequestTypeTabs v-model:tab="filters.request_type" /> -->
            <div
                v-if="listLoading"
                class="flex items-center justify-center h-64"
            >
                <AtlanLoader class="h-10" />
            </div>
            <div v-show="!listLoading && requestList.length">
                <RequestModal
                    v-if="requestList[selectedIndex]"
                    v-model:visible="isDetailsVisible"
                    :request="requestList[selectedIndex]"
                    @up="traverseUp"
                    @down="traverseDown"
                    @action="handleRequestAction($event, index)"
                />
                <div class="h-6" @mouseenter="mouseEnterContainer" />
                <VirtualList
                    :data="requestList"
                    data-key="id"
                    class="container-scroll"
                    @mouseleave="mouseLeaveContainer"
                >
                    <template #default="{ item, index }">
                        <!-- @select="selectRequest(item.id, index)" -->
                        <RequestListItem
                            :request="item"
                            :active-hover="activeHover"
                            :active="index === selectedIndex"
                            :selected="isSelected(item.id)"
                            @mouseenter="handleMouseEnter(item.id, index)"
                            @action="handleRequestAction($event, index)"
                            @mouseEnterAsset="mouseEnterAsset(item.id, index)"
                        />
                    </template>
                </VirtualList>
                <!-- <div class="h-3" @mouseenter="mouseEnterContainer" /> -->
                <div
                    class="flex items-center justify-between p-4 bg-white border-t"
                    @mouseenter="mouseEnterContainer"
                >
                    <div class="text-gray-500">
                        <strong
                            >{{ startCountPagination }}-{{
                                endCountPagination
                            }}</strong
                        >
                        of {{ pagination.totalData }} requests
                    </div>
                    <div v-if="showPagination" class="flex">
                        <Pagination
                            v-model:offset="pagination.offset"
                            :total-pages="pagination.totalPages"
                            :loading="listLoading"
                            :page-size="pagination.limit"
                            :default-page="defaultPage"
                            @mutate="mutate"
                        />
                    </div>
                </div>
            </div>
            <div
                v-if="!listLoading && !requestList.length"
                class="flex items-center justify-center h-full mt-5 mb-10"
            >
                <div
                    v-if="searchTerm?.length > 0"
                    class="flex flex-col items-center justify-center h-96"
                >
                    <atlan-icon icon="NoRequestFound" class="h-36" />
                    <span class="mt-4 text-center text-gray-500 w-72">
                        Oops… we didn’t find any requests that match this search
                    </span>
                    <a-button
                        class="flex items-center justify-center w-40 py-2 mt-4"
                        @click="searchTerm = ''"
                        >Clear search</a-button
                    >
                </div>
                <div
                    v-else-if="Object.keys(facets).length > 0"
                    class="flex flex-col items-center justify-center h-96"
                >
                    <atlan-icon icon="NoRequestFound" class="h-36" />
                    <span class="mt-4 text-center text-gray-500 w-72">
                        Oops… we didn’t find any requests that match this filter
                    </span>
                </div>
                <div v-else class="flex flex-col mt-10 mb-5">
                    <atlan-icon icon="NoLinkedAssets" class="h-40" />
                    <span class="mt-4 text-xl font-semibold"
                        >All pending requests have been resolved</span
                    >
                </div>
            </div>
        </div>
    </DefaultLayout>
    <!-- <NoAcces v-else /> -->
</template>

<script lang="ts">
    import { defineComponent, computed, ref, watch, Ref } from 'vue'
    import { useMagicKeys, whenever } from '@vueuse/core'
    import { message } from 'ant-design-vue'
    import { useRequestList } from '~/composables/requests/useRequests'
    import { getBISourceTypes } from '~/composables/connection/getBISourceTypes'

    import DefaultLayout from '@/admin/layout.vue'
    import AssetFilters from '@/common/assets/filters/index.vue'
    import SearchAndFilter from '~/components/common/input/searchAndFilter.vue'
    import VirtualList from '~/utils/library/virtualList/virtualList.vue'
    import RequestTypeTabs from './requestTypeTabs.vue'
    import RequestListItem from '~/components/governance/requests/requestListItem.vue'
    // import RequestFilters from './filters/requestFilters.vue'
    import RequestModal from './modal/requestDetailsBase.vue'
    // import NoAcces from '@/admin/common/noAccessPage.vue'

    import { RequestAttributes, RequestStatus } from '~/types/atlas/requests'
    import { requestFilter } from '~/constant/filters/logsFilter'
    import Connector from '~/components/insights/common/connector/connector.vue'
    // import { useAccessStore } from '~/services/access/accessStore'
    // import {
    //     approveRequest,
    //     declineRequest,
    // } from '~/composables/requests/useRequests'
    import Pagination from '@/common/list/pagination.vue'
    import retryImage from '~/assets/images/Retry.png'

    export default defineComponent({
        name: 'RequestList',
        components: {
            Pagination,
            VirtualList,
            RequestListItem,
            SearchAndFilter,
            // RequestFilters,
            RequestModal,
            RequestTypeTabs,
            DefaultLayout,
            AssetFilters,
            Connector,
            // NoAcces
        },
        setup(props, { emit }) {
            // const accessStore = useAccessStore();
            // const listPermission = computed(() => accessStore.checkPermission('LIST_REQUEST'))
            // keyboard navigation stuff
            const showPagination = ref(true)
            const timeoutHover = null
            const activeHover = ref('')
            const connectorsData = ref({
                attributeName: undefined,
                attributeValue: undefined,
            })
            const { Shift, ArrowUp, ArrowDown, x, Meta, Control, Space } =
                useMagicKeys()
            const selectedList = ref(new Set<string>())
            const selectedIndex = ref(-1)
            const isDetailsVisible = ref(false)
            const drawerFilter = ref(false)
            const facets = ref({
                statusRequest: ['active'],
            })
            const paginationRef = ref('')
            const searchTerm = ref('')
            const defaultPage = ref(1)
            const filters = ref({
                status: 'active' as RequestStatus,
                request_type: [],
            })
            const requestList = ref([])

            const pagination = ref({
                limit: 40,
                offset: 0,
                totalPages: 1,
                totalData: 0,
            })
            const {
                response,
                isLoading: listLoading,
                error: listError,
                mutate,
            } = useRequestList(searchTerm, filters, pagination)

            watch(response, () => {
                requestList.value =
                    response.value?.records?.filter((req) =>
                        Array.isArray(filters.value.status)
                            ? filters.value.status.includes(req.status)
                            : req.status === filters.value.status
                    ) || []
                pagination.value.totalPages =
                    response.value.filterRecord / pagination.value.limit
                pagination.value.totalData = response.value.filterRecord
            })
            function isSelected(guid: string): boolean {
                // TODO: change this when adding bulk support
                // return selectedList.value.has(guid)
                return false
            }

            /** *********************************************************************************
                    /////////// DO NOT REMOVE ANY COMMENTED CODE - They are for bulk select ////////////
                    ********************************************************************************** */
            const handleClickFilter = () => {
                drawerFilter.value = !drawerFilter.value
            }
            function selectRequest(guid: string, index: number) {
                /** Check if the currently pressed key is not this array,
                 * then clear the set, else directly add the new item to the set
                 */
                if (!Meta.value && !Control.value) selectedList.value.clear()

                // Remove the request id if already present in the set
                if (selectedList.value.has(guid))
                    selectedList.value.delete(guid)
                else selectedList.value.add(guid)

                // Add the last selected index to the ref variable
                // Set it to -1 if nothing is selected
                if (selectedList.value.size) selectedIndex.value = index
                else selectedIndex.value = -1

                isDetailsVisible.value = true
            }
            const traverseUp = () => {
                if (selectedIndex.value > 0) {
                    selectedIndex.value--
                    if (Shift.value)
                        selectedList.value.add(
                            requestList.value[selectedIndex.value].id
                        )
                }
            }

            const traverseDown = () => {
                if (selectedIndex.value < requestList.value.length - 1) {
                    selectedIndex.value++
                    if (Shift.value)
                        selectedList.value.add(
                            requestList.value[selectedIndex.value].id
                        )
                }
            }
            whenever(ArrowUp, traverseUp)
            whenever(ArrowDown, traverseDown)

            whenever(
                Space,
                () => (isDetailsVisible.value = !isDetailsVisible.value)
            )

            function handleRequestAction(req: RequestAttributes, idx: number) {
                activeHover.value = ''
                isDetailsVisible.value = false
                if (filters.value.status.includes(req.status)) {
                    requestList.value[idx] = req
                } else {
                    requestList.value.splice(idx, 1)
                }
                if (!requestList.value.length) {
                    pagination.value.offset =
                        pagination.value.offset - pagination.value.limit
                    defaultPage.value =
                        Math.ceil(pagination.value.totalPages) - 1
                    showPagination.value = false
                    setTimeout(() => {
                        showPagination.value = true
                    }, 200)
                    mutate()
                } else {
                    pagination.value.totalData = pagination.value.totalData - 1
                    pagination.value.totalPages =
                        pagination.value.totalData / pagination.value.limit
                }
            }

            watch(listError, () => {
                if (listError.value)
                    message.error('Failed to load request data.')
            })
            watch(
                filters,
                () => {
                    selectedIndex.value = -1
                },
                { deep: true }
            )
            const handleFilterChange = () => {
                pagination.value.offset = 0
                showPagination.value = false
                setTimeout(() => {
                    showPagination.value = true
                }, 200)
                const facetsValue = facets.value
                const status = facetsValue.statusRequest
                    ? facetsValue.statusRequest
                    : []
                const createdBy = facetsValue?.requestor?.ownerUsers || []
                // const typeName = facetsValue.__traitNames.classifications || []
                const filterMerge = {
                    ...filters.value,
                    status: status.length > 0 ? status : 'active',
                    createdBy,
                    // typeName,
                }
                if (facetsValue.__traitNames) {
                    const filterClasification = []
                    facetsValue.__traitNames?.classifications?.forEach((el) => {
                        filterClasification.push({
                            payload: {
                                $elemMatch: {
                                    typeName: el,
                                },
                            },
                        })
                    })
                    filterMerge.$or = filterClasification
                }
                filters.value = filterMerge
            }
            const handleResetEvent = () => {
                filters.value = {
                    status: 'active' as RequestStatus,
                    request_type: [],
                }
                connectorsData.value = {
                    attributeName: undefined,
                    attributeValue: undefined,
                }
            }
            const BItypes = getBISourceTypes()
            const handleChangeConnector = () => {
                const filterMerge = {
                    ...filters.value,
                    destinationQualifiedName:
                        connectorsData.value.attributeValue,
                }
                filters.value = filterMerge
            }
            const setConnector = () => {}
            const handleMouseEnter = (itemId, idx) => {
                selectedIndex.value = idx
                if (activeHover.value !== itemId) {
                    activeHover.value = itemId
                }
            }
            const mouseEnterContainer = () => {
                clearTimeout(timeoutHover)
                activeHover.value = ''
                selectedIndex.value = -1
            }
            const logoUrl = computed(
                () => `${window.location.origin}/api/service/avatars/_logo_`
            )
            const startCountPagination = computed(() =>
                pagination.value.offset === 0 ? 1 : pagination.value.offset + 1
            )
            const endCountPagination = computed(() =>
                pagination.value.offset === 0
                    ? requestList.value.length
                    : pagination.value.offset + requestList.value.length
            )
            const mouseEnterAsset = (itemId, idx) => {
                // clearTimeout(timeoutHover)
                // timeoutHover = setTimeout(() => {
                //     selectRequest(itemId, idx)
                // }, 1000)
            }
            return {
                mutate,
                pagination,
                requestList,
                isSelected,
                selectRequest,
                selectedList,
                selectedIndex,
                searchTerm,
                handleRequestAction,
                filters,
                listLoading,
                listError,
                isDetailsVisible,
                traverseUp,
                traverseDown,
                drawerFilter,
                handleClickFilter,
                facets,
                handleFilterChange,
                handleResetEvent,
                requestFilter,
                BItypes,
                handleChangeConnector,
                setConnector,
                connectorsData,
                handleMouseEnter,
                activeHover,
                mouseEnterContainer,
                response,
                retryImage,
                logoUrl,
                startCountPagination,
                endCountPagination,
                paginationRef,
                showPagination,
                mouseEnterAsset,
                defaultPage,
                // listPermission
            }
        },
    })
</script>

<style lang="less">
    .drawer-request {
        .ant-collapse-content {
            background: none !important;
        }
        .ant-collapse-header {
            @apply hover:bg-transparent !important;
        }
        .group {
            background: none !important;
        }
        // .clear-filter-asset {
        //     @apply text-gray-500 !important;
        // }
    }
    .reload-button {
        path {
            fill: #64748b;
            stroke: #64748b;
        }
    }
    .filter-request {
        height: 32px !important;
    }
    .drawer-filter-request {
        .ant-drawer-content-wrapper {
            width: 240px !important;
        }
    }
    .button-close-drawer-request {
        left: 250px !important;
        // right: -40px !important;
    }
    .governance-request {
        .container-content {
            overflow: visible !important;
        }
    }
    .container-scroll {
        max-height: calc(75vh - 100px);
    }
    .wrapper-filter {
        .ant-select-selector {
            background: white !important;
        }
    }
    .filter-container {
        .filter-head {
            background-color: transparent !important;
            background: none;
            box-shadow: none !important;
        }
    }
</style>
<style lang="less" scoped>
    .filter-icon-wrapper {
        height: 28px !important;
    }
    .wrapper-scoll {
        position: absolute;
        width: 16px;
        height: 100%;
        &.left {
            left: -16px;
        }
        &.right {
            right: -16px;
        }
    }
    .close-icon {
        &.closed {
            display: none;
        }
        background-color: white;
        position: fixed;
        height: 32px;
        width: 20px;
        top: 120px;
        margin-left: 288px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: -5px 1px 6px 0px #0000000d;
        border-top-left-radius: 6px;
        border-bottom-left-radius: 6px;
        cursor: pointer;
        transform: rotate(180deg);
    }

    .devider-filter {
        top: 0px;
        height: 31px;
        right: 0;
    }
</style>
