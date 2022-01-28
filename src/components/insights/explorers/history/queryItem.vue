<template>
    <div
        class="w-full px-4 pt-2 item-border hover:bg-gray-light"
        style="height: 70px !important"
    >
        <div
            class="relative flex content-center w-full h-8 my-auto overflow-hidden text-sm leading-5 text-gray-700"
        >
            <div class="w-10/12 py-2 parent-ellipsis-container">
                <AtlanIcon
                    icon="Query"
                    class="w-4 h-4 my-auto mr-1 parent-ellipsis-container-extension"
                    style="margin-bottom: 3px !important"
                    color="#5277D7"
                ></AtlanIcon>
                <span
                    class="mb-0 text-sm text-gray-700 parent-ellipsis-container-base"
                    >{{ queryTitle }}</span
                >
            </div>

            <div
                class="absolute right-0 flex items-center h-full text-gray-500 margin-align-top"
            >
                <div class="ml-24">
                    <a-tooltip color="#363636" placement="top">
                        <template #title>DOWNLOAD</template>
                        <AtlanIcon
                            icon="Download"
                            class="w-4 h-4 my-auto outline-none cursor-pointer"
                        ></AtlanIcon>
                    </a-tooltip>
                </div>
                <div class="pl-3">
                    <a-tooltip color="#363636" placement="top">
                        <template #title>Run Query</template>

                        <AtlanIcon
                            icon="Play"
                            class="w-4 h-4 my-auto outline-none cursor-pointer"
                        ></AtlanIcon>
                    </a-tooltip>
                </div>
            </div>
        </div>

        <div
            class="relative flex justify-between w-full text-xs text-gray-500 item-center"
            style="height: 18px !important"
        >
            <div class="flex item-center">
                <span
                    class="mb-0 ml-5 mr-1"
                    v-if="queryInfo._source && queryInfo._source['@timestamp']"
                    >{{
                        dayjs(queryInfo._source['@timestamp']).format('h:mm A')
                    }}</span
                >
                <div
                    v-if="
                        queryInfo._source &&
                        queryInfo._source.log.message.numberOfRows
                    "
                    class="w-1 h-1 mr-1 bg-gray-500 rounded-full"
                    style="margin-top: 5px !important"
                ></div>
                <span
                    class="mr-1"
                    v-if="
                        queryInfo._source &&
                        queryInfo._source.log.message.numberOfRows
                    "
                >
                    {{ `${queryInfo._source.log.message.numberOfRows} rows` }}
                </span>
                <div
                    v-if="
                        queryInfo._source &&
                        queryInfo._source.log.message.numberOfColumns
                    "
                    class="w-1 h-1 mr-1 bg-gray-500 rounded-full"
                    style="margin-top: 5px !important"
                ></div>

                <span
                    class="mr-1"
                    v-if="
                        queryInfo._source &&
                        queryInfo._source.log.message.numberOfColumns
                    "
                >
                    {{
                        queryInfo._source.log.message.numberOfColumns
                    }}&nbsp;cols
                </span>
            </div>
            <QueryStatus
                v-if="queryInfo._source"
                :status="queryInfo._source.log.message.queryStatus"
            />
        </div>
    </div>
</template>

<script>
    import { defineComponent, toRefs, computed } from 'vue'
    import AtlanIcon from '~/components/common/icon/atlanIcon.vue'
    import QueryStatus from './queryStatus.vue'
    import dayjs from 'dayjs'

    export default defineComponent({
        props: {
            queryInfo: {
                type: Object,
                required: true,
            },
            savedQueryMetaMap: {
                type: Object,
                required: true,
            },
        },
        components: { AtlanIcon, QueryStatus },
        setup(props) {
            const { queryInfo, savedQueryMetaMap } = toRefs(props)

            let isSavedQuery = computed(
                () =>
                    queryInfo.value &&
                    queryInfo.value._source &&
                    queryInfo.value._source.log &&
                    queryInfo.value._source.log.message &&
                    queryInfo.value._source.log.message.savedQueryId
            )

            let isSqlPresent = computed(
                () =>
                    queryInfo.value &&
                    queryInfo.value._source &&
                    queryInfo.value._source.log &&
                    queryInfo.value._source.log.message &&
                    queryInfo.value._source.log.message.userSqlQuery
            )

            let queryTitle = computed(() => {
                if (isSavedQuery.value) {
                    return savedQueryMetaMap.value[
                        queryInfo.value._source.log.message.savedQueryId
                    ] &&
                        savedQueryMetaMap.value[
                            queryInfo.value._source.log.message.savedQueryId
                        ].attributes &&
                        savedQueryMetaMap.value[
                            queryInfo.value._source.log.message.savedQueryId
                        ].attributes.name
                        ? savedQueryMetaMap.value[
                              queryInfo.value._source.log.message.savedQueryId
                          ].attributes.name
                        : queryInfo.value._source.log.message.savedQueryId
                } else if (isSqlPresent.value) {
                    return queryInfo.value._source.log.message.userSqlQuery
                }

                return '-'
            })

            return {
                isSavedQuery,
                isSqlPresent,
                queryTitle,
                dayjs,
            }
        },
    })
</script>

<style lang="less" scoped>
    .item-border {
        border-bottom: 1px solid #f3f3f3;
    }

    .parent-ellipsis-container {
        display: flex;
        align-items: center;
        min-width: 0;
    }
    .parent-ellipsis-container-base {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
    .parent-ellipsis-container-extension {
        flex-shrink: 0;
    }
</style>
