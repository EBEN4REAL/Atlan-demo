<!-- TODO: remove hardcoded prop classes and make component generic -->
<template>
    <div class="flex items-center w-full px-8 pt-3">
        <a-button @click="$router.back()" class="px-1">
            <atlan-icon
                icon="ArrowRight"
                class="w-auto h-4 text-gray-500 transform rotate-180"
            />
        </a-button>
        <div class="flex items-center justify-between w-full ml-3">
            <div class="flex flex-col">
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
                        class="flex-shrink mb-0 mr-1 overflow-hidden text-base font-bold text-gray-700 truncate cursor-pointer  text-mdoverflow-ellipsis whitespace-nowrap"
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
                <div class="flex items-center mt-1 gap-x-3">
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
            <a-button-group>
                <a-button block class="flex items-center justify-center"
                    ><AtlanIcon icon="Query" class="mr-1 mb-0.5"
                /></a-button>
                <a-button block class="flex items-center justify-center"
                    ><AtlanIcon icon="Share" class="mr-1 mb-0.5" /></a-button
                ><AssetMenu :asset="item" :editPermission="true">
                    <a-button block class="flex items-center justify-center"
                        ><AtlanIcon
                            icon="KebabMenu"
                            class="mr-1 mb-0.5" /></a-button
                ></AssetMenu>
            </a-button-group>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, inject, PropType } from 'vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import CertificateBadge from '@/common/badge/certificate/index.vue'
    import AtlanIcon from '~/components/common/icon/atlanIcon.vue'
    import AssetMenu from './assetMenu.vue'

    export default defineComponent({
        name: 'AssetListItem',
        components: {
            CertificateBadge,
            AtlanIcon,
            AssetMenu,
        },
        props: {
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

            const item = inject('selectedAsset')

            const assetURL = (asset) => {
                return `/assets/${asset.guid}`
            }

            return {
                title,
                item,
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
