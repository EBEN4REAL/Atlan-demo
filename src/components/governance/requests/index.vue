<template>
    <a-drawer
        :visible="drawerFilter"
        :mask="false"
        :placement="'left'"
        :width="240"
        :closable="false"
        :class="'drawer-filter-request'"
    >
        <div
            class="relative h-full pb-10 overflow-scroll bg-gray-50"
            :class="$style['request-filter-wrapper']"
        >
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
            <div class="filter-container">
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
                    <!-- <div class="px-2 mt-4 mb-4 wrapper-filter">
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
                    </div> -->
                </AssetFilters>
            </div>
        </div>
    </a-drawer>
    <DefaultLayout title="Requests" class="px-6 governance-request">
        <div class="relative mt-3 border border-gray-300 rounded-md">
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
                        <div class="relative flex items-center">
                            <AtlanBtn
                                color="secondary"
                                class="px-2 border-r-0 rounded-tr-none rounded-br-none cursor-pointer filter-button"
                                :class="{
                                    'text-primary border rounded py-1 border-primary':
                                        drawerFilter,
                                }"
                                @click="handleClickFilter"
                            >
                                <AtlanIcon
                                    :icon="
                                        isFilterApplied
                                            ? 'FilterFunnelDot'
                                            : 'FilterFunnel'
                                    "
                                    class="w-4 h-4"
                                />
                            </AtlanBtn>
                            <div
                                class="absolute border-r divide-gray-800 divider-filter"
                                :class="{
                                    'text-primary border-r rounded border-primary top-0':
                                        drawerFilter,
                                }"
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
                        <AtlanIcon class="refresh-icon-request" icon="Retry" />
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
                <!-- <RequestModal
                    v-if="requestList[selectedIndex]"
                    v-model:visible="isDetailsVisible"
                    :request="requestList[selectedIndex]"
                    @up="traverseUp"
                    @down="traverseDown"
                    @action="handleRequestAction($event, index)"
                /> -->
                <div class="h-4" @mouseenter="mouseEnterContainer" />
                <transition-group
                    tag="div"
                    name="request-done"
                    class="overflow-auto container-scroll"
                >
                    <div
                        v-for="(item, index) in requestList"
                        :key="item.id"
                        @mouseleave="mouseLeaveContainer"
                    >
                        <RequestListItem
                            :active="index === selectedIndex"
                            :request="item"
                            :active-hover="activeHover"
                            :selected="isSelected(item.id)"
                            @mouseenter="handleMouseEnter(item.id, index)"
                            @action="handleRequestAction($event, index)"
                            @mouseEnterAsset="mouseEnterAsset(item.id, index)"
                        />
                    </div>
                </transition-group>
                <!-- <div class="h-3" @mouseenter="mouseEnterContainer" /> -->
                <div
                    class="flex items-center justify-between p-4 bg-white border-t border-gray-light"
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
                class="flex items-center justify-center h-full mt-5 mb-10 container-empty"
            >
                <div
                    v-if="!searchTerm?.length && !isFilterApplied"
                    class="flex flex-col items-center"
                >
                    <AtlanIcon icon="EmptyRequest" style="height: 165px" />
                    <div
                        class="px-10 mx-10 mt-2 text-xl font-bold text-center text-gray-700"
                    >
                        All caught up!!
                    </div>
                    <div class="px-10 mx-10 mt-2 text-center text-gray-400">
                        There are no requests at this time
                    </div>
                </div>
                <div
                    v-else-if="searchTerm?.length > 0"
                    class="flex flex-col items-center justify-center h-96"
                >
                    <AtlanIcon icon="EmptyRequest" style="height: 165px" />
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
                    v-else-if="isFilterApplied"
                    class="flex flex-col items-center justify-center h-96"
                >
                    <AtlanIcon icon="EmptyRequest" style="height: 165px" />
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
    import { defineComponent, computed, ref, watch, Ref, onMounted } from 'vue'
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
            const requestList = ref([
                {
                    id: '7cf458c7-31aa-4959-a211-064a67fda32d',
                    version: 'polished-shadow-5193',
                    isActive: true,
                    createdAt: 1645489010417,
                    updatedAt: 1645489010417,
                    createdBy:
                        'service-account-apikey-6f7f1591-a247-42bd-a969-11ec2e654678',
                    tenantId: 'default',
                    sourceType: 'atlas',
                    sourceGuid: null,
                    sourceQualifiedName: null,
                    sourceAttribute: null,
                    destinationGuid: 'd52063db-2509-481b-85cd-2b57a8d95d1c',
                    destinationQualifiedName:
                        'default/snowflake/1645488678/SNOWFLAKE_SAMPLE_DATA/TPCDS_SF10TCL/DBGEN_VERSION/DV_VERSION',
                    destinationAttribute: null,
                    destinationValue: null,
                    entityType: 'Column',
                    requestType: 'attach_classification',
                    confidenceScore: null,
                    botRunId: null,
                    approvedBy: null,
                    rejectedBy: null,
                    status: 'active',
                    message:
                        'Classification attach request by auto-classification from crawlers',
                    requestsBatch: null,
                    approvalType: 'single',
                    assignedApprovers: null,
                    payload: {
                        attributes: {
                            confidenceScore: 0.6,
                            keywordsMatched: ['DriversLic'],
                            lastSyncRun:
                                'atlan-snowflake-default-snowflake-1645488678-k7ljr',
                            regexMatched: null,
                            rulesMatched: ["Australia driver's license number"],
                            timestamp: '1645488994.6493733',
                            userContext: '',
                        },
                        propagate: true,
                        removePropagationsOnEntityDelete: false,
                        typeName: 'tFGRstMirOLTRO5yvyk8Ic',
                        validityPeriods: [],
                    },
                    accessStartDate: null,
                    accessEndDate: null,
                    hash: 0,
                    isDuplicate: false,
                    sourceEntity: null,
                    destinationEntity: {
                        attributes: {
                            certificateStatus: null,
                            certificateStatusMessage: null,
                            certificateUpdatedAt: 0,
                            certificateUpdatedBy: null,
                            connectionName: null,
                            description: null,
                            displayName: null,
                            name: 'DV_VERSION',
                            qualifiedName:
                                'default/snowflake/1645488678/SNOWFLAKE_SAMPLE_DATA/TPCDS_SF10TCL/DBGEN_VERSION/DV_VERSION',
                            userDescription: null,
                        },
                        guid: 'd52063db-2509-481b-85cd-2b57a8d95d1c',
                    },
                },
                {
                    id: '6a951e66-971f-458e-9861-59e37aee6756',
                    version: 'sweet-thunder-1193',
                    isActive: true,
                    createdAt: 1645489010395,
                    updatedAt: 1645489010395,
                    createdBy:
                        'service-account-apikey-6f7f1591-a247-42bd-a969-11ec2e654678',
                    tenantId: 'default',
                    sourceType: 'atlas',
                    sourceGuid: null,
                    sourceQualifiedName: null,
                    sourceAttribute: null,
                    destinationGuid: '0c8619d0-4ac0-4f5a-b9f0-467fcdbf3c04',
                    destinationQualifiedName:
                        'default/snowflake/1645488678/SNOWFLAKE_SAMPLE_DATA/TPCDS_SF10TCL/CUSTOMER/C_CUSTOMER_SK',
                    destinationAttribute: null,
                    destinationValue: null,
                    entityType: 'Column',
                    requestType: 'attach_classification',
                    confidenceScore: null,
                    botRunId: null,
                    approvedBy: null,
                    rejectedBy: null,
                    status: 'active',
                    message:
                        'Classification attach request by auto-classification from crawlers',
                    requestsBatch: null,
                    approvalType: 'single',
                    assignedApprovers: null,
                    payload: {
                        attributes: {
                            confidenceScore: 0.64,
                            keywordsMatched: ['customername'],
                            lastSyncRun:
                                'atlan-snowflake-default-snowflake-1645488678-k7ljr',
                            regexMatched: null,
                            rulesMatched: ['Global'],
                            timestamp: '1645488994.6493104',
                            userContext: '',
                        },
                        propagate: true,
                        removePropagationsOnEntityDelete: false,
                        typeName: 'tFGRstMirOLTRO5yvyk8Ic',
                        validityPeriods: [],
                    },
                    accessStartDate: null,
                    accessEndDate: null,
                    hash: 0,
                    isDuplicate: false,
                    sourceEntity: null,
                    destinationEntity: {
                        attributes: {
                            certificateStatus: null,
                            certificateStatusMessage: null,
                            certificateUpdatedAt: 0,
                            certificateUpdatedBy: null,
                            connectionName: null,
                            description: null,
                            displayName: null,
                            name: 'C_CUSTOMER_SK',
                            qualifiedName:
                                'default/snowflake/1645488678/SNOWFLAKE_SAMPLE_DATA/TPCDS_SF10TCL/CUSTOMER/C_CUSTOMER_SK',
                            userDescription: null,
                        },
                        guid: '0c8619d0-4ac0-4f5a-b9f0-467fcdbf3c04',
                    },
                },
                {
                    id: 'eb5a50a0-340a-4cc8-8e64-6529458d89ab',
                    version: 'blue-king-9786',
                    isActive: true,
                    createdAt: 1645489010385,
                    updatedAt: 1645489010385,
                    createdBy:
                        'service-account-apikey-6f7f1591-a247-42bd-a969-11ec2e654678',
                    tenantId: 'default',
                    sourceType: 'atlas',
                    sourceGuid: null,
                    sourceQualifiedName: null,
                    sourceAttribute: null,
                    destinationGuid: '89e447b9-326d-4a82-813d-87238ff94160',
                    destinationQualifiedName:
                        'default/snowflake/1645488678/SNOWFLAKE_SAMPLE_DATA/TPCDS_SF10TCL/WAREHOUSE/W_STREET_NUMBER',
                    destinationAttribute: null,
                    destinationValue: null,
                    entityType: 'Column',
                    requestType: 'attach_classification',
                    confidenceScore: null,
                    botRunId: null,
                    approvedBy: null,
                    rejectedBy: null,
                    status: 'active',
                    message:
                        'Classification attach request by auto-classification from crawlers',
                    requestsBatch: null,
                    approvalType: 'single',
                    assignedApprovers: null,
                    payload: {
                        attributes: {
                            confidenceScore: 0.6206896551724138,
                            keywordsMatched: ['passportnumber'],
                            lastSyncRun:
                                'atlan-snowflake-default-snowflake-1645488678-k7ljr',
                            regexMatched: null,
                            rulesMatched: ['Australia passport number'],
                            timestamp: '1645488994.585547',
                            userContext: '',
                        },
                        propagate: true,
                        removePropagationsOnEntityDelete: false,
                        typeName: 'tFGRstMirOLTRO5yvyk8Ic',
                        validityPeriods: [],
                    },
                    accessStartDate: null,
                    accessEndDate: null,
                    hash: 0,
                    isDuplicate: false,
                    sourceEntity: null,
                    destinationEntity: {
                        attributes: {
                            certificateStatus: null,
                            certificateStatusMessage: null,
                            certificateUpdatedAt: 0,
                            certificateUpdatedBy: null,
                            connectionName: null,
                            description: null,
                            displayName: null,
                            name: 'W_STREET_NUMBER',
                            qualifiedName:
                                'default/snowflake/1645488678/SNOWFLAKE_SAMPLE_DATA/TPCDS_SF10TCL/WAREHOUSE/W_STREET_NUMBER',
                            userDescription: null,
                        },
                        guid: '89e447b9-326d-4a82-813d-87238ff94160',
                    },
                },
                {
                    id: 'fb6e07f1-68ef-4aae-a871-f939846f197e',
                    version: 'crimson-bread-4272',
                    isActive: true,
                    createdAt: 1645489010378,
                    updatedAt: 1645489010378,
                    createdBy:
                        'service-account-apikey-6f7f1591-a247-42bd-a969-11ec2e654678',
                    tenantId: 'default',
                    sourceType: 'atlas',
                    sourceGuid: null,
                    sourceQualifiedName: null,
                    sourceAttribute: null,
                    destinationGuid: 'bd87a065-47b5-49d3-b04c-b8fb5becf22c',
                    destinationQualifiedName:
                        'default/snowflake/1645488678/SNOWFLAKE_SAMPLE_DATA/TPCDS_SF10TCL/DATE_DIM/D_QUARTER_NAME',
                    destinationAttribute: null,
                    destinationValue: null,
                    entityType: 'Column',
                    requestType: 'attach_classification',
                    confidenceScore: null,
                    botRunId: null,
                    approvedBy: null,
                    rejectedBy: null,
                    status: 'active',
                    message:
                        'Classification attach request by auto-classification from crawlers',
                    requestsBatch: null,
                    approvalType: 'single',
                    assignedApprovers: null,
                    payload: {
                        attributes: {
                            confidenceScore: 0.6153846153846154,
                            keywordsMatched: ['customername'],
                            lastSyncRun:
                                'atlan-snowflake-default-snowflake-1645488678-k7ljr',
                            regexMatched: null,
                            rulesMatched: ['Global'],
                            timestamp: '1645488994.5855212',
                            userContext: '',
                        },
                        propagate: true,
                        removePropagationsOnEntityDelete: false,
                        typeName: 'tFGRstMirOLTRO5yvyk8Ic',
                        validityPeriods: [],
                    },
                    accessStartDate: null,
                    accessEndDate: null,
                    hash: 0,
                    isDuplicate: false,
                    sourceEntity: null,
                    destinationEntity: {
                        attributes: {
                            certificateStatus: null,
                            certificateStatusMessage: null,
                            certificateUpdatedAt: 0,
                            certificateUpdatedBy: null,
                            connectionName: null,
                            description: null,
                            displayName: null,
                            name: 'D_QUARTER_NAME',
                            qualifiedName:
                                'default/snowflake/1645488678/SNOWFLAKE_SAMPLE_DATA/TPCDS_SF10TCL/DATE_DIM/D_QUARTER_NAME',
                            userDescription: null,
                        },
                        guid: 'bd87a065-47b5-49d3-b04c-b8fb5becf22c',
                    },
                },
                {
                    id: '8cc7830b-3b56-48cf-b6eb-19777bb58943',
                    version: 'muddy-cherry-8717',
                    isActive: true,
                    createdAt: 1645489010369,
                    updatedAt: 1645489010369,
                    createdBy:
                        'service-account-apikey-6f7f1591-a247-42bd-a969-11ec2e654678',
                    tenantId: 'default',
                    sourceType: 'atlas',
                    sourceGuid: null,
                    sourceQualifiedName: null,
                    sourceAttribute: null,
                    destinationGuid: 'c3296eaf-d67b-4f07-b4c7-1876575b6d51',
                    destinationQualifiedName:
                        'default/snowflake/1645488678/SNOWFLAKE_SAMPLE_DATA/TPCDS_SF10TCL/STORE/S_COMPANY_ID',
                    destinationAttribute: null,
                    destinationValue: null,
                    entityType: 'Column',
                    requestType: 'attach_classification',
                    confidenceScore: null,
                    botRunId: null,
                    approvedBy: null,
                    rejectedBy: null,
                    status: 'active',
                    message:
                        'Classification attach request by auto-classification from crawlers',
                    requestsBatch: null,
                    approvalType: 'single',
                    assignedApprovers: null,
                    payload: {
                        attributes: {
                            confidenceScore: 0.6086956521739131,
                            keywordsMatched: ['companyname'],
                            lastSyncRun:
                                'atlan-snowflake-default-snowflake-1645488678-k7ljr',
                            regexMatched: null,
                            rulesMatched: ['Global'],
                            timestamp: '1645488994.5854905',
                            userContext: '',
                        },
                        propagate: true,
                        removePropagationsOnEntityDelete: false,
                        typeName: 'tFGRstMirOLTRO5yvyk8Ic',
                        validityPeriods: [],
                    },
                    accessStartDate: null,
                    accessEndDate: null,
                    hash: 0,
                    isDuplicate: false,
                    sourceEntity: null,
                    destinationEntity: {
                        attributes: {
                            certificateStatus: null,
                            certificateStatusMessage: null,
                            certificateUpdatedAt: 0,
                            certificateUpdatedBy: null,
                            connectionName: null,
                            description: null,
                            displayName: null,
                            name: 'S_COMPANY_ID',
                            qualifiedName:
                                'default/snowflake/1645488678/SNOWFLAKE_SAMPLE_DATA/TPCDS_SF10TCL/STORE/S_COMPANY_ID',
                            userDescription: null,
                        },
                        guid: 'c3296eaf-d67b-4f07-b4c7-1876575b6d51',
                    },
                },
                {
                    id: 'e04be57a-3908-439f-9b89-dc4111cc843b',
                    version: 'proud-meadow-4802',
                    isActive: true,
                    createdAt: 1645489010361,
                    updatedAt: 1645489010361,
                    createdBy:
                        'service-account-apikey-6f7f1591-a247-42bd-a969-11ec2e654678',
                    tenantId: 'default',
                    sourceType: 'atlas',
                    sourceGuid: null,
                    sourceQualifiedName: null,
                    sourceAttribute: null,
                    destinationGuid: '1b027ff8-b360-4cbb-88e8-911d4a96ba10',
                    destinationQualifiedName:
                        'default/snowflake/1645488678/SNOWFLAKE_SAMPLE_DATA/TPCDS_SF10TCL/STORE_SALES/SS_TICKET_NUMBER',
                    destinationAttribute: null,
                    destinationValue: null,
                    entityType: 'Column',
                    requestType: 'attach_classification',
                    confidenceScore: null,
                    botRunId: null,
                    approvedBy: null,
                    rejectedBy: null,
                    status: 'active',
                    message:
                        'Classification attach request by auto-classification from crawlers',
                    requestsBatch: null,
                    approvalType: 'single',
                    assignedApprovers: null,
                    payload: {
                        attributes: {
                            confidenceScore: 0.6,
                            keywordsMatched: ['passportnumber'],
                            lastSyncRun:
                                'atlan-snowflake-default-snowflake-1645488678-k7ljr',
                            regexMatched: null,
                            rulesMatched: ['Australia passport number'],
                            timestamp: '1645488994.5854235',
                            userContext: '',
                        },
                        propagate: true,
                        removePropagationsOnEntityDelete: false,
                        typeName: 'tFGRstMirOLTRO5yvyk8Ic',
                        validityPeriods: [],
                    },
                    accessStartDate: null,
                    accessEndDate: null,
                    hash: 0,
                    isDuplicate: false,
                    sourceEntity: null,
                    destinationEntity: {
                        attributes: {
                            certificateStatus: null,
                            certificateStatusMessage: null,
                            certificateUpdatedAt: 0,
                            certificateUpdatedBy: null,
                            connectionName: null,
                            description: null,
                            displayName: null,
                            name: 'SS_TICKET_NUMBER',
                            qualifiedName:
                                'default/snowflake/1645488678/SNOWFLAKE_SAMPLE_DATA/TPCDS_SF10TCL/STORE_SALES/SS_TICKET_NUMBER',
                            userDescription: null,
                        },
                        guid: '1b027ff8-b360-4cbb-88e8-911d4a96ba10',
                    },
                },
                {
                    id: 'b5eb772e-6163-43b7-8cd8-c77e549cb0d1',
                    version: 'tight-cherry-9192',
                    isActive: true,
                    createdAt: 1645489010353,
                    updatedAt: 1645489010353,
                    createdBy:
                        'service-account-apikey-6f7f1591-a247-42bd-a969-11ec2e654678',
                    tenantId: 'default',
                    sourceType: 'atlas',
                    sourceGuid: null,
                    sourceQualifiedName: null,
                    sourceAttribute: null,
                    destinationGuid: 'cacb10ec-8daf-4e52-8dbb-025140fb5833',
                    destinationQualifiedName:
                        'default/snowflake/1645488678/SNOWFLAKE_SAMPLE_DATA/TPCDS_SF10TCL/WEB_SITE/WEB_SUITE_NUMBER',
                    destinationAttribute: null,
                    destinationValue: null,
                    entityType: 'Column',
                    requestType: 'attach_classification',
                    confidenceScore: null,
                    botRunId: null,
                    approvedBy: null,
                    rejectedBy: null,
                    status: 'active',
                    message:
                        'Classification attach request by auto-classification from crawlers',
                    requestsBatch: null,
                    approvalType: 'single',
                    assignedApprovers: null,
                    payload: {
                        attributes: {
                            confidenceScore: 0.6451612903225806,
                            keywordsMatched: ['business number'],
                            lastSyncRun:
                                'atlan-snowflake-default-snowflake-1645488678-k7ljr',
                            regexMatched: null,
                            rulesMatched: ['Australia business number'],
                            timestamp: '1645488994.5119548',
                            userContext: '',
                        },
                        propagate: true,
                        removePropagationsOnEntityDelete: false,
                        typeName: 'tFGRstMirOLTRO5yvyk8Ic',
                        validityPeriods: [],
                    },
                    accessStartDate: null,
                    accessEndDate: null,
                    hash: 0,
                    isDuplicate: false,
                    sourceEntity: null,
                    destinationEntity: {
                        attributes: {
                            certificateStatus: null,
                            certificateStatusMessage: null,
                            certificateUpdatedAt: 0,
                            certificateUpdatedBy: null,
                            connectionName: null,
                            description: null,
                            displayName: null,
                            name: 'WEB_SUITE_NUMBER',
                            qualifiedName:
                                'default/snowflake/1645488678/SNOWFLAKE_SAMPLE_DATA/TPCDS_SF10TCL/WEB_SITE/WEB_SUITE_NUMBER',
                            userDescription: null,
                        },
                        guid: 'cacb10ec-8daf-4e52-8dbb-025140fb5833',
                    },
                },
                {
                    id: '4feebca9-0cf7-4c0b-a819-724264c01dfd',
                    version: 'quiet-thunder-6596',
                    isActive: true,
                    createdAt: 1645489010345,
                    updatedAt: 1645489010345,
                    createdBy:
                        'service-account-apikey-6f7f1591-a247-42bd-a969-11ec2e654678',
                    tenantId: 'default',
                    sourceType: 'atlas',
                    sourceGuid: null,
                    sourceQualifiedName: null,
                    sourceAttribute: null,
                    destinationGuid: '9cfbca02-7731-4b2b-a6e6-1f0c541728a9',
                    destinationQualifiedName:
                        'default/snowflake/1645488678/SNOWFLAKE_SAMPLE_DATA/TPCDS_SF10TCL/CATALOG_PAGE/CP_DEPARTMENT',
                    destinationAttribute: null,
                    destinationValue: null,
                    entityType: 'Column',
                    requestType: 'attach_classification',
                    confidenceScore: null,
                    botRunId: null,
                    approvedBy: null,
                    rejectedBy: null,
                    status: 'active',
                    message:
                        'Classification attach request by auto-classification from crawlers',
                    requestsBatch: null,
                    approvalType: 'single',
                    assignedApprovers: null,
                    payload: {
                        attributes: {
                            confidenceScore: 0.6363636363636364,
                            keywordsMatched: ['treatment'],
                            lastSyncRun:
                                'atlan-snowflake-default-snowflake-1645488678-k7ljr',
                            regexMatched: null,
                            rulesMatched: [
                                'New Zealand ministry of health number',
                            ],
                            timestamp: '1645488994.5118382',
                            userContext: '',
                        },
                        propagate: true,
                        removePropagationsOnEntityDelete: false,
                        typeName: 'tFGRstMirOLTRO5yvyk8Ic',
                        validityPeriods: [],
                    },
                    accessStartDate: null,
                    accessEndDate: null,
                    hash: 0,
                    isDuplicate: false,
                    sourceEntity: null,
                    destinationEntity: {
                        attributes: {
                            certificateStatus: null,
                            certificateStatusMessage: null,
                            certificateUpdatedAt: 0,
                            certificateUpdatedBy: null,
                            connectionName: null,
                            description: null,
                            displayName: null,
                            name: 'CP_DEPARTMENT',
                            qualifiedName:
                                'default/snowflake/1645488678/SNOWFLAKE_SAMPLE_DATA/TPCDS_SF10TCL/CATALOG_PAGE/CP_DEPARTMENT',
                            userDescription: null,
                        },
                        guid: '9cfbca02-7731-4b2b-a6e6-1f0c541728a9',
                    },
                },
                {
                    id: '8553bc71-00ee-4dea-99bd-c9b5c5e72dfe',
                    version: 'hidden-lab-0069',
                    isActive: true,
                    createdAt: 1645489010337,
                    updatedAt: 1645489010337,
                    createdBy:
                        'service-account-apikey-6f7f1591-a247-42bd-a969-11ec2e654678',
                    tenantId: 'default',
                    sourceType: 'atlas',
                    sourceGuid: null,
                    sourceQualifiedName: null,
                    sourceAttribute: null,
                    destinationGuid: 'c92ae55b-60d1-4d6c-b19b-2c334d00eeb1',
                    destinationQualifiedName:
                        'default/snowflake/1645488678/SNOWFLAKE_SAMPLE_DATA/TPCDS_SF10TCL/STORE/S_COUNTY',
                    destinationAttribute: null,
                    destinationValue: null,
                    entityType: 'Column',
                    requestType: 'attach_classification',
                    confidenceScore: null,
                    botRunId: null,
                    approvedBy: null,
                    rejectedBy: null,
                    status: 'active',
                    message:
                        'Classification attach request by auto-classification from crawlers',
                    requestsBatch: null,
                    approvalType: 'single',
                    assignedApprovers: null,
                    payload: {
                        attributes: {
                            confidenceScore: 0.631578947368421,
                            keywordsMatched: ['usa account'],
                            lastSyncRun:
                                'atlan-snowflake-default-snowflake-1645488678-k7ljr',
                            regexMatched: null,
                            rulesMatched: ['Australia bank account number'],
                            timestamp: '1645488994.4393983',
                            userContext: '',
                        },
                        propagate: true,
                        removePropagationsOnEntityDelete: false,
                        typeName: 'tFGRstMirOLTRO5yvyk8Ic',
                        validityPeriods: [],
                    },
                    accessStartDate: null,
                    accessEndDate: null,
                    hash: 0,
                    isDuplicate: false,
                    sourceEntity: null,
                    destinationEntity: {
                        attributes: {
                            certificateStatus: null,
                            certificateStatusMessage: null,
                            certificateUpdatedAt: 0,
                            certificateUpdatedBy: null,
                            connectionName: null,
                            description: null,
                            displayName: null,
                            name: 'S_COUNTY',
                            qualifiedName:
                                'default/snowflake/1645488678/SNOWFLAKE_SAMPLE_DATA/TPCDS_SF10TCL/STORE/S_COUNTY',
                            userDescription: null,
                        },
                        guid: 'c92ae55b-60d1-4d6c-b19b-2c334d00eeb1',
                    },
                },
                {
                    id: 'd948a527-555d-4638-8763-bbad997f42e3',
                    version: 'tiny-bar-7059',
                    isActive: true,
                    createdAt: 1645489010330,
                    updatedAt: 1645489010330,
                    createdBy:
                        'service-account-apikey-6f7f1591-a247-42bd-a969-11ec2e654678',
                    tenantId: 'default',
                    sourceType: 'atlas',
                    sourceGuid: null,
                    sourceQualifiedName: null,
                    sourceAttribute: null,
                    destinationGuid: 'cf9bfbe6-e875-4497-95cd-4f4dec198f4d',
                    destinationQualifiedName:
                        'default/snowflake/1645488678/SNOWFLAKE_SAMPLE_DATA/TPCDS_SF10TCL/CUSTOMER/C_CUSTOMER_ID',
                    destinationAttribute: null,
                    destinationValue: null,
                    entityType: 'Column',
                    requestType: 'attach_classification',
                    confidenceScore: null,
                    botRunId: null,
                    approvedBy: null,
                    rejectedBy: null,
                    status: 'active',
                    message:
                        'Classification attach request by auto-classification from crawlers',
                    requestsBatch: null,
                    approvalType: 'single',
                    assignedApprovers: null,
                    payload: {
                        attributes: {
                            confidenceScore: 0.64,
                            keywordsMatched: ['customername'],
                            lastSyncRun:
                                'atlan-snowflake-default-snowflake-1645488678-k7ljr',
                            regexMatched: null,
                            rulesMatched: ['Global'],
                            timestamp: '1645488994.3749132',
                            userContext: '',
                        },
                        propagate: true,
                        removePropagationsOnEntityDelete: false,
                        typeName: 'tFGRstMirOLTRO5yvyk8Ic',
                        validityPeriods: [],
                    },
                    accessStartDate: null,
                    accessEndDate: null,
                    hash: 0,
                    isDuplicate: false,
                    sourceEntity: null,
                    destinationEntity: {
                        attributes: {
                            certificateStatus: null,
                            certificateStatusMessage: null,
                            certificateUpdatedAt: 0,
                            certificateUpdatedBy: null,
                            connectionName: null,
                            description: null,
                            displayName: null,
                            name: 'C_CUSTOMER_ID',
                            qualifiedName:
                                'default/snowflake/1645488678/SNOWFLAKE_SAMPLE_DATA/TPCDS_SF10TCL/CUSTOMER/C_CUSTOMER_ID',
                            userDescription: null,
                        },
                        guid: 'cf9bfbe6-e875-4497-95cd-4f4dec198f4d',
                    },
                },
                {
                    id: 'ed776638-b7e8-4afb-a22d-98adb915eba3',
                    version: 'jolly-tree-4821',
                    isActive: true,
                    createdAt: 1645489010321,
                    updatedAt: 1645489010321,
                    createdBy:
                        'service-account-apikey-6f7f1591-a247-42bd-a969-11ec2e654678',
                    tenantId: 'default',
                    sourceType: 'atlas',
                    sourceGuid: null,
                    sourceQualifiedName: null,
                    sourceAttribute: null,
                    destinationGuid: 'b23d3747-6b63-415b-8cc3-5ff3529bd7b5',
                    destinationQualifiedName:
                        'default/snowflake/1645488678/SNOWFLAKE_SAMPLE_DATA/TPCDS_SF10TCL/CUSTOMER_DEMOGRAPHICS/CD_CREDIT_RATING',
                    destinationAttribute: null,
                    destinationValue: null,
                    entityType: 'Column',
                    requestType: 'attach_classification',
                    confidenceScore: null,
                    botRunId: null,
                    approvedBy: null,
                    rejectedBy: null,
                    status: 'active',
                    message:
                        'Classification attach request by auto-classification from crawlers',
                    requestsBatch: null,
                    approvalType: 'single',
                    assignedApprovers: null,
                    payload: {
                        attributes: {
                            confidenceScore: 0.6428571428571428,
                            keywordsMatched: ['registration'],
                            lastSyncRun:
                                'atlan-snowflake-default-snowflake-1645488678-k7ljr',
                            regexMatched: null,
                            rulesMatched: ['Belgium national number'],
                            timestamp: '1645488994.3036308',
                            userContext: '',
                        },
                        propagate: true,
                        removePropagationsOnEntityDelete: false,
                        typeName: 'tFGRstMirOLTRO5yvyk8Ic',
                        validityPeriods: [],
                    },
                    accessStartDate: null,
                    accessEndDate: null,
                    hash: 0,
                    isDuplicate: false,
                    sourceEntity: null,
                    destinationEntity: {
                        attributes: {
                            certificateStatus: null,
                            certificateStatusMessage: null,
                            certificateUpdatedAt: 0,
                            certificateUpdatedBy: null,
                            connectionName: null,
                            description: null,
                            displayName: null,
                            name: 'CD_CREDIT_RATING',
                            qualifiedName:
                                'default/snowflake/1645488678/SNOWFLAKE_SAMPLE_DATA/TPCDS_SF10TCL/CUSTOMER_DEMOGRAPHICS/CD_CREDIT_RATING',
                            userDescription: null,
                        },
                        guid: 'b23d3747-6b63-415b-8cc3-5ff3529bd7b5',
                    },
                },
                {
                    id: '535fccc8-e4c3-4149-8bdc-6afce7e2ede8',
                    version: 'proud-bird-0378',
                    isActive: true,
                    createdAt: 1645489010302,
                    updatedAt: 1645489010302,
                    createdBy:
                        'service-account-apikey-6f7f1591-a247-42bd-a969-11ec2e654678',
                    tenantId: 'default',
                    sourceType: 'atlas',
                    sourceGuid: null,
                    sourceQualifiedName: null,
                    sourceAttribute: null,
                    destinationGuid: 'e6c77f6e-eaea-4503-a5af-9612430449da',
                    destinationQualifiedName:
                        'default/snowflake/1645488678/SNOWFLAKE_SAMPLE_DATA/TPCDS_SF10TCL/CUSTOMER_DEMOGRAPHICS/CD_EDUCATION_STATUS',
                    destinationAttribute: null,
                    destinationValue: null,
                    entityType: 'Column',
                    requestType: 'attach_classification',
                    confidenceScore: null,
                    botRunId: null,
                    approvedBy: null,
                    rejectedBy: null,
                    status: 'active',
                    message:
                        'Classification attach request by auto-classification from crawlers',
                    requestsBatch: null,
                    approvalType: 'single',
                    assignedApprovers: null,
                    payload: {
                        attributes: {
                            confidenceScore: 0.631578947368421,
                            keywordsMatched: ['Registration Status'],
                            lastSyncRun:
                                'atlan-snowflake-default-snowflake-1645488678-k7ljr',
                            regexMatched: null,
                            rulesMatched: ['Brazil legal entity number (CNPJ)'],
                            timestamp: '1645488994.3036063',
                            userContext: '',
                        },
                        propagate: true,
                        removePropagationsOnEntityDelete: false,
                        typeName: 'tFGRstMirOLTRO5yvyk8Ic',
                        validityPeriods: [],
                    },
                    accessStartDate: null,
                    accessEndDate: null,
                    hash: 0,
                    isDuplicate: false,
                    sourceEntity: null,
                    destinationEntity: {
                        attributes: {
                            certificateStatus: null,
                            certificateStatusMessage: null,
                            certificateUpdatedAt: 0,
                            certificateUpdatedBy: null,
                            connectionName: null,
                            description: null,
                            displayName: null,
                            name: 'CD_EDUCATION_STATUS',
                            qualifiedName:
                                'default/snowflake/1645488678/SNOWFLAKE_SAMPLE_DATA/TPCDS_SF10TCL/CUSTOMER_DEMOGRAPHICS/CD_EDUCATION_STATUS',
                            userDescription: null,
                        },
                        guid: 'e6c77f6e-eaea-4503-a5af-9612430449da',
                    },
                },
                {
                    id: 'dce28f0f-e9f2-48c8-af4d-38b331e08d8e',
                    version: 'spring-wave-5579',
                    isActive: true,
                    createdAt: 1645489010295,
                    updatedAt: 1645489010295,
                    createdBy:
                        'service-account-apikey-6f7f1591-a247-42bd-a969-11ec2e654678',
                    tenantId: 'default',
                    sourceType: 'atlas',
                    sourceGuid: null,
                    sourceQualifiedName: null,
                    sourceAttribute: null,
                    destinationGuid: '9b9960cd-06a7-4e78-8388-c442be766804',
                    destinationQualifiedName:
                        'default/snowflake/1645488678/SNOWFLAKE_SAMPLE_DATA/TPCDS_SF10TCL/CALL_CENTER/CC_STREET_NAME',
                    destinationAttribute: null,
                    destinationValue: null,
                    entityType: 'Column',
                    requestType: 'attach_classification',
                    confidenceScore: null,
                    botRunId: null,
                    approvedBy: null,
                    rejectedBy: null,
                    status: 'active',
                    message:
                        'Classification attach request by auto-classification from crawlers',
                    requestsBatch: null,
                    approvalType: 'single',
                    assignedApprovers: null,
                    payload: {
                        attributes: {
                            confidenceScore: 0.6153846153846154,
                            keywordsMatched: ['customername'],
                            lastSyncRun:
                                'atlan-snowflake-default-snowflake-1645488678-k7ljr',
                            regexMatched: null,
                            rulesMatched: ['Global'],
                            timestamp: '1645488994.3035772',
                            userContext: '',
                        },
                        propagate: true,
                        removePropagationsOnEntityDelete: false,
                        typeName: 'tFGRstMirOLTRO5yvyk8Ic',
                        validityPeriods: [],
                    },
                    accessStartDate: null,
                    accessEndDate: null,
                    hash: 0,
                    isDuplicate: false,
                    sourceEntity: null,
                    destinationEntity: {
                        attributes: {
                            certificateStatus: null,
                            certificateStatusMessage: null,
                            certificateUpdatedAt: 0,
                            certificateUpdatedBy: null,
                            connectionName: null,
                            description: null,
                            displayName: null,
                            name: 'CC_STREET_NAME',
                            qualifiedName:
                                'default/snowflake/1645488678/SNOWFLAKE_SAMPLE_DATA/TPCDS_SF10TCL/CALL_CENTER/CC_STREET_NAME',
                            userDescription: null,
                        },
                        guid: '9b9960cd-06a7-4e78-8388-c442be766804',
                    },
                },
                {
                    id: 'bb91358b-39ce-4a30-b534-52422e4ae53a',
                    version: 'wispy-smoke-3969',
                    isActive: true,
                    createdAt: 1645489010286,
                    updatedAt: 1645489010286,
                    createdBy:
                        'service-account-apikey-6f7f1591-a247-42bd-a969-11ec2e654678',
                    tenantId: 'default',
                    sourceType: 'atlas',
                    sourceGuid: null,
                    sourceQualifiedName: null,
                    sourceAttribute: null,
                    destinationGuid: '1bbc307d-4e1b-423d-8574-c1483e889f91',
                    destinationQualifiedName:
                        'default/snowflake/1645488678/SNOWFLAKE_SAMPLE_DATA/TPCDS_SF10TCL/CUSTOMER_ADDRESS/CA_ADDRESS_SK',
                    destinationAttribute: null,
                    destinationValue: null,
                    entityType: 'Column',
                    requestType: 'attach_classification',
                    confidenceScore: null,
                    botRunId: null,
                    approvedBy: null,
                    rejectedBy: null,
                    status: 'active',
                    message:
                        'Classification attach request by auto-classification from crawlers',
                    requestsBatch: null,
                    approvalType: 'single',
                    assignedApprovers: null,
                    payload: {
                        attributes: {
                            confidenceScore: 0.7,
                            keywordsMatched: ['address'],
                            lastSyncRun:
                                'atlan-snowflake-default-snowflake-1645488678-k7ljr',
                            regexMatched: null,
                            rulesMatched: ['Global'],
                            timestamp: '1645488994.303521',
                            userContext: '',
                        },
                        propagate: true,
                        removePropagationsOnEntityDelete: false,
                        typeName: 'tFGRstMirOLTRO5yvyk8Ic',
                        validityPeriods: [],
                    },
                    accessStartDate: null,
                    accessEndDate: null,
                    hash: 0,
                    isDuplicate: false,
                    sourceEntity: null,
                    destinationEntity: {
                        attributes: {
                            certificateStatus: null,
                            certificateStatusMessage: null,
                            certificateUpdatedAt: 0,
                            certificateUpdatedBy: null,
                            connectionName: null,
                            description: null,
                            displayName: null,
                            name: 'CA_ADDRESS_SK',
                            qualifiedName:
                                'default/snowflake/1645488678/SNOWFLAKE_SAMPLE_DATA/TPCDS_SF10TCL/CUSTOMER_ADDRESS/CA_ADDRESS_SK',
                            userDescription: null,
                        },
                        guid: '1bbc307d-4e1b-423d-8574-c1483e889f91',
                    },
                },
                {
                    id: '9e1a2e08-d5fe-4730-984c-961dfc60c053',
                    version: 'yellow-boat-2686',
                    isActive: true,
                    createdAt: 1645489010279,
                    updatedAt: 1645489010279,
                    createdBy:
                        'service-account-apikey-6f7f1591-a247-42bd-a969-11ec2e654678',
                    tenantId: 'default',
                    sourceType: 'atlas',
                    sourceGuid: null,
                    sourceQualifiedName: null,
                    sourceAttribute: null,
                    destinationGuid: '977944a3-55f3-4f2b-8033-902dae8fb12a',
                    destinationQualifiedName:
                        'default/snowflake/1645488678/SNOWFLAKE_SAMPLE_DATA/TPCDS_SF10TCL/WAREHOUSE/W_SUITE_NUMBER',
                    destinationAttribute: null,
                    destinationValue: null,
                    entityType: 'Column',
                    requestType: 'attach_classification',
                    confidenceScore: null,
                    botRunId: null,
                    approvedBy: null,
                    rejectedBy: null,
                    status: 'active',
                    message:
                        'Classification attach request by auto-classification from crawlers',
                    requestsBatch: null,
                    approvalType: 'single',
                    assignedApprovers: null,
                    payload: {
                        attributes: {
                            confidenceScore: 0.6206896551724138,
                            keywordsMatched: ['business number'],
                            lastSyncRun:
                                'atlan-snowflake-default-snowflake-1645488678-k7ljr',
                            regexMatched: null,
                            rulesMatched: ['Australia business number'],
                            timestamp: '1645488994.3034434',
                            userContext: '',
                        },
                        propagate: true,
                        removePropagationsOnEntityDelete: false,
                        typeName: 'tFGRstMirOLTRO5yvyk8Ic',
                        validityPeriods: [],
                    },
                    accessStartDate: null,
                    accessEndDate: null,
                    hash: 0,
                    isDuplicate: false,
                    sourceEntity: null,
                    destinationEntity: {
                        attributes: {
                            certificateStatus: null,
                            certificateStatusMessage: null,
                            certificateUpdatedAt: 0,
                            certificateUpdatedBy: null,
                            connectionName: null,
                            description: null,
                            displayName: null,
                            name: 'W_SUITE_NUMBER',
                            qualifiedName:
                                'default/snowflake/1645488678/SNOWFLAKE_SAMPLE_DATA/TPCDS_SF10TCL/WAREHOUSE/W_SUITE_NUMBER',
                            userDescription: null,
                        },
                        guid: '977944a3-55f3-4f2b-8033-902dae8fb12a',
                    },
                },
                {
                    id: '3eb6a4db-b379-40d0-a30b-5c4cf1579c01',
                    version: 'dawn-sea-0527',
                    isActive: true,
                    createdAt: 1645489010268,
                    updatedAt: 1645489010268,
                    createdBy:
                        'service-account-apikey-6f7f1591-a247-42bd-a969-11ec2e654678',
                    tenantId: 'default',
                    sourceType: 'atlas',
                    sourceGuid: null,
                    sourceQualifiedName: null,
                    sourceAttribute: null,
                    destinationGuid: 'aa3bfc31-2b49-482a-889e-5349af521af8',
                    destinationQualifiedName:
                        'default/snowflake/1645488678/SNOWFLAKE_SAMPLE_DATA/TPCDS_SF10TCL/WEB_SALES/WS_ORDER_NUMBER',
                    destinationAttribute: null,
                    destinationValue: null,
                    entityType: 'Column',
                    requestType: 'attach_classification',
                    confidenceScore: null,
                    botRunId: null,
                    approvedBy: null,
                    rejectedBy: null,
                    status: 'active',
                    message:
                        'Classification attach request by auto-classification from crawlers',
                    requestsBatch: null,
                    approvalType: 'single',
                    assignedApprovers: null,
                    payload: {
                        attributes: {
                            confidenceScore: 0.6153846153846154,
                            keywordsMatched: ['phonenumber'],
                            lastSyncRun:
                                'atlan-snowflake-default-snowflake-1645488678-k7ljr',
                            regexMatched: null,
                            rulesMatched: ['Global'],
                            timestamp: '1645488994.1740184',
                            userContext: '',
                        },
                        propagate: true,
                        removePropagationsOnEntityDelete: false,
                        typeName: 'tFGRstMirOLTRO5yvyk8Ic',
                        validityPeriods: [],
                    },
                    accessStartDate: null,
                    accessEndDate: null,
                    hash: 0,
                    isDuplicate: false,
                    sourceEntity: null,
                    destinationEntity: {
                        attributes: {
                            certificateStatus: null,
                            certificateStatusMessage: null,
                            certificateUpdatedAt: 0,
                            certificateUpdatedBy: null,
                            connectionName: null,
                            description: null,
                            displayName: null,
                            name: 'WS_ORDER_NUMBER',
                            qualifiedName:
                                'default/snowflake/1645488678/SNOWFLAKE_SAMPLE_DATA/TPCDS_SF10TCL/WEB_SALES/WS_ORDER_NUMBER',
                            userDescription: null,
                        },
                        guid: 'aa3bfc31-2b49-482a-889e-5349af521af8',
                    },
                },
                {
                    id: 'bb40ec2f-4307-4cee-b726-de69276d8d55',
                    version: 'sweet-lake-9910',
                    isActive: true,
                    createdAt: 1645489010259,
                    updatedAt: 1645489010259,
                    createdBy:
                        'service-account-apikey-6f7f1591-a247-42bd-a969-11ec2e654678',
                    tenantId: 'default',
                    sourceType: 'atlas',
                    sourceGuid: null,
                    sourceQualifiedName: null,
                    sourceAttribute: null,
                    destinationGuid: 'ad75b820-5da3-4346-a374-6cdcf9c4594c',
                    destinationQualifiedName:
                        'default/snowflake/1645488678/SNOWFLAKE_SAMPLE_DATA/TPCDS_SF10TCL/PROMOTION/P_CHANNEL_DETAILS',
                    destinationAttribute: null,
                    destinationValue: null,
                    entityType: 'Column',
                    requestType: 'attach_classification',
                    confidenceScore: null,
                    botRunId: null,
                    approvedBy: null,
                    rejectedBy: null,
                    status: 'active',
                    message:
                        'Classification attach request by auto-classification from crawlers',
                    requestsBatch: null,
                    approvalType: 'single',
                    assignedApprovers: null,
                    payload: {
                        attributes: {
                            confidenceScore: 0.6206896551724138,
                            keywordsMatched: ['bank details'],
                            lastSyncRun:
                                'atlan-snowflake-default-snowflake-1645488678-k7ljr',
                            regexMatched: null,
                            rulesMatched: ['Australia bank account number'],
                            timestamp: '1645488994.1033745',
                            userContext: '',
                        },
                        propagate: true,
                        removePropagationsOnEntityDelete: false,
                        typeName: 'tFGRstMirOLTRO5yvyk8Ic',
                        validityPeriods: [],
                    },
                    accessStartDate: null,
                    accessEndDate: null,
                    hash: 0,
                    isDuplicate: false,
                    sourceEntity: null,
                    destinationEntity: {
                        attributes: {
                            certificateStatus: null,
                            certificateStatusMessage: null,
                            certificateUpdatedAt: 0,
                            certificateUpdatedBy: null,
                            connectionName: null,
                            description: null,
                            displayName: null,
                            name: 'P_CHANNEL_DETAILS',
                            qualifiedName:
                                'default/snowflake/1645488678/SNOWFLAKE_SAMPLE_DATA/TPCDS_SF10TCL/PROMOTION/P_CHANNEL_DETAILS',
                            userDescription: null,
                        },
                        guid: 'ad75b820-5da3-4346-a374-6cdcf9c4594c',
                    },
                },
                {
                    id: '1ba7c9a3-7da5-4ab9-a1f7-a5ee8f0c0da7',
                    version: 'cold-king-3990',
                    isActive: true,
                    createdAt: 1645489010206,
                    updatedAt: 1645489010206,
                    createdBy:
                        'service-account-apikey-6f7f1591-a247-42bd-a969-11ec2e654678',
                    tenantId: 'default',
                    sourceType: 'atlas',
                    sourceGuid: null,
                    sourceQualifiedName: null,
                    sourceAttribute: null,
                    destinationGuid: 'caaca5db-fcfc-4829-adb1-ea9899677653',
                    destinationQualifiedName:
                        'default/snowflake/1645488678/SNOWFLAKE_SAMPLE_DATA/TPCDS_SF10TCL/REASON/R_REASON_ID',
                    destinationAttribute: null,
                    destinationValue: null,
                    entityType: 'Column',
                    requestType: 'attach_classification',
                    confidenceScore: null,
                    botRunId: null,
                    approvedBy: null,
                    rejectedBy: null,
                    status: 'active',
                    message:
                        'Classification attach request by auto-classification from crawlers',
                    requestsBatch: null,
                    approvalType: 'single',
                    assignedApprovers: null,
                    payload: {
                        attributes: {
                            confidenceScore: 0.631578947368421,
                            keywordsMatched: ['regon id'],
                            lastSyncRun:
                                'atlan-snowflake-default-snowflake-1645488678-k7ljr',
                            regexMatched: null,
                            rulesMatched: ['Poland REGON number'],
                            timestamp: '1645488994.1033518',
                            userContext: '',
                        },
                        propagate: true,
                        removePropagationsOnEntityDelete: false,
                        typeName: 'tFGRstMirOLTRO5yvyk8Ic',
                        validityPeriods: [],
                    },
                    accessStartDate: null,
                    accessEndDate: null,
                    hash: 0,
                    isDuplicate: false,
                    sourceEntity: null,
                    destinationEntity: {
                        attributes: {
                            certificateStatus: null,
                            certificateStatusMessage: null,
                            certificateUpdatedAt: 0,
                            certificateUpdatedBy: null,
                            connectionName: null,
                            description: null,
                            displayName: null,
                            name: 'R_REASON_ID',
                            qualifiedName:
                                'default/snowflake/1645488678/SNOWFLAKE_SAMPLE_DATA/TPCDS_SF10TCL/REASON/R_REASON_ID',
                            userDescription: null,
                        },
                        guid: 'caaca5db-fcfc-4829-adb1-ea9899677653',
                    },
                },
                {
                    id: '56e2f315-35ef-47b3-a19c-48340fa7e0c1',
                    version: 'quiet-morning-1833',
                    isActive: true,
                    createdAt: 1645489010184,
                    updatedAt: 1645489010184,
                    createdBy:
                        'service-account-apikey-6f7f1591-a247-42bd-a969-11ec2e654678',
                    tenantId: 'default',
                    sourceType: 'atlas',
                    sourceGuid: null,
                    sourceQualifiedName: null,
                    sourceAttribute: null,
                    destinationGuid: 'bffc9374-74cc-4ee7-83ce-be7d99693621',
                    destinationQualifiedName:
                        'default/snowflake/1645488678/SNOWFLAKE_SAMPLE_DATA/TPCDS_SF10TCL/HOUSEHOLD_DEMOGRAPHICS/HD_VEHICLE_COUNT',
                    destinationAttribute: null,
                    destinationValue: null,
                    entityType: 'Column',
                    requestType: 'attach_classification',
                    confidenceScore: null,
                    botRunId: null,
                    approvedBy: null,
                    rejectedBy: null,
                    status: 'active',
                    message:
                        'Classification attach request by auto-classification from crawlers',
                    requestsBatch: null,
                    approvalType: 'single',
                    assignedApprovers: null,
                    payload: {
                        attributes: {
                            confidenceScore: 0.6206896551724138,
                            keywordsMatched: ['Debit Account'],
                            lastSyncRun:
                                'atlan-snowflake-default-snowflake-1645488678-k7ljr',
                            regexMatched: null,
                            rulesMatched: ['Japan bank account number'],
                            timestamp: '1645488994.1033256',
                            userContext: '',
                        },
                        propagate: true,
                        removePropagationsOnEntityDelete: false,
                        typeName: 'tFGRstMirOLTRO5yvyk8Ic',
                        validityPeriods: [],
                    },
                    accessStartDate: null,
                    accessEndDate: null,
                    hash: 0,
                    isDuplicate: false,
                    sourceEntity: null,
                    destinationEntity: {
                        attributes: {
                            certificateStatus: null,
                            certificateStatusMessage: null,
                            certificateUpdatedAt: 0,
                            certificateUpdatedBy: null,
                            connectionName: null,
                            description: null,
                            displayName: null,
                            name: 'HD_VEHICLE_COUNT',
                            qualifiedName:
                                'default/snowflake/1645488678/SNOWFLAKE_SAMPLE_DATA/TPCDS_SF10TCL/HOUSEHOLD_DEMOGRAPHICS/HD_VEHICLE_COUNT',
                            userDescription: null,
                        },
                        guid: 'bffc9374-74cc-4ee7-83ce-be7d99693621',
                    },
                },
                {
                    id: '8d1c7126-163e-4b1d-b7c2-c1fb5df78ae5',
                    version: 'purple-dew-1329',
                    isActive: true,
                    createdAt: 1645489010176,
                    updatedAt: 1645489010176,
                    createdBy:
                        'service-account-apikey-6f7f1591-a247-42bd-a969-11ec2e654678',
                    tenantId: 'default',
                    sourceType: 'atlas',
                    sourceGuid: null,
                    sourceQualifiedName: null,
                    sourceAttribute: null,
                    destinationGuid: 'c09c5c65-65be-42c6-8936-e6a0bdf2f486',
                    destinationQualifiedName:
                        'default/snowflake/1645488678/SNOWFLAKE_SAMPLE_DATA/TPCDS_SF10TCL/CUSTOMER_ADDRESS/CA_ADDRESS_ID',
                    destinationAttribute: null,
                    destinationValue: null,
                    entityType: 'Column',
                    requestType: 'attach_classification',
                    confidenceScore: null,
                    botRunId: null,
                    approvedBy: null,
                    rejectedBy: null,
                    status: 'active',
                    message:
                        'Classification attach request by auto-classification from crawlers',
                    requestsBatch: null,
                    approvalType: 'single',
                    assignedApprovers: null,
                    payload: {
                        attributes: {
                            confidenceScore: 0.7,
                            keywordsMatched: ['address'],
                            lastSyncRun:
                                'atlan-snowflake-default-snowflake-1645488678-k7ljr',
                            regexMatched: null,
                            rulesMatched: ['Global'],
                            timestamp: '1645488994.103289',
                            userContext: '',
                        },
                        propagate: true,
                        removePropagationsOnEntityDelete: false,
                        typeName: 'tFGRstMirOLTRO5yvyk8Ic',
                        validityPeriods: [],
                    },
                    accessStartDate: null,
                    accessEndDate: null,
                    hash: 0,
                    isDuplicate: false,
                    sourceEntity: null,
                    destinationEntity: {
                        attributes: {
                            certificateStatus: null,
                            certificateStatusMessage: null,
                            certificateUpdatedAt: 0,
                            certificateUpdatedBy: null,
                            connectionName: null,
                            description: null,
                            displayName: null,
                            name: 'CA_ADDRESS_ID',
                            qualifiedName:
                                'default/snowflake/1645488678/SNOWFLAKE_SAMPLE_DATA/TPCDS_SF10TCL/CUSTOMER_ADDRESS/CA_ADDRESS_ID',
                            userDescription: null,
                        },
                        guid: 'c09c5c65-65be-42c6-8936-e6a0bdf2f486',
                    },
                },
                {
                    id: '1f57ea94-b5cd-4491-ae0e-b1f883411927',
                    version: 'delicate-paper-9468',
                    isActive: true,
                    createdAt: 1645489010163,
                    updatedAt: 1645489010163,
                    createdBy:
                        'service-account-apikey-6f7f1591-a247-42bd-a969-11ec2e654678',
                    tenantId: 'default',
                    sourceType: 'atlas',
                    sourceGuid: null,
                    sourceQualifiedName: null,
                    sourceAttribute: null,
                    destinationGuid: 'cf91a023-a2a4-4ce8-bdee-56e5a0d3e9d7',
                    destinationQualifiedName:
                        'default/snowflake/1645488678/SNOWFLAKE_SAMPLE_DATA/TPCDS_SF10TCL/ITEM/I_MANUFACT_ID',
                    destinationAttribute: null,
                    destinationValue: null,
                    entityType: 'Column',
                    requestType: 'attach_classification',
                    confidenceScore: null,
                    botRunId: null,
                    approvedBy: null,
                    rejectedBy: null,
                    status: 'active',
                    message:
                        'Classification attach request by auto-classification from crawlers',
                    requestsBatch: null,
                    approvalType: 'single',
                    assignedApprovers: null,
                    payload: {
                        attributes: {
                            confidenceScore: 0.64,
                            keywordsMatched: ['bank_acct_id'],
                            lastSyncRun:
                                'atlan-snowflake-default-snowflake-1645488678-k7ljr',
                            regexMatched: null,
                            rulesMatched: ['New Zealand bank account number'],
                            timestamp: '1645488994.1027696',
                            userContext: '',
                        },
                        propagate: true,
                        removePropagationsOnEntityDelete: false,
                        typeName: 'tFGRstMirOLTRO5yvyk8Ic',
                        validityPeriods: [],
                    },
                    accessStartDate: null,
                    accessEndDate: null,
                    hash: 0,
                    isDuplicate: false,
                    sourceEntity: null,
                    destinationEntity: {
                        attributes: {
                            certificateStatus: null,
                            certificateStatusMessage: null,
                            certificateUpdatedAt: 0,
                            certificateUpdatedBy: null,
                            connectionName: null,
                            description: null,
                            displayName: null,
                            name: 'I_MANUFACT_ID',
                            qualifiedName:
                                'default/snowflake/1645488678/SNOWFLAKE_SAMPLE_DATA/TPCDS_SF10TCL/ITEM/I_MANUFACT_ID',
                            userDescription: null,
                        },
                        guid: 'cf91a023-a2a4-4ce8-bdee-56e5a0d3e9d7',
                    },
                },
            ])

            const isFilterApplied = computed(() => {
                // * sanitization of facets object should be done by the filter component, handling it here due to potential regression
                if (!Object.values(filters.value)?.length) return false
                const hasValue = Object.values(filters.value).some((v) => {
                    if (typeof v === 'object' && Object.keys(v).length)
                        return true
                    if (Array.isArray(v) && v.length) return true
                    if (v && v === 'active') return true
                    return false
                })
                return hasValue
            })

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
                // requestList.value =
                //     response.value?.records?.filter((req) =>
                //         Array.isArray(filters.value.status)
                //             ? filters.value.status.includes(req.status)
                //             : req.status === filters.value.status
                //     ) || []
                // requestList.value = response.value?.records || []
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
                // if (listError.value)
                //     message.error('Failed to load request data.')
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
                // destinationQualifiedName
                const facetsValue = facets.value
                const status = facetsValue.statusRequest
                    ? facetsValue.statusRequest
                    : []
                const createdBy = facetsValue?.owners?.ownerUsers || []
                // const typeName = facetsValue.__traitNames.classifications || []
                const filterMerge = {
                    ...filters.value,
                    // status: status.length > 0 ? status : 'active',
                    status,
                    createdBy,
                    // typeName,
                }
                delete filterMerge.destinationQualifiedName
                if (facetsValue.hierarchy?.connectorName) {
                    filterMerge.destinationQualifiedName =
                        facetsValue.hierarchy?.connectorName
                }
                if (facetsValue.hierarchy?.connectionQualifiedName) {
                    filterMerge.destinationQualifiedName =
                        facetsValue.hierarchy?.connectionQualifiedName
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
            onMounted(() => {
                const el = document.getElementsByClassName(
                    'refresh-icon-request'
                )
                if (el) {
                    el[0]?.children.forEach((p) => {
                        p.setAttribute('fill', '#3e4359')
                    })
                }
            })
            return {
                isFilterApplied,
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

<style lang="less" scoped>
    .request-done-leave-active {
        transition: all 300ms cubic-bezier(0.4, 0, 1, 1);
        // transform: translateX(-500px);
    }
    .request-done-leave-to {
        opacity: 0;
        transform: translateX(-100%);
        // height: 0;
    }
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
        left: 300px !important;
        top: 12px;
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
<style lang="less">
    // #374151
</style>
<style lang="less" scoped>
    .container-empty {
        height: 65vh !important;
    }
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

    .divider-filter {
        top: -5px;
        height: 30px;
        right: 0;
    }
</style>

<style lang="less" module>
    .request-filter-wrapper {
        :global(.filter-head) {
            background: inherit !important;
            height: 52px;
            @apply pt-4 !important;
        }
    }
</style>
