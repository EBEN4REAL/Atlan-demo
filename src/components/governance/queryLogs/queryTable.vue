<template>
    <div>
        <a-table
            class="overflow-hidden border rounded-lg apikey-list"
            :scroll="{ y: 'calc(100vh - 20rem)' }"
            :style="{ height: 'calc(100vh - 20rem)' }"
            :table-layout="'fixed'"
            :pagination="false"
            :class="$style.table_custom"
            :data-source="apiKeysList"
            :columns="columns"
            :row-key="(query) => query._id"
            :loading="isLoading"
            :custom-row="customRow"
            @change="handleTableChange"
        >
            <template #queryInfo="{ text: queryInfo }">
                <div class="flex items-center h-full py-1">
                    <div
                        v-if="queryInfo._source.log.message.savedQueryId"
                        class="flex items-center justify-center"
                    >
                        <div class="items-center">
                            <div class="parent-ellipsis-container">
                                <div
                                    class="
                                        w-2
                                        h-2
                                        mr-3
                                        rounded-full
                                        parent-ellipsis-container-extension
                                    "
                                    :class="
                                        getQueryStatusClass(
                                            queryInfo._source.log.message
                                                .queryStatus
                                        )
                                    "
                                ></div>
                                <span
                                    class="
                                        text-sm text-gray-700
                                        parent-ellipsis-container-base
                                    "
                                    >{{
                                        queryInfo._source.log.message
                                            .savedQueryId
                                    }}</span
                                >
                            </div>
                            <div class="flex items-center mt-1 ml-4">
                                <img
                                    :src="snowflake.image"
                                    class="w-4 h-4 mr-1 -mt-0.5"
                                />
                                <span class="text-xs text-gray-500">{{
                                    'ATLAN_SAMPLE_DATA'
                                }}</span>
                            </div>
                        </div>
                    </div>

                    <div
                        v-else-if="queryInfo._source.log.message.userSqlQuery"
                        class="overflow-hidden"
                    >
                        <div class="items-center">
                            <div class="parent-ellipsis-container">
                                <div
                                    class="
                                        w-2
                                        h-2
                                        mr-3
                                        rounded-full
                                        parent-ellipsis-container-extension
                                    "
                                    :class="
                                        getQueryStatusClass(
                                            queryInfo._source.log.message
                                                .queryStatus
                                        )
                                    "
                                ></div>
                                <span
                                    class="
                                        text-sm text-gray-700
                                        parent-ellipsis-container-base
                                    "
                                    >{{
                                        queryInfo._source.log.message
                                            .userSqlQuery
                                    }}</span
                                >
                            </div>
                            <div class="flex items-center mt-1.5 ml-4">
                                <img
                                    :src="snowflake.image"
                                    class="w-4 h-4 mr-1 -mt-0.5"
                                />
                                <span class="text-xs text-gray-500">{{
                                    'ATLAN_SAMPLE_DATA'
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
                        v-if="queryInfo._source.log.message.totalTime"
                        class="flex items-center"
                    >
                        <AtlanIcon
                            icon="Schedule"
                            class="w-4 h-4 mr-1 -mt-0.5"
                        />

                        <span class="text-sm text-gray-700">
                            {{
                                queryInfo._source.log.message.totalTime / 1000 >
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
                        class="text-sm text-gray-700 cursor-pointer"
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
                                    ).format('HH:MM')
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

export default defineComponent({
    name: 'ApiKeysTable',
    components: { Avatar, AtlanBtn, PillGroup },
    props: {
        apiKeysList: {
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
    },
    emits: ['selectQuery', 'toggleQueryPreviewDrawer', 'selectQuery'],
    setup(props, { emit }) {
        const snowflake = SourceList.find((e) => e.id === 'snowflake')
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

        const handleTableChange = () => {}

        const getQueryStatusClass = (status: string) => {
            if (status === 'success') return 'bg-green-500'
            if (status === 'failure') return 'bg-red-500'
            return 'bg-green-500'
        }
        const columns = [
            {
                title: 'Query details',
                key: 'QueryInfo',
                ellipsis: true,
                slots: { customRender: 'queryInfo' },
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
            snowflake,
            getQueryStatusClass,
            dayjs,
            columns,
            imageUrl,
            handleTableChange,
            handleUserPreview,
            isDeletePopoverVisible,
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
<style lang="less" module>
.table_custom {
    :global(.ant-empty-normal) {
        height: calc(100vh - 20rem);
    }
}
</style>
