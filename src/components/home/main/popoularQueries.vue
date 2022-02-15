<template>
    <!--h2 class="mb-3 text-xl font-bold">Relevant for you</h2-->
    <transition v-if="popularQueriesList.length" name="fade">
        <div>
            <h2 class="mb-3 text-sm font-semibold text-gray-500">
                <AtlanIcon icon="TrendUp"></AtlanIcon> Popular Queries
            </h2>

            <div
                v-if="isQueryLogsLoading"
                class="flex items-center justify-center border border-gray-200 rounded"
                style="min-height: 150px"
            >
                <AtlanLoader class="w-full h-10" />
            </div>
            <div
                v-else
                class="overflow-y-auto border border-gray-200 rounded resources-container"
                style="min-height: 150px"
            >
                <div
                    v-for="queryObj in popularQueriesList"
                    :key="queryObj.key"
                    class="mb-3"
                >
                    <div>
                        {{
                            title(queryObj.asset) || `No title: ${queryObj.key}`
                        }}
                        <span class="font-bold">
                            {{ queryObj.doc_count }}
                        </span>
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

    export default defineComponent({
        name: 'PopularQueries',
        components: {
            CertificateBadge,
            AssetPopover,
            AssetTitleCtx,
        },
        setup() {
            // FETCH QUERY LOGS
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
                'certificateStatus',
                'certificateUpdatedBy',
                'certificateStatusMessage',
                '__STATE',
            ]

            const {
                aggregates: queryAggregationResult,
                // mutateBody,
                // refetchList,
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
