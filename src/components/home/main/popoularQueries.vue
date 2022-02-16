<template>
    <!--h2 class="mb-3 text-xl font-bold">Relevant for you</h2-->
    <transition v-if="showWidget" name="fade">
        <div>
            <div class="flex mb-1">
                <span class="mb-1 text-sm font-semibold text-gray-500">
                    <!-- <AtlanIcon icon="TrendUp"></AtlanIcon> -->
                    Popular Queries
                </span>
                <TimeFrameSelector
                    v-model:modelValue="timeFrame"
                    class="ml-auto"
                    :time-frame="timeFrame"
                    :timeFrameWhiteList="timeFrameWhiteList"
                    :showCustomTime="false"
                    :minimal="true"
                    @change="handleRangePickerChange"
                />
            </div>

            <!-- <div
                v-if="isQueryLogsLoading"
                class="flex items-center justify-center border border-gray-200 rounded"
                style="min-height: 150px"
            >
                <AtlanLoader class="w-full h-10" />
            </div> -->
            <div
                class="flex flex-col p-4 overflow-y-auto border border-gray-200 rounded resources-container gap-y-4"
                style="min-height: 150px"
            >
                <div
                    v-for="queryObj in popularQueriesList"
                    :key="queryObj.key"
                    class="pb-4 border-b"
                >
                    <div>
                        <AssetTitleCtx
                            :item="queryObj.asset"
                            :show-description="true"
                        >
                            <template #title-right>
                                <div class="ml-auto">
                                    <AtlanIcon
                                        icon="TrendUp"
                                        class="mr-1"
                                    ></AtlanIcon>
                                    <span class="text-gray-500">
                                        {{ queryObj.doc_count }} runs
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

    export default defineComponent({
        name: 'PopularQueries',
        components: {
            CertificateBadge,
            AssetPopover,
            AssetTitleCtx,
            TimeFrameSelector,
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
            ]
            const timeFrameWhiteList = [7, 30]
            const showWidget = ref(false)

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
                // eslint-disable-next-line prefer-destructuring
                gte.value = event[0]
                // eslint-disable-next-line prefer-destructuring
                lt.value = event[1]
                refreshList()
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
