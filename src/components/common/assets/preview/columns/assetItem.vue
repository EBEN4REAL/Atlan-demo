<!-- TODO: remove hardcoded prop classes and make component generic -->
<template>
    <div class="flex flex-col">
        <div
            class="flex items-start flex-1 px-3 py-1 transition-all duration-300 "
        >
            <div
                class="box-border flex flex-col flex-1 overflow-hidden  gap-y-1 lg:pr-16"
            >
                <div class="flex items-center mb-0 overflow-hidden">
                    <div class="flex mr-1">
                        <div
                            v-if="
                                isPrimary(item) ||
                                isDist(item) ||
                                isPartition(item)
                            "
                        >
                            <AtlanIcon
                                icon="PrimaryKey"
                                class="mr-1 mb-0.5 text-yellow-400"
                            ></AtlanIcon>
                        </div>
                        <component
                            v-else
                            :is="dataTypeCategoryImage(item)"
                            class="h-4 text-gray-500 mb-0.5"
                        />
                    </div>
                    <span
                        @click="showColumnDrawer = true"
                        class="flex-shrink mb-0 mr-1 overflow-hidden font-bold truncate cursor-pointer  text-md text-primary hover:underline overflow-ellipsis whitespace-nowrap"
                    >
                        {{ title(item) }}
                    </span>
                </div>

                <!-- Info bar -->
                <!-- <div class="flex items-center gap-x-3">
                    <div class="flex items-center gap-x-1">
                        <div class="flex">
                            <component
                                :is="dataTypeCategoryImage(item)"
                                class="h-4 text-gray-500"
                            />
                            <span class="ml-1 text-sm text-gray-500">{{
                                dataType(item)
                            }}</span>
                        </div>
                    </div>
                </div> -->
            </div>
            <!-- <ThreeDotMenu
                v-if="showThreeDotMenu"
                :entity="item"
                :visible="false"
                :show-gtc-crud="false"
                :show-links="false"
                :show-unlink-asset="true"
                @unlinkAsset="$emit('unlinkAsset', item)"
            /> -->
        </div>
        <AssetDrawer
            :data="item"
            :showDrawer="showColumnDrawer"
            @closeDrawer="handleCloseDrawer"
        />
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref } from 'vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import CertificateBadge from '@/common/badge/certificate/index.vue'
    import AssetDrawer from '@/common/assets/preview/drawer.vue'

    export default defineComponent({
        name: 'AssetListItem',
        components: {
            CertificateBadge,
            AssetDrawer,
        },
        props: {
            item: {
                type: Object,
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

                dataType,

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

            const showColumnDrawer = ref(false)

            const handleCloseDrawer = () => {
                showColumnDrawer.value = false
            }

            return {
                title,
                getConnectorImage,
                assetType,
                dataType,
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
                showColumnDrawer,
                handleCloseDrawer,
            }
        },
    })
</script>
