<template>
    <div>
        <div
            class="
                flex
                justify-between
                px-5
                py-2.5
                border-b
                mb-6
                border-gray-light
            "
        >
            <span class="text-lg font-bold text-gray-700">Activity</span>
            <fa
                icon="fa sync"
                class="text-lg cursor-pointer text-primary"
                @click="refreshAudits"
            ></fa>
        </div>
        <div
            v-if="isLoading"
            class="flex items-center justify-center text-sm leading-none"
        >
            <a-spin size="small" class="mr-2 leading-none"></a-spin
            ><span>Getting activity logs</span>
        </div>
        <div v-else-if="audits.length && !isLoading">
            <a-timeline class="mx-4">
                <a-timeline-item v-for="(log, index) in audits" :key="index">
                    <template #dot>
                        <div
                            class="border ant-timeline-item-dot border-primary"
                        ></div>
                    </template>
                    <div>
                        <div v-if="getDetailsForEntityAuditEvent(log)">
                            <activity-type
                                :data="getDetailsForEntityAuditEvent(log)"
                            />
                        </div>
                        <div v-else>
                            {{ getEventByAction(log).label || 'Event' }}
                        </div>
                    </div>
                    <div class="flex items-center leading-5 text-gray-500">
                        <div class="capitalize">
                            {{ getActionUser(log.user) }}
                        </div>
                        <div class="mx-3 name-time-separator"></div>
                        <div>{{ timeAgo(log.timestamp) }}</div>
                    </div>
                </a-timeline-item>
            </a-timeline>
            <div
                v-if="!checkAuditsCount && !isAllLogsFetched"
                class="flex justify-center mb-8 text-center"
            >
                <a-button
                    :disabled="isFetchingMore"
                    class="flex items-center justify-between py-2 transition-all duration-300 border-none rounded-full  bg-primary-light text-primary"
                    @click="fetchMore"
                    :class="isFetchingMore ? 'px-2 w-9' : 'px-5 w-32'"
                >
                    <template v-if="!isFetchingMore"
                        ><p
                            class="m-0 mr-1 overflow-hidden text-sm transition-all duration-300  overflow-ellipsis whitespace-nowrap"
                        >
                            Load more
                        </p>
                        <AtlanIcon icon="ArrowDown"
                    /></template>
                    <svg
                        v-else
                        class="w-5 h-5 text-primary animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            class="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            stroke-width="4"
                        ></circle>
                        <path
                            class="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                </a-button>
            </div>
        </div>
        <div v-else class="flex flex-col items-center">
            <img :src="emptyScreen" alt="No logs" class="w-2/5 m-auto mb-4" />
            <span class="text-gray-500">No logs found</span>
        </div>
    </div>
</template>

<script lang="ts">
    import {
        watch,
        reactive,
        computed,
        defineComponent,
        PropType,
        toRefs,
    } from 'vue'

    import { useTimeAgo } from '@vueuse/core'
    import useAssetAudit from '~/composables/asset/useAssetAudit'
    import emptyScreen from '~/assets/images/empty_search.png'
    import { assetInterface } from '~/types/assets/asset.interface'
    import ActivityType from './activityType.vue'

    export default defineComponent({
        components: { ActivityType },
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },

        setup(props) {
            const { selectedAsset: item } = toRefs(props)
            const params = reactive({ count: 10 })
            const fetchMoreAuditParams = reactive({ count: 10, startKey: '' })

            const {
                audits,
                error,
                fetchAudits,
                isLoading,
                getEventByAction,
                getDetailsForEntityAuditEvent,
                getActionUser,
                fetchMoreAudits,
                isFetchingMore,
                isAllLogsFetched,
            } = useAssetAudit(params, item.value.guid)

            function timeAgo(time: number) {
                return useTimeAgo(time).value
            }

            const refreshAudits = () => {
                fetchMoreAuditParams.startKey = ''
                fetchAudits(params, item.value.guid)
            }

            const fetchMore = () => {
                fetchMoreAuditParams.startKey = audits?.value[
                    audits.value?.length - 1
                ].eventKey as string
                fetchMoreAudits(fetchMoreAuditParams)
            }

            watch(
                () => item.value.guid,
                (newValue) => {
                    fetchMoreAuditParams.startKey = ''
                    fetchAudits(params, newValue)
                }
            )

            const checkAuditsCount = computed(
                () => audits.value?.length < params.count
            )

            return {
                audits,
                error,
                isLoading,
                timeAgo,
                getDetailsForEntityAuditEvent,
                getEventByAction,
                getActionUser,
                refreshAudits,
                fetchMore,
                isFetchingMore,
                isAllLogsFetched,
                checkAuditsCount,
                emptyScreen,
            }
        },
    })
</script>

<style lang="less" scoped>
    .ant-timeline-item {
        margin-bottom: 0 !important;
        padding-bottom: 40px !important;
    }
    .ant-timeline-item-dot {
        width: 13px;
        height: 13px;
        border-radius: 50%;
    }

    .name-time-separator {
        height: 5px;
        width: 5px;
        background-color: #c4c4c4;
        border-radius: 50%;
    }

    :global(.ant-timeline-item-content) {
        margin-left: 22px;
    }
    :global(.ant-timeline-item-head-custom) {
        padding: 0 !important;
    }
</style>
