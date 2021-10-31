<!-- TODO: remove hardcoded prop classes and make component generic -->
<template>
    <div class="flex flex-col mx-3">
        <div
            class="flex items-start flex-1 px-1 py-2 transition-all duration-300 "
        >
            <div
                class="box-border flex flex-col flex-1 overflow-hidden  gap-y-1 lg:pr-16"
            >
                <!-- Title bar -->
                <!-- <div
                    v-if="item.guid === '-1'"
                    class="flex flex-shrink mb-0 overflow-hidden text-base font-bold text-gray-700 truncate overflow-ellipsis whitespace-nowrap"
                >
                    <div>{{ item.displayText }}</div>
                    <AtlanIcon icon="Lock" class="ml-1 mt-0.5" />
                </div> -->
                <div class="flex items-center mb-0 overflow-hidden">
                    <div
                        class="flex mr-1"
                        v-if="
                            ['atlasglossarycategory'].includes(
                                item.typeName?.toLowerCase()
                            )
                        "
                    >
                        <AtlanIcon icon="Category" class="h-7"></AtlanIcon>
                    </div>
                    <div
                        class="flex mr-1"
                        v-if="
                            ['atlasglossaryterm'].includes(
                                item.typeName?.toLowerCase()
                            )
                        "
                    >
                        <AtlanIcon icon="Term" class="h-7"></AtlanIcon>
                    </div>
                    <div class="flex flex-col">
                        <router-link
                            to="/"
                            class="flex-shrink mb-0 mr-1 overflow-hidden font-bold truncate cursor-pointer  text-md text-primary hover:underline overflow-ellipsis whitespace-nowrap"
                        >
                            {{ title(item) }}
                        </router-link>
                        <div class="flex items-center text-sm text-gray-500">
                            {{ getAnchorName(item) }}
                        </div>
                    </div>
                    <!-- <CertificateBadge
                        :status="certificateStatus(item)"
                        :username="certificateUpdatedBy(item)"
                        :timestamp="certificateUpdatedAt(item)"
                        class="mb-0.5"
                    ></CertificateBadge> -->
                    <!-- <CertificatePopover :data="item" /> -->
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    // import HierarchyBar from '@common/badge/hierarchy.vue'
    // import StatusBadge from '@common/badge/status/index.vue'
    import { defineComponent, PropType } from 'vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import CertificateBadge from '@/common/badge/certificate/index.vue'

    export default defineComponent({
        name: 'AssetListItem',
        components: {
            CertificateBadge,
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
                getAnchorName,
            } = useAssetInfo()

            return {
                title,
                getConnectorImage,
                assetType,
                dataType,

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
                getAnchorName,
            }
        },
    })
</script>
