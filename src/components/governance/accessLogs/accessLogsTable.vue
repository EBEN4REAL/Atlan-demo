<template>
    <div>
        <a-table
            class="overflow-hidden border rounded-lg"
            :scroll="{ y: 'calc(100vh - 20rem)' }"
            :table-layout="'fixed'"
            :pagination="false"
            :class="$style.table_custom"
            :data-source="accessLogsList"
            :columns="columns"
            :row-key="(log) => log._id"
            :loading="isLoading"
            :custom-row="customRow"
            @change="handleTableChange"
        >
            <template #asset="{ text: log }">
                <div class="flex items-center h-full py-1">
                    <div
                        v-if="
                            log &&
                            log._source &&
                            log._source.resourceQF &&
                            assetMetaMap[log._source.resourceQF] &&
                            Object.keys(assetMetaMap[log._source.resourceQF])
                                .length
                        "
                        class="flex items-center justify-center"
                    >
                        <div class="items-center">
                            <div class="parent-ellipsis-container">
                                <!-- {{ log._source.resourceQF }} -->
                                <div class="flex flex-wrap items-center mt-1">
                                    <div class="flex items-center mr-2">
                                        <a-tooltip
                                            v-if="
                                                connectorName(
                                                    assetMetaMap[
                                                        log._source.resourceQF
                                                    ]
                                                )
                                            "
                                            placement="left"
                                        >
                                            <template #title>
                                                <span
                                                    >{{
                                                        connectorName(
                                                            assetMetaMap[
                                                                log._source
                                                                    .resourceQF
                                                            ]
                                                        )
                                                    }}
                                                </span>
                                                <span
                                                    v-if="
                                                        connectionName(
                                                            assetMetaMap[
                                                                log._source
                                                                    .resourceQF
                                                            ]
                                                        )
                                                    "
                                                    >{{
                                                        `/${connectionName(
                                                            assetMetaMap[
                                                                log._source
                                                                    .resourceQF
                                                            ]
                                                        )}`
                                                    }}</span
                                                >
                                            </template>
                                            <img
                                                :src="
                                                    getConnectorImage(
                                                        assetMetaMap[
                                                            log._source
                                                                .resourceQF
                                                        ]
                                                    )
                                                "
                                                class="h-3 mr-1 mb-0.5"
                                            />
                                        </a-tooltip>
                                        <AtlanIcon
                                            v-if="
                                                [
                                                    'atlasglossarycategory',
                                                ].includes(
                                                    assetMetaMap[
                                                        log._source.resourceQF
                                                    ].typeName?.toLowerCase()
                                                )
                                            "
                                            icon="Category"
                                            class="h-4 mb-0.5 mr-1"
                                        ></AtlanIcon>
                                        <AtlanIcon
                                            v-else-if="
                                                ['atlasglossaryterm'].includes(
                                                    assetMetaMap[
                                                        log._source.resourceQF
                                                    ].typeName?.toLowerCase()
                                                )
                                            "
                                            icon="Term"
                                            class="h-4 mb-0.5 mr-1"
                                        ></AtlanIcon>
                                        <div
                                            v-else-if="
                                                isGTC(
                                                    assetMetaMap[
                                                        log._source.resourceQF
                                                    ]
                                                )
                                            "
                                            class="flex items-center text-sm text-gray-500 "
                                        >
                                            <AtlanIcon
                                                icon="Glossary"
                                                class="h-4 mr-1"
                                            ></AtlanIcon>
                                            {{
                                                getAnchorName(
                                                    assetMetaMap[
                                                        log._source.resourceQF
                                                    ]
                                                )
                                            }}
                                        </div>
                                        <div
                                            class="text-xs tracking-wider text-gray-500 uppercase "
                                        >
                                            {{
                                                assetTypeLabel(
                                                    assetMetaMap[
                                                        log._source.resourceQF
                                                    ]
                                                ) ||
                                                assetMetaMap[
                                                    log._source.resourceQF
                                                ].typeName
                                            }}
                                        </div>
                                        <div
                                            v-if="
                                                ['database'].includes(
                                                    assetMetaMap[
                                                        log._source.resourceQF
                                                    ].typeName?.toLowerCase()
                                                )
                                            "
                                            class="flex mr-2 text-xs text-sm text-gray-500 "
                                        >
                                            <div
                                                class="flex items-center text-gray-500  text-gray"
                                            >
                                                <span class="mx-1"> • </span>
                                                <span>{{
                                                    `${connectorName(
                                                        assetMetaMap[
                                                            log._source
                                                                .resourceQF
                                                        ]
                                                    )}/${connectionName(
                                                        assetMetaMap[
                                                            log._source
                                                                .resourceQF
                                                        ]
                                                    )}`
                                                }}</span>
                                            </div>
                                        </div>
                                        <div
                                            v-if="
                                                [
                                                    'table',
                                                    'view',
                                                    'tablepartition',
                                                    'materialisedview',
                                                    'column',
                                                    'schema',
                                                ].includes(
                                                    assetMetaMap[
                                                        log._source.resourceQF
                                                    ].typeName?.toLowerCase()
                                                )
                                            "
                                            class="flex text-sm text-gray-500"
                                        >
                                            <a-tooltip placement="bottomLeft">
                                                <div
                                                    v-if="
                                                        databaseName(
                                                            assetMetaMap[
                                                                log._source
                                                                    .resourceQF
                                                            ]
                                                        )
                                                    "
                                                    class="flex items-center text-xs text-gray-500 "
                                                >
                                                    <span class="mx-1">•</span>
                                                    <div
                                                        class="tracking-tight text-gray-500 "
                                                    >
                                                        {{
                                                            databaseName(
                                                                assetMetaMap[
                                                                    log._source
                                                                        .resourceQF
                                                                ]
                                                            )
                                                        }}
                                                    </div>
                                                </div>
                                                <template #title>
                                                    <span
                                                        >Database -
                                                        {{
                                                            databaseName(
                                                                assetMetaMap[
                                                                    log._source
                                                                        .resourceQF
                                                                ]
                                                            )
                                                        }}</span
                                                    >
                                                </template>
                                            </a-tooltip>
                                            <a-tooltip placement="bottomLeft">
                                                <div
                                                    v-if="
                                                        schemaName(
                                                            assetMetaMap[
                                                                log._source
                                                                    .resourceQF
                                                            ]
                                                        )
                                                    "
                                                    class="flex items-center text-xs text-gray-500 "
                                                >
                                                    <div
                                                        class="tracking-tight text-gray-500 "
                                                    >
                                                        <span class="mx-1"
                                                            >/</span
                                                        >{{
                                                            schemaName(
                                                                assetMetaMap[
                                                                    log._source
                                                                        .resourceQF
                                                                ]
                                                            )
                                                        }}
                                                    </div>
                                                </div>
                                                <template #title>
                                                    <span
                                                        >Schema -
                                                        {{
                                                            schemaName(
                                                                assetMetaMap[
                                                                    log._source
                                                                        .resourceQF
                                                                ]
                                                            )
                                                        }}</span
                                                    >
                                                </template>
                                            </a-tooltip>
                                            <div
                                                v-if="
                                                    ['column'].includes(
                                                        assetMetaMap[
                                                            log._source
                                                                .resourceQF
                                                        ].typeName?.toLowerCase()
                                                    )
                                                "
                                                class="flex mr-2 text-sm text-gray-500  gap-x-2"
                                            >
                                                <a-tooltip
                                                    v-if="
                                                        tableName(
                                                            assetMetaMap[
                                                                log._source
                                                                    .resourceQF
                                                            ]
                                                        )
                                                    "
                                                    placement="bottomLeft"
                                                >
                                                    <div
                                                        v-if="
                                                            tableName(
                                                                assetMetaMap[
                                                                    log._source
                                                                        .resourceQF
                                                                ]
                                                            )
                                                        "
                                                        class="flex items-center text-xs text-gray-500 "
                                                    >
                                                        <span class="mx-1"
                                                            >/</span
                                                        >
                                                        <div
                                                            class="tracking-tight text-gray-500 "
                                                        >
                                                            {{
                                                                tableName(
                                                                    assetMetaMap[
                                                                        log
                                                                            ._source
                                                                            .resourceQF
                                                                    ]
                                                                )
                                                            }}
                                                        </div>
                                                    </div>
                                                    <template #title>
                                                        <span
                                                            >Table -
                                                            {{
                                                                tableName(
                                                                    assetMetaMap[
                                                                        log
                                                                            ._source
                                                                            .resourceQF
                                                                    ]
                                                                )
                                                            }}</span
                                                        >
                                                    </template>
                                                </a-tooltip>
                                                <a-tooltip
                                                    v-if="
                                                        viewName(
                                                            assetMetaMap[
                                                                log._source
                                                                    .resourceQF
                                                            ]
                                                        )
                                                    "
                                                    placement="bottomLeft"
                                                >
                                                    <div
                                                        v-if="
                                                            viewName(
                                                                assetMetaMap[
                                                                    log._source
                                                                        .resourceQF
                                                                ]
                                                            )
                                                        "
                                                        class="flex items-center text-xs text-gray-500 "
                                                    >
                                                        <span class="mx-1"
                                                            >/</span
                                                        >
                                                        <div
                                                            class="tracking-tight text-gray-500 "
                                                        >
                                                            {{
                                                                viewName(
                                                                    assetMetaMap[
                                                                        log
                                                                            ._source
                                                                            .resourceQF
                                                                    ]
                                                                )
                                                            }}
                                                        </div>
                                                    </div>
                                                    <template #title>
                                                        <span
                                                            >View -
                                                            {{
                                                                viewName(
                                                                    assetMetaMap[
                                                                        log
                                                                            ._source
                                                                            .resourceQF
                                                                    ]
                                                                )
                                                            }}</span
                                                        >
                                                    </template>
                                                </a-tooltip>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                {{
                                    title(assetMetaMap[log._source.resourceQF])
                                }}

                                <CertificateBadge
                                    v-if="
                                        certificateStatus(
                                            assetMetaMap[log._source.resourceQF]
                                        )
                                    "
                                    :status="
                                        certificateStatus(
                                            assetMetaMap[log._source.resourceQF]
                                        )
                                    "
                                    :username="
                                        certificateUpdatedBy(
                                            assetMetaMap[log._source.resourceQF]
                                        )
                                    "
                                    :timestamp="
                                        certificateUpdatedAt(
                                            assetMetaMap[log._source.resourceQF]
                                        )
                                    "
                                    class="mb-0.5"
                                ></CertificateBadge>
                            </div>
                        </div>
                    </div>
                    <div v-else>-</div>
                </div>
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
                            <div>API Key</div>
                        </div>
                        <span v-else
                            ><AtlanIcon icon="Admin" class="mr-1"
                                >Atlan BOT</AtlanIcon
                            ></span
                        >
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
                                    <div class="px-2 py-0.5 border flex items-center rounded-2xl">
                                        <AtlanIcon
                                            icon="CheckCurrentColor"
                                            class="
                                                p-0.5
                                                border
                                                rounded-full
                                                text-success
                                                border-success
                                            "
                                        ></AtlanIcon>
                                        <span class="ml-1">Allowed</span>
                                    </div>
                                </div>
                                <div v-else>
                                    <div class="px-2 py-0.5 border flex items-center rounded-2xl">
                                        <AtlanIcon
                                            icon="Cross"
                                            class="
                                                p-0.5
                                                border
                                                rounded-full
                                                text-error
                                                border-error
                                            "
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
import useAssetInfo from '~/composables/discovery/useAssetInfo'
import CertificateBadge from '@/common/badge/certificate/index.vue'
import { SourceList } from '~/constant/source'
import { useConnector } from '~/components/insights/common/composables/useConnector'

export default defineComponent({
    name: 'AccessLogsTable',
    components: { Avatar, CertificateBadge },
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
            },
            {
                title: 'User',
                key: 'user',
                ellipsis: true,
                slots: { customRender: 'user' },
                width: 120,
            },
            {
                title: 'Status',
                key: 'status',
                ellipsis: true,
                slots: { customRender: 'status' },
                width: 120,
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
