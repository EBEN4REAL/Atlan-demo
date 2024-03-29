<template>
    <div>
        <a-table
            class="overflow-hidden border rounded-lg query-access-logs-table"
            :scroll="{ y: 'calc(100vh - 20rem)', x: true }"
            :table-layout="'fixed'"
            :pagination="false"
            :data-source="filteredAccessLogsList"
            :columns="columns"
            :row-key="(log) => log._id"
            :loading="isLoading"
            :custom-row="customRow"
            @change="handleTableChange"
        >
            <template #asset="{ text: log }">
                <AccessLogItem :log="log" :asset-meta-map="assetMetaMap" />
            </template>
            <template #action="{ text: log }">
                <div class="flex items-center h-full py-1">
                    <div
                        v-if="log && log._source && log._source.action"
                        class="flex items-center justify-center"
                    >
                        <div class="items-center">
                            <div class="capitalize parent-ellipsis-container">
                                {{ log._source.action.split('-')[1] }}
                            </div>
                        </div>
                    </div>
                    <div v-else>-</div>
                </div>
            </template>

            <template #user="{ text: log }">
                <div
                    v-if="log._source.reqUser"
                    class="flex items-center h-full"
                    @click="$emit('selectQuery', user)"
                >
                    <span
                        v-if="log._source.reqUser.includes('service-account')"
                    >
                        <div
                            v-if="log._source.reqUser.includes('apikey')"
                            class="flex items-center justify-center"
                        >
                            <AtlanIcon
                                icon="Key"
                                class="h-5 px-1 mr-1"
                            ></AtlanIcon>
                            <div>API Token</div>
                        </div>
                        <div v-else class="flex items-center justify-center">
                            <AtlanIcon
                                icon="AtlanBot"
                                class="h-5 px-1 mr-1"
                            ></AtlanIcon>
                            <div>BOT</div>
                        </div>
                    </span>
                    <div v-else class="flex items-center h-full">
                        <Avatar
                            :image-url="imageUrl(log._source.reqUser)"
                            :allow-upload="false"
                            :avatar-name="log._source.reqUser"
                            :avatar-size="16"
                            :avatar-shape="'circle'"
                            class="mr-1 mt-0.5"
                        />

                        <span
                            class="text-sm cursor-pointer text-primary"
                            @click="
                                () => handleUserPreview(log._source.reqUser)
                            "
                            >{{ log._source.reqUser }}</span
                        >
                    </div>
                </div>
                <div v-else>-</div>
            </template>
            <template #status="{ text: log }">
                <div class="flex items-center h-full py-1">
                    <div
                        v-if="
                            log &&
                            log._source &&
                            (log._source.result || log._source.result === 0)
                        "
                        class="flex items-center justify-center"
                    >
                        <div class="items-center">
                            <div class="parent-ellipsis-container">
                                <div v-if="log._source.result">
                                    <div
                                        class="px-2 py-0.5 border flex items-center rounded-2xl"
                                    >
                                        <AtlanIcon
                                            icon="CheckCurrentColor"
                                            class="p-0.5 border rounded-full text-success border-success"
                                        ></AtlanIcon>
                                        <span class="ml-1">Allowed</span>
                                    </div>
                                </div>
                                <div v-else>
                                    <div
                                        class="px-2 py-0.5 border flex items-center rounded-2xl"
                                    >
                                        <AtlanIcon
                                            icon="Cross"
                                            class="p-0.5 border rounded-full text-error border-error"
                                        ></AtlanIcon>
                                        <span class="ml-1">Denied</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else>-</div>
                </div>
            </template>

            <template #timestamp="{ text: log }">
                <div class="flex items-center h-full">
                    <div class="flex items-center">
                        <div
                            v-if="log._source['evtTime']"
                            class="flex items-center mr-5"
                        >
                            <span class="text-sm text-gray-700">
                                {{
                                    dayjs(log._source['evtTime']).format(
                                        'DD/MM/YYYY'
                                    )
                                }}
                            </span>
                            <span class="ml-4 text-gray-500">
                                {{
                                    dayjs(log._source['evtTime']).format(
                                        'HH:mm'
                                    )
                                }}
                            </span>
                        </div>
                        <div v-else>-</div>
                    </div>
                </div>
            </template>
        </a-table>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, Ref, watch, toRefs, computed } from 'vue'
    import dayjs from 'dayjs'
    import { useUserPreview } from '~/composables/user/showUserPreview'
    import Avatar from '~/components/common/avatar/index.vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import CertificateBadge from '@/common/badge/certificate/index.vue'
    import { SourceList } from '~/constant/source'
    import { useConnector } from '~/components/insights/common/composables/useConnector'
    import AccessLogItem from '@/governance/accessLogs/accessLogItem.vue'

    export default defineComponent({
        name: 'AccessLogsTable',
        components: { AccessLogItem, Avatar, CertificateBadge },
        props: {
            accessLogsList: {
                type: Array,
                default: () => [],
            },
            isLoading: {
                type: Boolean,
                default: false,
            },
            assetMetaMap: {
                type: Object,
                default: () => {},
            },
        },
        emits: ['selectQuery'],
        setup(props, { emit }) {
            const {
                title,
                getConnectorImage,
                assetType,
                rowCount,
                sizeBytes,
                dataType,
                columnCount,
                databaseName,
                database,
                schemaName,
                tableName,
                viewName,
                connectorName,
                connectionName,
                dataTypeCategoryLabel,
                dataTypeCategoryImage,
                isDist,
                isPartition,
                isPrimary,
                certificateStatus,
                certificateUpdatedAt,
                certificateUpdatedBy,
                certificateStatusMessage,
                description,
                assetTypeLabel,
                getAnchorName,
                isGTC,
                categories,
                parentCategory,
                classifications,
                getProfilePath,
            } = useAssetInfo()

            const assetURL = (asset) => ({
                path: `/assets/${asset.guid}`,
            })
            const imageUrl = (username: any) =>
                `${window.location.origin}/api/service/avatars/${username}`
            const { showUserPreview: openPreview, setUserUniqueAttribute } =
                useUserPreview()
            const handleUserPreview = (username: string) => {
                setUserUniqueAttribute(username, 'username')
                openPreview()
            }

            // If you want to show empty access logs too, change this logic.
            const { accessLogsList, assetMetaMap } = toRefs(props)
            const filteredAccessLogsList = computed(() =>
                accessLogsList.value?.filter(
                    (log) =>
                        log &&
                        log._source &&
                        log._source.resourceQF &&
                        assetMetaMap.value[log._source.resourceQF] &&
                        Object.keys(assetMetaMap.value[log._source.resourceQF])
                            .length > 0
                )
            )

            const getQueryStatusClass = (status: string) => {
                if (status.toLowerCase() === 'success') return 'bg-green-500'
                if (status.toLowerCase() === 'error') return 'bg-red-500'
                if (status.toLowerCase() === 'abort') return 'bg-yellow-500'
                return 'bg-green-500'
            }
            const columns = [
                {
                    title: 'Asset',
                    key: 'asset',
                    ellipsis: true,
                    slots: { customRender: 'asset' },
                    width: 500,
                },
                {
                    title: 'Action',
                    slots: { customRender: 'action' },
                    key: 'action',
                    width: 140,
                },
                {
                    title: 'User',
                    key: 'user',
                    ellipsis: true,
                    slots: { customRender: 'user' },
                    width: 140,
                },
                {
                    title: 'Status',
                    key: 'status',
                    ellipsis: true,
                    slots: { customRender: 'status' },
                    width: 140,
                },
                {
                    title: 'Timestamp',
                    key: 'timestamp',
                    slots: { customRender: 'timestamp' },
                },
            ]

            return {
                getQueryStatusClass,
                dayjs,
                columns,
                imageUrl,
                handleUserPreview,
                // ASSET
                title,
                getConnectorImage,
                assetType,
                rowCount,
                sizeBytes,
                dataType,
                columnCount,
                databaseName,
                database,
                schemaName,
                tableName,
                viewName,
                connectorName,
                connectionName,
                dataTypeCategoryLabel,
                dataTypeCategoryImage,
                isDist,
                isPartition,
                isPrimary,
                certificateStatus,
                certificateUpdatedAt,
                certificateUpdatedBy,
                certificateStatusMessage,
                description,
                assetTypeLabel,
                getAnchorName,
                isGTC,
                categories,
                parentCategory,
                classifications,
                assetURL,
                getProfilePath,
                filteredAccessLogsList,
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
