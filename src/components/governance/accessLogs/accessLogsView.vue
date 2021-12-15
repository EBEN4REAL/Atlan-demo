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
                                    accessLogsFilterDrawerVisible
                                        ? 'text-primary border-primary'
                                        : 'border-gray-300  border rounded-tl rounded-bl text-gray '
                                "
                                @click="
                                    accessLogsFilterDrawerVisible =
                                        !accessLogsFilterDrawerVisible
                                "
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
                            class="w-1/3 mr-1 border border-l-0 border-gray-300 rounded-none rounded-tr rounded-br shadow-sm"
                            size="default"
                            :allow-clear="true"
                            @change="handleSearch"
                        ></a-input-search>
                    </div>
                    <div class="mr-3">
                        <a-tooltip placement="bottom">
                            <template #title> Refresh </template>
                            <AtlanBtn
                                class="px-2 bg-transparent border-gray-300"
                                size="sm"
                                color="secondary"
                                padding="compact"
                                @click="refetchList"
                                ><AtlanIcon icon="Refresh"></AtlanIcon
                            ></AtlanBtn>
                        </a-tooltip>
                    </div>

                    <TimeFrameSelector
                        v-model:modelValue="timeFrame"
                        :time-frame="timeFrame"
                        @change="handleRangePickerChange"
                    />
                </div>
            </template>

            <AccessLogsTable
                :access-logs-list="accessLogsList"
                :is-loading="isLoading || assetListLoading"
                :asset-meta-map="assetMetaMap"
            />

            <div
                v-if="pagination.total > 1 || isLoading"
                class="flex flex-row items-center justify-end w-full mt-4"
            >
                <Pagination
                    :totalPages="pagination.total"
                    :loading="isLoading"
                    :pageSize="size"
                    v-model:offset="from"
                    @mutate="refreshList"
                />
            </div>
        </DefaultLayout>

        <a-drawer
            :visible="accessLogsFilterDrawerVisible"
            :mask="false"
            :placement="'left'"
            :width="286"
            :closable="false"
        >
            <div class="relative">
                <AssetFilters
                    v-model="facets"
                    :filter-list="accessLogsFilter"
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
                    v-if="accessLogsFilterDrawerVisible"
                    class="fixed z-10 px-0 border-l-0 rounded-none rounded-r top-1/4 left-72"
                    color="secondary"
                    @click="accessLogsFilterDrawerVisible = false"
                >
                    <AtlanIcon
                        icon="ChevronDown"
                        class="h-4 px-1 transition-transform transform rotate-90"
                    />
                </AtlanBtn>
            </div>
        </a-drawer>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, Ref, ref, watch } from 'vue'
    import dayjs from 'dayjs'
    import { useDebounceFn } from '@vueuse/core'
    import map from '~/constant/accessControl/map'
    import DefaultLayout from '~/components/admin/layout.vue'
    import AtlanBtn from '@/UI/button.vue'
    import AccessLogsTable from '@/governance/accessLogs/accessLogsTable.vue'
    import TimeFrameSelector from '~/components/admin/common/timeFrameSelector.vue'
    import { useAccessLogs } from './composables/useAccessLogs'
    import AssetFilters from '@/common/assets/filters/index.vue'
    import { accessLogsFilter } from '~/constant/filters/logsFilter'
    import Connector from '~/components/insights/common/connector/connector.vue'
    import { useConnector } from '~/components/insights/common/composables/useConnector'
    import EmptyLogsIllustration from '~/assets/images/illustrations/empty_logs.svg'
    import Pagination from '@/common/list/pagination.vue'

    export default defineComponent({
        name: 'AccessLogsView',
        components: {
            Pagination,
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
            const accessLogsFilterDrawerVisible: Ref<boolean> = ref(false)
            const timeFrame = ref('30 days')
            const THIRTY_DAYS_IN_SECONDS = 30 * 24 * 60 * 60 * 1000
            const gte = ref(
                dayjs(new Date(Date.now() - THIRTY_DAYS_IN_SECONDS)).format(
                    'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]'
                )
            )
            const lt = ref(dayjs().format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]'))
            const timezone = ref(dayjs().format('Z'))
            const from = ref(0)
            const size = ref(20)

            const {
                getDatabaseName,
                getSchemaName,
                getConnectionQualifiedName,
            } = useConnector()
            const {
                list: accessLogsList,
                mutateBody,
                refetchList,
                isLoading,
                filteredLogsCount,
                assetMetaMap,
                assetListLoading,
            } = useAccessLogs(gte, lt, from, size)

            // since we always get filtered total count in response,
            //  storing the total count when we get the logs first time,
            //  i.e. when no filters are applied to find the total number of logs to
            //  decide if we want to render empty state or logs table.

            const totalLogsCount = ref(0)
            const stopWatcher = watch(filteredLogsCount, () => {
                totalLogsCount.value = filteredLogsCount.value
            })
            watch(totalLogsCount, stopWatcher)
            const pagination = computed(() => ({
                total: filteredLogsCount.value / size.value,
                pageSize: size.value,
                current: from.value / size.value + 1,
            }))
            const refreshList = () => {
                const usernames = facets.value?.users?.ownerUsers
                const connectorFacet = facets.value?.connector?.attributeName
                const facetValue = facets.value?.connector?.attributeValue
                const logStatusValues = facets.value?.logStatus?.status
                const logActionValues = facets.value?.logAction?.actions
                const userTypes = facets.value?.userType?.userTypes
                const properties = facets.value?.properties
                let schemaQualifiedName = ''
                let dbQualifiedName = ''
                let connectionQF = ''
                let connectorName = ''
                if (connectorFacet) {
                    if (connectorFacet === 'schemaQualifiedName') {
                        schemaQualifiedName = facetValue || ''
                    } else if (connectorFacet === 'databaseQualifiedName') {
                        dbQualifiedName = facetValue || ''
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
                    logStatusValues,
                    logActionValues,
                    userTypes,
                    properties,
                    dbQualifiedName,
                    schemaQualifiedName,
                    connectionQF,
                    connectorName,
                    searchText: searchText.value,
                    timezone,
                })
                refetchList()
            }
            const handleFilterChange = () => {
                from.value = 0
                refreshList()
            }

            /**
             * Return a dayjs object to manipulate dates.
             * @param stamp The string of the timestamp.
             */
            const getDateObject = (stamp: string) =>
                dayjs(stamp, 'YYYY-MM-DD[T]HH:mm:ssZ')

            const handleRangePickerChange = (e) => {
                gte.value = getDateObject(e[0]).format(
                    'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]'
                )
                lt.value = getDateObject(e[1]).format(
                    'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]'
                )
                handleFilterChange()
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
                from,
                size,
                accessLogsList,
                isLoading,
                handleSearch,
                handleRangePickerChange,
                timeFrame,
                searchText,
                accessLogsFilterDrawerVisible,
                map,
                accessLogsFilter,
                handleFilterChange,
                handleResetEvent,
                facets,
                pagination,
                filteredLogsCount,
                refreshList,
                assetMetaMap,
                totalLogsCount,
                EmptyLogsIllustration,
                assetListLoading,
                refetchList,
            }
        },
    })
</script>
