<template>
    <div>
        <a-table
            class="overflow-hidden border rounded-lg query-access-logs-table"
            :scroll="{ y: 'calc(100vh - 20rem)' }"
            :style="{ cursor: 'pointer' }"
            :table-layout="'fixed'"
            :pagination="false"
            :data-source="queryLogsList"
            :columns="columns"
            :row-key="(query) => query._id"
            :loading="isLoading"
            :custom-row="customRow"
            @change="handleTableChange"
        >
            <template #queryInfo="{ text: queryInfo }">
                <div class="flex items-center h-full py-1">
                    <div
                        v-if="
                            queryInfo &&
                            queryInfo._source &&
                            queryInfo._source.log &&
                            queryInfo._source.log.message &&
                            queryInfo._source.log.message.savedQueryId
                        "
                        class="flex items-center justify-center"
                    >
                        <div class="items-center">
                            <div class="parent-ellipsis-container">
                                <div
                                    class="w-2 h-2 mr-3 rounded-full parent-ellipsis-container-extension"
                                    :class="
                                        getQueryStatusClass(
                                            queryInfo._source.log.message
                                                .queryStatus
                                        )
                                    "
                                ></div>
                                <span
                                    class="text-sm text-gray-700 parent-ellipsis-container-base"
                                >
                                    <!-- Just checking if savedQueryID is present in locally stored savedQueryMetaMap, if it is, using name from that, otherwise using savedQueryId; Sorry for such verbose code!!-->
                                    {{
                                        savedQueryMetaMap[
                                            queryInfo._source.log.message
                                                .savedQueryId
                                        ] &&
                                        savedQueryMetaMap[
                                            queryInfo._source.log.message
                                                .savedQueryId
                                        ].attributes &&
                                        savedQueryMetaMap[
                                            queryInfo._source.log.message
                                                .savedQueryId
                                        ].attributes.name
                                            ? savedQueryMetaMap[
                                                  queryInfo._source.log.message
                                                      .savedQueryId
                                              ].attributes.name
                                            : queryInfo._source.log.message
                                                  .savedQueryId
                                    }}
                                </span>
                            </div>
                            <div class="flex items-center mt-1 ml-4">
                                <img
                                    :src="
                                        getConnectorImagePath(
                                            getConnectorName(
                                                queryInfo._source.log.message
                                                    .connectionQualifiedName
                                            )
                                        )
                                    "
                                    class="w-4 h-4 mr-1 -mt-0.5"
                                />
                                <span class="text-xs text-gray-500">{{
                                    getConnectionName(
                                        queryInfo._source.log.message
                                            .connectionQualifiedName
                                    )
                                }}</span>
                                <span class="ml-1 text-gray-500"
                                    ><span class="text-gray-300">•&nbsp;</span
                                    >Query</span
                                >
                            </div>
                        </div>
                    </div>

                    <div
                        v-else-if="
                            queryInfo &&
                            queryInfo._source &&
                            queryInfo._source.log &&
                            queryInfo._source.log.message &&
                            queryInfo._source.log.message.userSqlQuery
                        "
                        class="overflow-hidden"
                    >
                        <div class="items-center">
                            <div class="parent-ellipsis-container">
                                <div
                                    class="w-2 h-2 mr-3 rounded-full parent-ellipsis-container-extension"
                                    :class="
                                        getQueryStatusClass(
                                            queryInfo._source.log.message
                                                .queryStatus
                                        )
                                    "
                                ></div>
                                <span
                                    class="text-sm text-gray-700 parent-ellipsis-container-base"
                                    >{{
                                        queryInfo._source.log.message
                                            .userSqlQuery
                                    }}</span
                                >
                            </div>
                            <div class="flex items-center mt-1.5 ml-4">
                                <img
                                    :src="
                                        getConnectorImagePath(
                                            getConnectorName(
                                                queryInfo._source.log.message
                                                    .connectionQualifiedName
                                            )
                                        )
                                    "
                                    class="w-4 h-4 mr-1 -mt-0.5"
                                />
                                <span class="text-xs text-gray-500">{{
                                    getConnectionName(
                                        queryInfo._source.log.message
                                            .connectionQualifiedName
                                    )
                                }}</span>
                            </div>
                        </div>
                    </div>
                    <div v-else>-</div>
                </div>
            </template>
            <template #details="{ text: queryInfo }">
                <div class="flex items-center h-full">
                    <div
                        v-if="
                            queryInfo &&
                            queryInfo._source &&
                            queryInfo._source.log &&
                            queryInfo._source.log.message &&
                            queryInfo._source.log.message.totalTime
                        "
                        class="flex items-center"
                    >
                        <AtlanIcon
                            icon="Schedule"
                            class="w-4 h-4 mr-1 -mt-0.5"
                        />

                        <span class="text-sm text-gray-700">
                            {{
                                queryInfo._source.log.message.totalTime < 1000
                                    ? `${queryInfo._source.log.message.totalTime}ms`
                                    : queryInfo._source.log.message.totalTime /
                                          1000 >
                                      60
                                    ? `${Math.floor(
                                          queryInfo._source.log.message
                                              .totalTime /
                                              (1000 * 60)
                                      )}m ${
                                          queryInfo._source.log.message
                                              .totalTime %
                                          (1000 * 60)
                                      }s`
                                    : `${
                                          queryInfo._source.log.message
                                              .totalTime / 1000
                                      }s`
                            }}
                        </span>
                        <div
                            class="w-1 h-1 mx-2 bg-gray-300 rounded-full"
                        ></div>
                    </div>
                    <div v-else class="flex items-center">
                        <AtlanIcon
                            icon="Schedule"
                            class="w-4 h-4 mr-1 -mt-0.5"
                        />
                        <span class="">-</span>
                        <div
                            class="w-1 h-1 mx-2 bg-gray-300 rounded-full"
                        ></div>
                    </div>
                    <div class="flex items-center">
                        <div class="mr-2">
                            <span
                                v-if="
                                    queryInfo._source.log.message.numberOfRows
                                "
                                class="text-sm text-gray-700"
                                >{{
                                    queryInfo._source.log.message.numberOfRows
                                }}&nbsp;rows</span
                            >
                            <span v-else>-&nbsp;</span>
                        </div>
                        <div>
                            <span
                                v-if="
                                    queryInfo._source.log.message
                                        .numberOfColumns
                                "
                                class="text-sm text-gray-700"
                                >{{
                                    queryInfo._source.log.message
                                        .numberOfColumns
                                }}&nbsp;cols</span
                            >
                            <span v-else>-&nbsp;</span>
                        </div>
                    </div>
                </div>
            </template>
            <template #user="{ text: user }">
                <div
                    v-if="user._source.log.message.authenticatorResult.userName"
                    class="flex items-center h-full"
                    @click="$emit('selectQuery', user)"
                >
                    <Avatar
                        :image-url="
                            imageUrl(
                                user._source.log.message.authenticatorResult
                                    .userName
                            )
                        "
                        :allow-upload="false"
                        :avatar-name="
                            user._source.log.message.authenticatorResult
                                .userName
                        "
                        :avatar-size="16"
                        :avatar-shape="'circle'"
                        class="mr-1 mt-0.5"
                    />

                    <span
                        class="text-sm cursor-pointer text-primary"
                        @click="
                            () =>
                                handleUserPreview(
                                    user._source.log.message.authenticatorResult
                                        .userName
                                )
                        "
                        >{{
                            user._source.log.message.authenticatorResult
                                .userName
                        }}</span
                    >
                </div>
                <div v-else>-</div>
            </template>
            <template #timestamp="{ text: timestamp }">
                <div
                    class="flex items-center h-full"
                    @click="$emit('selectQuery', timestamp)"
                >
                    <div class="flex items-center">
                        <div
                            v-if="timestamp._source['@timestamp']"
                            class="flex items-center mr-5"
                        >
                            <span class="text-sm text-gray-700">
                                {{
                                    dayjs(
                                        timestamp._source['@timestamp']
                                    ).format('DD/MM/YYYY')
                                }}
                            </span>
                            <span class="ml-4 text-gray-500">
                                {{
                                    dayjs(
                                        timestamp._source['@timestamp']
                                    ).format('HH:mm')
                                }}
                            </span>
                        </div>
                        <div v-else>-</div>
                    </div>
                    <AtlanIcon
                        icon="ArrowRight"
                        class="w-4 h-4 ml-10 text-gray-500"
                    />
                </div>
            </template>
        </a-table>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, Ref, watch, toRefs } from 'vue'
    import dayjs from 'dayjs'
    import { useUserPreview } from '~/composables/user/showUserPreview'
    import Avatar from '~/components/common/avatar/index.vue'
    import AtlanBtn from '@/UI/button.vue'
    import PillGroup from '@/UI/pill/pillGroup.vue'
    import { SourceList } from '~/constant/source'
    import { useConnector } from '~/components/insights/common/composables/useConnector'

    export default defineComponent({
        name: 'QueryLogsTable',
        components: { Avatar, AtlanBtn, PillGroup },
        props: {
            queryLogsList: {
                type: Array,
                default: () => [],
            },
            isLoading: {
                type: Boolean,
                default: false,
            },
            selectedQuery: {
                type: Object,
                default: () => {},
            },
            selectedRowKeys: {
                type: Object,
                default: () => [],
            },
            savedQueryMetaMap: {
                type: Object,
                default: () => {},
            },
        },
        emits: ['selectQuery', 'toggleQueryPreviewDrawer', 'selectQuery'],
        setup(props, { emit }) {
            const { getConnectionName, getConnectorName } = useConnector()
            const getConnectorImagePath = (connector) => {
                let connectorObj = {}
                if (connector) {
                    connectorObj = SourceList.find(
                        (source) =>
                            source.id.toLowerCase() === connector.toLowerCase()
                    )
                    return connectorObj?.image || ''
                }
                return ''
            }
            const { selectedQuery, selectedRowKeys } = toRefs(props)
            const imageUrl = (username: any) =>
                `${window.location.origin}/api/service/avatars/${username}`

            const isDeletePopoverVisible = ref({})
            const { showUserPreview: openPreview, setUserUniqueAttribute } =
                useUserPreview()
            const handleUserPreview = (username: string) => {
                setUserUniqueAttribute(username, 'username')
                openPreview()
            }

            const getQueryStatusClass = (status: string) => {
                if (status.toLowerCase() === 'success') return 'bg-green-500'
                if (status.toLowerCase() === 'error') return 'bg-red-500'
                if (status.toLowerCase() === 'abort') return 'bg-yellow-500'
                return 'bg-green-500'
            }
            const columns = [
                {
                    title: 'Query details',
                    key: 'QueryInfo',
                    ellipsis: true,
                    slots: { customRender: 'queryInfo' },
                    width: 500,
                },
                {
                    title: 'Execution details',
                    slots: { customRender: 'details' },
                    key: 'execution_details',
                },
                {
                    title: 'User',
                    key: 'user',
                    ellipsis: true,
                    slots: { customRender: 'user' },
                    width: 120,
                },
                {
                    title: 'Timestamp',
                    key: 'timestamp',
                    slots: { customRender: 'timestamp' },
                },
            ]

            const handleRowSelected = (record: any) => {
                console.log(record, 'record')
                emit('selectQuery', record)
            }
            const customRow = (record) => ({
                onClick: (event) => {
                    emit('selectQuery', record)
                },
            })
            return {
                customRow,
                handleRowSelected,
                selectedRowKeys,
                selectedQuery,
                getQueryStatusClass,
                dayjs,
                columns,
                imageUrl,
                handleUserPreview,
                isDeletePopoverVisible,
                getConnectionName,
                getConnectorImagePath,
                getConnectorName,
            }
        },
    })
</script>

<style lang="less" scoped>
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
    .selected-row {
        background: #f4f6fd;
    }
</style>
