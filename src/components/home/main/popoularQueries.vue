<template>
    <!--h2 class="mb-3 text-xl font-bold">Relevant for you</h2-->
    <transition v-if="showWidget" name="fade">
        <div>
            <AssetDrawer
                :guid="selectedAssetDrawerGuid"
                :show-drawer="showAssetSidebarDrawer"
                @closeDrawer="handleCloseDrawer"
            />
            <div
                class="flex flex-col border border-gray-200 rounded resources-container"
            >
                <div
                    class="flex items-baseline py-1 pl-6 pr-5 mb-1 bg-gray-100 border-b"
                >
                    <span class="text-sm font-semibold text-gray-500">
                        <!-- <AtlanIcon icon="TrendUp"></AtlanIcon> -->
                        Popular Queries
                    </span>
                    <TimeFrameSelector
                        v-model:modelValue="timeFrame"
                        class="ml-auto text-gray-400"
                        :time-frame="timeFrame"
                        :timeFrameWhiteList="timeFrameWhiteList"
                        :showCustomTime="false"
                        :minimal="true"
                        customClass="bg-gray-100 text-gray-500"
                        @change="handleRangePickerChange"
                    />
                </div>
                <div
                    class="px-4 pb-4 overflow-x-hidden overflow-y-auto"
                    v-show="popularQueriesList.length > 0"
                >
                    <div
                        class="border-b"
                        v-for="queryObj in popularQueriesList"
                    >
                        <div
                            :key="queryObj.key"
                            class="px-2 py-4 rounded cursor-pointer hover:bg-primary-menu"
                            @click="
                                () => {
                                    handleCardClicked(queryObj.asset)
                                }
                            "
                        >
                            <div>
                                <AssetTitleCtx
                                    :item="queryObj.asset"
                                    :show-description="true"
                                    class="asset-title-ctx"
                                >
                                    <template #title-right>
                                        <div class="ml-auto">
                                            <AtlanIcon
                                                icon="TrendUp"
                                                class="mr-1"
                                            ></AtlanIcon>
                                            <span class="text-gray-500">
                                                {{ queryObj.doc_count }}
                                                {{
                                                    queryObj.doc_count === 1
                                                        ? 'run'
                                                        : 'runs'
                                                }}
                                            </span>
                                        </div>
                                    </template>
                                </AssetTitleCtx>
                                <!-- <div class="mt-2">
                                    <span class="text-gray-500">
                                        {{ queryObj.doc_count }} runs
                                    </span>
                                </div> -->
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    v-if="
                        popularQueriesList.length === 0 && !isQueryLogsLoading
                    "
                >
                    <div
                        class="flex flex-col items-center justify-center h-full"
                    >
                        <div class="flex flex-col items-center py-8">
                            <AtlanIcon
                                icon="NoRelevantAsset"
                                class="w-auto mb-4"
                                style="height: 150px"
                            />
                            <span class="text-gray-500">{{ emptyText }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script lang="ts">
    import {
        defineComponent,
        ref,
        toRefs,
        computed,
        defineAsyncComponent,
        watch,
    } from 'vue'
    import dayjs from 'dayjs'
    import { useDiscoverList } from '~/composables/discovery/useDiscoverList'
    import { useQueryLogs } from '~/components/governance/queryLogs/composables/useQueryLogs.ts'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import CertificateBadge from '@/common/badge/certificate/index.vue'
    import AssetPopover from '@/common/popover/assets/index.vue'
    import AssetTitleCtx from '@/home/shared/assetTitleContext.vue'
    import TimeFrameSelector from '~/components/admin/common/timeFrameSelector.vue'
    import AssetDrawer from '@/common/assets/preview/drawer.vue'

    export default defineComponent({
        name: 'PopularQueries',
        components: {
            CertificateBadge,
            AssetPopover,
            AssetTitleCtx,
            TimeFrameSelector,
            AssetDrawer,
        },
        setup() {
            // FETCH QUERY LOGS
            const timeFrame = ref('30 days')
            const gte = ref(
                dayjs(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).format()
            )
            const lt = ref(dayjs().format())
            const from = ref(0)
            const size = ref(20)
            const queryAggregations = ['savedQueryId']
            const queryAttributes = [
                'name',
                'displayName',
                'description',
                'userDescription',
                'certificateStatus',
                'certificateUpdatedBy',
                'certificateStatusMessage',
                'connectorName',
                'connectionName',
                'connectionQualifiedName',
            ]
            const timeFrameWhiteList = [7, 30]
            const showWidget = ref(false)
            const showAssetSidebarDrawer = ref(false)
            const selectedAssetDrawerGuid = ref('')
            const emptyText = computed(() => {
                return `No popular queries for ${timeFrame.value}`
            })

            const {
                aggregates: queryAggregationResult,
                mutateBody,
                refetchList,
                isLoading: isQueryLogsLoading,
                // filteredLogsCount,
                savedQueryMetaMap,
            } = useQueryLogs(
                gte,
                lt,
                from,
                size,
                null,
                queryAttributes,
                queryAggregations
            )

            const popularQueriesList = computed(() => {
                const aggrs =
                    queryAggregationResult?.value?.group_by_savedQueryId
                        ?.buckets
                const enrichedArray = aggrs
                    ?.map((aggr) => {
                        const { key, doc_count: docCount } = aggr
                        const asset = savedQueryMetaMap?.value[key] || {}
                        return {
                            key,
                            doc_count: docCount,
                            asset,
                        }
                    })
                    .filter((item) => item.asset?.status === 'ACTIVE')
                return enrichedArray || []
            })

            const {
                title,
                certificateStatus,
                certificateUpdatedAt,
                certificateUpdatedBy,
                certificateStatusMessage,
                getProfilePath,
            } = useAssetInfo()

            const refreshList = () => {
                mutateBody({
                    from,
                    size,
                    gte,
                    lt,
                    aggregations: queryAggregations,
                })
                refetchList()
            }

            const handleRangePickerChange = (event) => {
                console.log('handleRangePickerChange event', event)
                // eslint-disable-next-line prefer-destructuring
                gte.value = event[0]
                // eslint-disable-next-line prefer-destructuring
                lt.value = event[1]
                refreshList()
            }
            const handleCardClicked = (item: any) => {
                console.log('handleCardClicked', item.guid)
                showAssetSidebarDrawer.value = true
                selectedAssetDrawerGuid.value = item?.guid
            }
            const handleCloseDrawer = () => {
                selectedAssetDrawerGuid.value = ''
                showAssetSidebarDrawer.value = false
            }

            watch(popularQueriesList, (newVal) => {
                if (newVal.length) {
                    showWidget.value = true
                }
            })

            return {
                title,
                certificateStatus,
                certificateUpdatedAt,
                certificateUpdatedBy,
                certificateStatusMessage,
                getProfilePath,
                queryAggregationResult,
                isQueryLogsLoading,
                savedQueryMetaMap,
                popularQueriesList,
                handleRangePickerChange,
                timeFrame,
                timeFrameWhiteList,
                showWidget,
                handleCardClicked,
                handleCloseDrawer,
                selectedAssetDrawerGuid,
                showAssetSidebarDrawer,
                emptyText,
            }
        },
    })
</script>

<style lang="less" scoped>
    .resources-container {
        height: 390px;
    }
    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.5s ease;
    }

    .fade-enter-from,
    .fade-leave-to {
        opacity: 0;
    }
</style>
