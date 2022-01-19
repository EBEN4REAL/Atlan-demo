<template>
    <div class="flex flex-col h-full overflow-y-hidden">
        <div class="flex justify-between px-5 pt-4 pb-4">
            <span class="font-semibold text-gray-500">Activity</span>

            <AtlanIcon
                icon="Reload"
                class="w-auto h-4 mt-1 cursor-pointer text-primary"
                @click="refreshAudits"
            />
        </div>
        <div
            v-if="auditList.length === 0 && isLoading"
            class="flex items-center justify-center text-sm leading-none"
        >
            <AtlanLoader class="h-5" />
            <span class="ml-1">Getting activity logs</span>
        </div>

        <div
            v-else-if="auditList.length > 0"
            class="flex-grow pt-3 overflow-y-auto"
        >
            <a-timeline class="mx-5" :key="item.guid">
                <a-timeline-item v-for="(log, index) in auditList" :key="index">
                    <template #dot>
                        <div
                            class="border ant-timeline-item-dot border-primary"
                        ></div>
                    </template>
                    <div>
                        <ActivityType
                            :data="getAuditEventComponent(log)"
                            v-if="getAuditEventComponent(log)"
                        />
                        <template v-else>
                            <div class="">
                                {{ log.action }}
                            </div>
                        </template>

                        <!-- <template
                            v-if="getDetailsForEntityAuditEvent(log)?.component"
                        >
                            <ActivityType
                                :data="getDetailsForEntityAuditEvent(log)"
                            />
                        </template>-->
                    </div>
                    <div
                        v-if="
                            log.entityId !== item.guid &&
                            ['Table', 'View'].includes(item.typeName)
                        "
                        class="flex items-center mt-1 text-gray-700"
                    >
                        {{ getColumnName(log) }} (<span
                            class="tracking-wide text-gray-500 uppercase"
                            >Column</span
                        >)
                    </div>
                    <div class="flex items-center mt-1 text-gray-500">
                        <div class="flex items-center">
                            <AtlanIcon icon="User" class="mr-1"></AtlanIcon>
                            {{ getActionUser(log.user) }}
                        </div>
                        <div class="mx-3 timeline-name-time-separator"></div>
                        <div>{{ timeAgo(log.created) }}</div>
                    </div>
                </a-timeline-item>
            </a-timeline>

            <!-- <a-timeline class="mx-5">
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
                            <div class="mb-3">
                                {{ getEventByAction(log)?.label || 'Event' }}
                            </div>
                        </template>
                    </div>
                    <div class="flex items-center leading-5 text-gray-500">
                        <div class="capitalize">
                            {{ getActionUser(log.user) }}
                        </div>
                        <div class="mx-3 timeline-name-time-separator"></div>
                        <div>{{ timeAgo(log.timestamp) }}</div>
                    </div>
                </a-timeline-item>
            </a-timeline> -->
            <div class="flex justify-center mb-8 text-center">
                <a-button
                    class="flex items-center justify-between py-2 transition-all duration-300 border-none rounded-full bg-primary-light text-primary"
                    @click="handleLoadMore"
                >
                    <template v-if="isLoadMore && !isLoading">
                        <p
                            class="m-0 mr-1 overflow-hidden text-sm transition-all duration-300 overflow-ellipsis whitespace-nowrap"
                        >
                            Load more
                        </p>
                        <AtlanIcon icon="ArrowDown"
                    /></template>

                    <AtlanLoader v-else-if="isLoading" class="h-5" />
                </a-button>
            </div>
        </div>
        <div v-else class="flex flex-col items-center">
            <EmptyScreen
                empty-screen="NoAssetsFound"
                image-class="h-44"
                desc="No logs found"
                descClass="text-center text-sm"
            />
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
        ref,
    } from 'vue'

    import { useTimeAgo } from '@vueuse/core'
    import useAssetAudit from '~/composables/discovery/useAssetAudit'
    import EmptyScreen from '@/common/empty/index.vue'
    import emptyScreen from '~/assets/images/empty_search.png'
    import { assetInterface } from '~/types/assets/asset.interface'
    import ActivityType from './activityType.vue'
    import { useAssetAuditSearch } from '~/composables/discovery/useAssetAuditSearch'
    import AtlanIcon from '~/components/common/icon/atlanIcon.vue'

    export default defineComponent({
        name: 'ActivityTab',
        components: { ActivityType, EmptyScreen, AtlanIcon },
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },

        setup(props) {
            const { selectedAsset: item } = toRefs(props)
            const params = reactive({ count: 10 })

            const limit = ref(10)
            const offset = ref(0)
            const fetchMoreAuditParams = reactive({ count: 10, startKey: '' })
            const dependentKey = ref('audit')

            const facets = ref()

            if (['Table', 'View'].includes(item.value.typeName)) {
                facets.value = {
                    entityQualifiedName: item.value.attributes.qualifiedName,
                }
            } else {
                facets.value = {
                    entityId: item.value.guid,
                }
            }

            const preference = ref({
                sort: 'created-desc',
            })

            const getColumnName = (log) => {
                if (log.entityQualifiedName) {
                    const splitArray = log.entityQualifiedName.split('/')
                    return splitArray[splitArray.length - 1]
                }
                return ''
            }

            const {
                data,
                list: auditList,
                refresh,
                error,
                fetch,
                isLoading,
                isLoadMore,
                totalCount,
                quickChange,
            } = useAssetAuditSearch({
                guid: item.value.guid,
                isCache: false,
                dependentKey,
                queryText: '',
                limit,
                offset,
                facets,
                preference,
            })

            const { getAuditEventComponent, getActionUser } = useAssetAudit(
                params,
                item.value.guid
            )

            function timeAgo(time: number) {
                return useTimeAgo(time).value
            }

            const refreshAudits = () => {
                refresh()
            }

            const handleLoadMore = () => {
                console.log('load more')
                if (isLoadMore.value) {
                    offset.value += limit.value
                }
                console.log('load more')
                quickChange()
            }

            const fetchMore = () => {
                fetchMoreAuditParams.startKey = audits?.value[
                    audits.value?.length - 1
                ].eventKey as string
                fetchMoreAudits(fetchMoreAuditParams)
            }

            // watch(
            //     () => item.value.guid,
            //     (newValue) => {
            //         fetchMoreAuditParams.startKey = ''

            //         facets.value = {
            //             entityId: item.value.guid,
            //         }

            //         fetchAudits(params, newValue)
            //     }
            // )

            const checkAuditsCount = computed(
                () => audits.value?.length < params.count
            )

            return {
                error,
                isLoading,
                timeAgo,
                item,
                refreshAudits,
                fetchMore,
                getActionUser,
                emptyScreen,
                limit,
                offset,
                preference,
                facets,
                auditList,
                getAuditEventComponent,
                refresh,
                handleLoadMore,
                isLoadMore,
                totalCount,
                quickChange,
                getColumnName,
            }
        },
    })
</script>
