<template>
    <div class="h-full">
        <div
            v-if="!totalLogsCount && !isLoading"
            class="flex flex-col items-center justify-center h-full"
        >
            <component :is="EmptyLogsIllustration" class="mb-4"></component>
            <div class="mb-4 text-xl font-bold">Your logs will appear here</div>
            <AtlanBtn
                padding="compact"
                size="sm"
                color="secondary"
                class="hidden mt-3 bg-transparent border-none px-7 text-primary"
            >
                Your logs will appear here<AtlanIcon icon="ArrowRight" />
            </AtlanBtn>
        </div>
        <DefaultLayout v-else title="Access Logs">
            <template #header>
                <div class="flex items-center justify-between pb-3">
                    <div class="flex items-stretch w-full">
                        <div class="flex items-center">
                            <AtlanBtn
                                color="secondary"
                                class="px-2 rounded-tr-none rounded-br-none"
                                :class="
                                    queryLogsFilterDrawerVisible
                                        ? 'text-primary border-primary'
                                        : 'border-gray-300  border rounded-tl rounded-bl text-gray '
                                "
                                @click="queryLogsFilterDrawerVisible = true"
                            >
                                <AtlanIcon
                                    :icon="'FilterFunnel'"
                                    class="w-4 h-4"
                                />
                            </AtlanBtn>
                        </div>
                        <a-input-search
                            v-model:value="searchText"
                            :placeholder="
                                filteredLogsCount
                                    ? `Search through ${filteredLogsCount} logs`
                                    : `Search logs`
                            "
                            class="w-1/3 mr-1 border border-l-0 border-gray-300 rounded-none rounded-tr rounded-br shadow-sm "
                            size="default"
                            :allow-clear="true"
                            @change="handleSearch"
                        ></a-input-search>
                    </div>
                    <div class="flex-grow w-0"></div>

                    <TimeFrameSelector
                        v-model:modelValue="timeFrame"
                        :time-frame="timeFrame"
                        @change="handleRangePickerChange"
                    />
                </div>
            </template>

            <AccessLogsTable
                :access-logs-list="accessLogsList"
                :is-loading="isLoading"
                :asset-meta-map="assetMetaMap"
            />

            <div
                v-if="(accessLogsList && accessLogsList.length) || isLoading"
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
                    class="bg-transparent border-l-0 border-r-0 rounded-none cursor-default "
                    size="sm"
                    color="secondary"
                    padding="compact"
                >
                    {{ pagination.current }} of
                    <span v-if="Math.ceil(pagination.total)">{{
                        Math.ceil(pagination.total)
                    }}</span>

                    <div
                        v-else-if="isLoading"
                        class="flex items-center justify-center"
                    >
                        <AtlanIcon icon="CircleLoader" class="animate-spin" />
                    </div>
                </AtlanBtn>

                <AtlanBtn
                    class="bg-transparent rounded-l-none"
                    size="sm"
                    color="secondary"
                    padding="compact"
                    :disabled="
                        pagination.current === Math.ceil(pagination.total)
                    "
                    @click="handlePagination(pagination.current + 1)"
                >
                    <AtlanIcon icon="CaretRight" />
                </AtlanBtn>
            </div>
        </DefaultLayout>

        <a-drawer
            :visible="queryLogsFilterDrawerVisible"
            :mask="false"
            :placement="'left'"
            :width="286"
            :closable="false"
        >
            <div class="relative">
                <AssetFilters
                    v-model="facets"
                    :filter-list="queryLogsFilter"
                    :allow-custom-filters="false"
                    class="bg-gray-100"
                    @change="handleFilterChange"
                    @reset="handleResetEvent"
                >
                    <Connector
                        v-model:data="facets.connector"
                        :bg-gray-for-selector="false"
                        :filter-source-ids="['powerbi', 'tableau']"
                        class="px-2 py-3"
                        @change="handleFilterChange"
                /></AssetFilters>
                <AtlanBtn
                    v-if="queryLogsFilterDrawerVisible"
                    class="fixed z-10 px-0 border-l-0 rounded-none rounded-r  top-1/4 left-72"
                    color="secondary"
                    @click="
                        () => {
                            queryLogsFilterDrawerVisible = false
                        }
                    "
                >
                    <AtlanIcon
                        icon="ChevronDown"
                        class="h-4 px-1 transition-transform transform rotate-90 "
                    />
                </AtlanBtn>
            </div>
        </a-drawer>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, watch, computed } from 'vue'
import dayjs from 'dayjs'
import { useDebounceFn } from '@vueuse/core'
import map from '~/constant/accessControl/map'
import DefaultLayout from '~/components/admin/layout.vue'
import AtlanBtn from '@/UI/button.vue'
import AccessLogsTable from '@/governance/accessLogs/accessLogsTable.vue'
import TimeFrameSelector from '~/components/admin/common/timeFrameSelector.vue'
import { useAccessLogs } from './composables/useAccessLogs'
import AssetFilters from '@/common/assets/filters/index.vue'
import { queryLogsFilter } from '~/constant/filters/logsFilter'
import Connector from '~/components/insights/common/connector/connector.vue'
import { useConnector } from '~/components/insights/common/composables/useConnector'
import EmptyLogsIllustration from '~/assets/images/illustrations/empty_logs.svg'

export default defineComponent({
    name: 'AccessLogsView',
    components: {
        DefaultLayout,
        AtlanBtn,
        AccessLogsTable,
        TimeFrameSelector,
        AssetFilters,
        Connector,
    },
    setup() {
        /** LOCAL STATE */
        const facets = ref({})
        const searchText: Ref<string> = ref('')
        const queryLogsFilterDrawerVisible: Ref<boolean> = ref(false)
        const timeFrame = ref('30 days')
        const selectedQuery = ref({})
        const isQueryPreviewDrawerVisible = ref(false)
        const gte = ref(
            dayjs(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).format()
        )
        const lt = ref(dayjs().format())
        const from = ref(0)
        const size = ref(20)
        const { getDatabaseName, getSchemaName, getConnectionQualifiedName } =
            useConnector()
        const {
            list: accessLogsList,
            mutateBody,
            refetchList,
            isLoading,
            filteredLogsCount,
            assetMetaMap,
        } = useAccessLogs(gte, lt, from, size)
        // since we always get filtered total count in response, storing the total count when we get the logs first time, i.e. when no filters are applied to find the total number of logs to decide if we want to render empty state or logs table.
        const totalLogsCount = ref(0)
        const stopWatcher = watch(filteredLogsCount, () => {
            totalLogsCount.value = filteredLogsCount.value
        })
        watch(totalLogsCount, stopWatcher)
        const toggleQueryPreviewDrawer = (
            val: boolean | undefined = undefined
        ) => {
            if (val === undefined)
                isQueryPreviewDrawerVisible.value =
                    !isQueryPreviewDrawerVisible.value
            else isQueryPreviewDrawerVisible.value = val
        }

        const setSelectedQuery = (query: Object) => {
            selectedQuery.value = query
        }
        const handleSelectQuery = (query: Object) => {
            if (
                isQueryPreviewDrawerVisible.value &&
                query._id === selectedQuery.value._id
            ) {
                isQueryPreviewDrawerVisible.value = false
            } else if (!isQueryPreviewDrawerVisible.value) {
                isQueryPreviewDrawerVisible.value = true
            }
            setSelectedQuery(query)
        }
        const selectedRowKeys = computed(() =>
            selectedQuery.value?._id !== undefined
                ? [selectedQuery.value?._id]
                : []
        )
        const pagination = computed(() => ({
            total: filteredLogsCount.value / size.value,
            pageSize: size.value,
            current: from.value / size.value + 1,
        }))
        const refreshList = () => {
            const usernames = facets.value?.users?.ownerUsers
            const queryStatusValues = facets.value?.queryStatus?.status
            const connectorFacet = facets.value?.connector?.attributeName
            const facetValue = facets.value?.connector?.attributeValue
            let schemaName = ''
            let dbName = ''
            let connectionQF = ''
            let connectorName = ''
            if (connectorFacet) {
                if (connectorFacet === 'schemaQualifiedName') {
                    dbName = getDatabaseName(facetValue) || ''
                    schemaName = getSchemaName(facetValue) || ''
                    connectionQF = getConnectionQualifiedName(facetValue) || ''
                } else if (connectorFacet === 'databaseQualifiedName') {
                    dbName = getDatabaseName(facetValue) || ''
                    connectionQF = getConnectionQualifiedName(facetValue) || ''
                } else if (connectorFacet === 'connectionQualifiedName') {
                    connectionQF = facetValue || ''
                } else if (connectorFacet === 'connectorName') {
                    connectorName = facetValue || ''
                }
            }
            mutateBody({
                from,
                size,
                gte,
                lt,
                usernames,
                queryStatusValues,
                dbName,
                schemaName,
                connectionQF,
                connectorName,
                searchText: searchText.value,
            })
            refetchList()
        }
        const handleFilterChange = () => {
            from.value = 0
            refreshList()
        }
        const handlePagination = (page) => {
            const offset = (page - 1) * size.value
            from.value = offset
            refreshList()
        }

        const handleRangePickerChange = (e) => {
            gte.value = e[0]
            lt.value = e[1]
            refreshList()
        }
        const handleSearch = useDebounceFn(() => {
            from.value = 0
            refreshList()
        }, 200)
        const handleResetEvent = () => {
            facets.value = {}
            handleFilterChange()
        }
        return {
            selectedRowKeys,
            isQueryPreviewDrawerVisible,
            selectedQuery,
            accessLogsList,
            isLoading,
            handleSearch,
            handleSelectQuery,
            toggleQueryPreviewDrawer,
            handleRangePickerChange,
            timeFrame,
            searchText,
            queryLogsFilterDrawerVisible,
            map,
            queryLogsFilter,
            handleFilterChange,
            handleResetEvent,
            facets,
            pagination,
            filteredLogsCount,
            handlePagination,
            assetMetaMap,
            totalLogsCount,
            EmptyLogsIllustration,
        }
    },
})
</script>