<template>
    <div>
        <div
            class="flex justify-between px-4 py-2 mb-6 border-b  border-gray-light"
        >
            <span class="font-semibold text-gray-700 text-md">Activity</span>

            <AtlanIcon
                icon="Reload"
                class="mt-1 cursor-pointer text-primary"
                @click="refreshAudits"
            />
        </div>
        <div
            v-if="isLoading"
            class="flex items-center justify-center text-sm leading-none"
        >
            <AtlanIcon
                icon="Loader"
                class="w-auto h-5 animate-spin"
            ></AtlanIcon>
            <span class="ml-1">Getting activity logs</span>
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
                        <template
                            v-if="getDetailsForEntityAuditEvent(log)?.component"
                        >
                            <ActivityType
                                :data="getDetailsForEntityAuditEvent(log)"
                            />
                        </template>
                        <template v-else>
                            {{ getEventByAction(log)?.label || 'Event' }}
                        </template>
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
                    :class="isFetchingMore ? 'px-2 w-9' : 'px-5 w-32'"
                    @click="fetchMore"
                >
                    <template v-if="!isFetchingMore"
                        ><p
                            class="m-0 mr-1 overflow-hidden text-sm transition-all duration-300  overflow-ellipsis whitespace-nowrap"
                        >
                            Load more
                        </p>
                        <AtlanIcon icon="ArrowDown"
                    /></template>
                    <AtlanIcon
                        v-else
                        icon="Loader"
                        class="w-5 w-auto h-5 animate-spin"
                    ></AtlanIcon>
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
    import useAssetAudit from '~/composables/discovery/useAssetAudit'
    import emptyScreen from '~/assets/images/empty_search.png'
    import { assetInterface } from '~/types/assets/asset.interface'
    import ActivityType from './activityType.vue'

    export default defineComponent({
        name: 'ActivityTab',
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
