<template>
    <!--h2 class="mb-3 text-xl font-bold">Relevant for you</h2-->
    <transition v-if="list.length" name="fade">
        <div>
            <h2 class="mb-3 text-sm font-semibold text-gray-500">
                <AtlanIcon icon="InformationAnnouncement"></AtlanIcon> Popular
                Queries
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
                    v-for="queryObj in queryAggregationResult
                        ?.group_by_savedQueryId?.buckets"
                    :key="queryObj.key"
                    class="mb-3"
                >
                    {{ queryObj.key }}
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
            const dependentKey = ref('HOME_RECENTS_ANNOUNCEMENTS')
            const limit = ref(15)
            const offset = ref(0)
            const queryText = ref('')

            const facets = ref([
                {
                    announcementTitle: [
                        {
                            operator: 'isNotNull',
                            operand: 'announcementTitle',
                        },
                    ],
                },
            ])

            const postFacets = ref({})
            const aggregations = ref(['typeName'])
            const preference = ref({
                sort: 'announcementUpdatedAt-desc',
                display: [],
            })
            const defaultAttributes = ref([
                'name',
                'displayName',
                'announcementMessage',
                'announcementTitle',
                'announcementType',
                'announcementUpdatedAt',
                'announcementUpdatedBy',
                'certificateStatus',
                'certificateUpdatedBy',
                'certificateStatusMessage',
            ])

            const {
                list,
                isLoading,
                assetTypeAggregationList,
                isLoadMore,
                isValidating,
                fetch,
                error,
                quickChange,
                updateList,
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
                suppressLogs: true,
            })

            const {
                title,
                certificateStatus,
                certificateUpdatedAt,
                certificateUpdatedBy,
                certificateStatusMessage,
                getProfilePath,
            } = useAssetInfo()

            const gte = ref(
                dayjs(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).format()
            )
            const lt = ref(dayjs().format())
            const from = ref(0)
            const size = ref(20)
            const queryAggregations = ['savedQueryId']

            const {
                aggregates: queryAggregationResult,
                // mutateBody,
                // refetchList,
                isLoading: isQueryLogsLoading,
                // filteredLogsCount,
                // savedQueryMetaMap,
            } = useQueryLogs(gte, lt, from, size, null, null, queryAggregations)

            return {
                isLoading,
                list,
                title,
                certificateStatus,
                certificateUpdatedAt,
                certificateUpdatedBy,
                certificateStatusMessage,
                getProfilePath,
                queryAggregationResult,
                isQueryLogsLoading,
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
