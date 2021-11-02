<!-- TODO: remove hardcoded prop classes and make component generic -->
<template>
    <div class="flex flex-col w-full mx-3">
        <div
            class="flex items-start flex-1 px-3 py-4 transition-all duration-300 "
        >
            <a-button
                class="
                    px-1
                    border-transparent
                    shadow-none
                    hover:border-gray-300
                    py-0.5
                "
                @click="$router.back()"
            >
                <atlan-icon
                    icon="ArrowRight"
                    class="w-5 h-5 text-gray-500 transform rotate-180"
                />
            </a-button>

            <div
                class="box-border flex flex-col flex-1 overflow-hidden  gap-y-1 lg:pr-16"
            >
                <div class="flex items-center mb-0 overflow-hidden">
                    <div
                        class="flex mr-1"
                        v-if="['column'].includes(item.typeName?.toLowerCase())"
                    >
                        <component
                            :is="dataTypeCategoryImage(item)"
                            class="h-4 text-gray-500 mb-0.5"
                        />
                    </div>
                    <div
                        class="flex-shrink mb-0 mr-1 overflow-hidden font-bold text-gray-700 truncate cursor-pointer  text-mdoverflow-ellipsis whitespace-nowrap"
                    >
                        {{ title(item) }}
                    </div>

                    <CertificateBadge
                        v-if="certificateStatus(item)"
                        :status="certificateStatus(item)"
                        :username="certificateUpdatedBy(item)"
                        :timestamp="certificateUpdatedAt(item)"
                        class="mb-0.5"
                    ></CertificateBadge>
                </div>

                <!-- Info bar -->
                <div class="flex items-center gap-x-3">
                    <div class="flex items-center">
                        <a-tooltip placement="left">
                            <template #title>
                                <span>{{
                                    `${connectorName(item)}/${connectionName(
                                        item
                                    )}`
                                }}</span>
                            </template>
                            <img
                                :src="getConnectorImage(item)"
                                class="h-3 mr-1 mb-0.5"
                            />
                        </a-tooltip>

                        <div
                            class="text-sm tracking-tight text-gray-500 uppercase "
                        >
                            {{ item.typeName }}
                        </div>
                    </div>

                    <div
                        v-if="
                            ['table', 'view', 'tablepartition'].includes(
                                item.typeName?.toLowerCase()
                            )
                        "
                        class="flex text-sm text-gray-500 gap-x-1"
                    >
                        <a-tooltip placement="bottomLeft">
                            <span
                                v-if="
                                    ['table', 'tablepartition'].includes(
                                        item.typeName?.toLowerCase()
                                    )
                                "
                                class="text-gray-500"
                                ><span
                                    class="font-semibold tracking-tight text-gray-500 "
                                    >{{ rowCount(item, false) }}
                                </span>
                                Rows</span
                            >
                            <template #title>
                                <span
                                    v-if="sizeBytes(item, false)"
                                    class="font-semibold"
                                    >{{ rowCount(item, true) }} rows ({{
                                        sizeBytes(item, false)
                                    }})</span
                                >
                            </template>
                        </a-tooltip>
                        <span class="text-gray-500">
                            <span
                                class="font-semibold tracking-tight text-gray-500 "
                                >{{ columnCount(item, false) }}</span
                            >
                            Cols</span
                        >
                    </div>

                    <div
                        v-if="
                            ['database'].includes(item.typeName?.toLowerCase())
                        "
                        class="flex text-sm text-gray-500 gap-x-2"
                    >
                        <div class="flex items-center text-gray">
                            <img
                                :src="getConnectorImage(item)"
                                class="h-3 mr-1 mb-0.5"
                            />
                            <span>{{
                                `${connectorName(item)}/${connectionName(item)}`
                            }}</span>
                        </div>
                    </div>

                    <div
                        v-if="item.typeName?.toLowerCase() === 'column'"
                        class="flex items-center gap-x-1"
                    >
                        <div class="flex">
                            <component
                                :is="dataTypeCategoryImage(item)"
                                class="h-4 text-gray-500"
                            />
                            <span class="ml-1 text-sm text-gray-500">{{
                                dataType(item)
                            }}</span>
                        </div>
                        <div
                            class="flex"
                            v-if="
                                isPrimary(item) ||
                                isDist(item) ||
                                isPartition(item)
                            "
                        >
                            <AtlanIcon
                                icon="Key"
                                class="mr-1 mb-0.5"
                            ></AtlanIcon>

                            <span
                                class="ml-1 text-sm text-gray-700"
                                v-if="isPrimary(item)"
                                >Primary Key</span
                            >
                            <span
                                class="ml-1 text-sm text-gray-700"
                                v-if="isDist(item)"
                                >Dist Key</span
                            >
                            <span
                                class="ml-1 text-sm text-gray-700"
                                v-if="isPartition(item)"
                                >Partition Key</span
                            >
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
                            ].includes(item.typeName?.toLowerCase())
                        "
                        class="flex text-sm text-gray-500 gap-x-2"
                    >
                        <a-tooltip placement="bottomLeft">
                            <div
                                class="flex items-center text-gray-500"
                                v-if="databaseName(item)"
                            >
                                <AtlanIcon
                                    icon="DatabaseGray"
                                    class="mr-1 mb-0.5"
                                />
                                <div class="tracking-tight text-gray-500">
                                    {{ databaseName(item) }}
                                </div>
                            </div>
                            <template #title>
                                <span>Database - {{ databaseName(item) }}</span>
                            </template>
                        </a-tooltip>
                        <a-tooltip placement="bottomLeft">
                            <div
                                v-if="schemaName(item)"
                                class="flex items-center text-gray-500"
                            >
                                <AtlanIcon
                                    icon="SchemaGray"
                                    class="mr-1 mb-0.5"
                                />
                                <div class="tracking-tight text-gray-500">
                                    {{ schemaName(item) }}
                                </div>
                            </div>
                            <template #title>
                                <span>Schema - {{ schemaName(item) }}</span>
                            </template>
                        </a-tooltip>

                        <a-tooltip
                            placement="bottomLeft"
                            v-if="tableName(item)"
                        >
                            <div
                                v-if="tableName(item)"
                                class="flex items-center text-gray-500"
                            >
                                <AtlanIcon
                                    icon="TableGray"
                                    class="mr-1 mb-0.5"
                                />
                                <div class="tracking-tight text-gray-500">
                                    {{ tableName(item) }}
                                </div>
                            </div>
                            <template #title>
                                <span>Table - {{ tableName(item) }}</span>
                            </template>
                        </a-tooltip>
                        <a-tooltip placement="bottomLeft" v-if="viewName(item)">
                            <div
                                v-if="viewName(item)"
                                class="flex items-center text-gray-500"
                            >
                                <AtlanIcon
                                    icon="ViewGray"
                                    class="mr-1 mb-0.5"
                                />
                                <div class="tracking-tight text-gray-500">
                                    {{ viewName(item) }}
                                </div>
                            </div>
                            <template #title>
                                <span>View - {{ viewName(item) }}</span>
                            </template>
                        </a-tooltip>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import CertificateBadge from '@/common/badge/certificate/index.vue'
    import AtlanIcon from '~/components/common/icon/atlanIcon.vue'

    export default defineComponent({
        name: 'AssetListItem',
        components: {
            CertificateBadge,
            AtlanIcon,
        },
        props: {
            item: {
                required: false,
                default() {
                    return {}
                },
            },
            score: {
                type: Number,
                required: false,
                default() {
                    return 0
                },
            },
            projection: {
                type: Array,
                required: false,
                default() {
                    return []
                },
            },
            isSelected: {
                type: Boolean,
                required: false,
                default: () => false,
            },
            isChecked: {
                type: Boolean,
                required: false,
                default: () => false,
            },
            cssClasses: {
                type: String,
                required: false,
                default: () => '',
            },
            showAssetTypeIcon: {
                type: Boolean,
                required: false,
                default: () => true,
            },
            // If the list items are selectable or not
            showCheckBox: {
                type: Boolean,
                required: false,
                default: () => false,
            },
            // This is different than showCheckBox prop. List items are selectable but the check box should be visible only when atleast one item is selected/ on hover
            bulkSelectMode: {
                type: Boolean,
                required: false,
                default: false,
            },
            // for unlinking asset in glossary
            showThreeDotMenu: {
                type: Boolean,
                required: false,
                default: false,
            },
        },
        emits: ['listItem:check', 'unlinkAsset'],
        setup() {
            const {
                title,
                getConnectorImage,
                assetType,
                rowCount,
                sizeBytes,
                dataType,
                columnCount,
                databaseName,
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
            } = useAssetInfo()

            const assetURL = (asset) => {
                return `/assets/${asset.guid}`
            }

            return {
                title,
                getConnectorImage,
                assetType,
                dataType,
                assetURL,
                rowCount,
                columnCount,
                sizeBytes,
                databaseName,
                schemaName,
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
                tableName,
                viewName,
            }
        },
    })
</script>
