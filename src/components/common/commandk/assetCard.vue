<template>
    <router-link :to="assetURL(item)" @click="$emit('closeModal')">
        <div class="flex flex-col">
            <div
                class="flex items-center flex-1 px-5 pt-2 pb-3 transition-all duration-300 hover:bg-gray-100 hover:border-none"
            >
                <AssetLogo
                    :asset="item"
                    :text-required="false"
                    variant="lg"
                    class="mr-2"
                />
                <div class="flex flex-col flex-1 overflow-hidden lg:pr-16">
                    <!-- Title bar -->
                    <div
                        v-if="item.guid === '-1'"
                        class="flex flex-shrink pl-1 mb-0 overflow-hidden text-sm font-bold text-gray-700 truncate overflow-ellipsis whitespace-nowrap"
                    >
                        <div>{{ item.displayText }}</div>
                        <AtlanIcon icon="Lock" class="ml-1 mt-0.5" />
                    </div>
                    <div
                        v-else
                        class="flex items-center pl-1 mb-0 overflow-hidden"
                    >
                        <!-- <Popover v-if="hasPopHover" :item="item"> -->
                        <router-link
                            :to="assetURL(item)"
                            class="flex-shrink mb-0 overflow-hidden text-sm font-bold truncate cursor-pointer text-primary hover:underline overflow-ellipsis whitespace-nowrap"
                            @click="$emit('closeModal')"
                        >
                            {{ title(item) }}
                        </router-link>
                        <!-- </Popover> -->
                        <CertificateBadge
                            v-if="certificateStatus(item)"
                            :status="certificateStatus(item)"
                            :username="certificateUpdatedBy(item)"
                            :timestamp="certificateUpdatedAt(item)"
                            class="mb-0.5"
                        ></CertificateBadge>
                    </div>

                    <!-- Info bar -->

                    <div class="flex items-center text-gray-500 gap-x-2">
                        <AssetLogo
                            :asset="item"
                            :image-required="false"
                            class="mr-2 text-xs"
                        />
                        <HierarchyBar :selected-asset="item" class="text-xs" />
                        <span style="color: #c4c4c4"> • </span>
                        <div class="flex items-center gap-x-3">
                            <!-- Column dataType -->
                            <div
                                v-if="item.typeName.toLowerCase() === 'column'"
                                class="flex items-center space-x-2"
                            >
                                <div class="flex items-center">
                                    <component
                                        :is="dataTypeCategoryImage(item)"
                                        class="w-auto h-4 text-gray-500 mb-0.5"
                                    ></component>
                                    <span class="ml-1 text-xs text-gray-500">{{
                                        dataType(item)
                                    }}</span>
                                </div>
                                <div
                                    v-if="item.attributes?.isPrimary"
                                    class="flex"
                                >
                                    <AtlanIcon icon="PrimaryKey" />
                                </div>
                            </div>

                            <!-- Row/Col bar -->
                            <div
                                v-if="
                                    [
                                        'table',
                                        'view',
                                        'tablepartition',
                                    ].includes(item.typeName.toLowerCase())
                                "
                                class="flex text-xs text-gray-500"
                            >
                                <RowsColumnCount :item="item" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </router-link>
    <!-- <Popover :item="item"> </Popover> -->
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'
    import HierarchyBar from '@common/badge/hierarchy.vue'
    import CertificateBadge from '@/common/badge/certificate/index.vue'
    import AssetLogo from '@/common/icon/assetIcon.vue'

    import { Components } from '~/api/atlas/client'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import RowsColumnCount from '@/common/info/rowsColumnCount.vue'
    import Popover from '@/common/popover/assets/index.vue'

    export default defineComponent({
        name: 'AssetListItem',
        components: {
            HierarchyBar,
            CertificateBadge,
            AssetLogo,
            RowsColumnCount,
            Popover,
        },
        props: {
            item: {
                type: Object as PropType<Components.Schemas.AtlasEntityHeader>,
                required: false,
                default(): Components.Schemas.AtlasEntityHeader {
                    return {}
                },
            },
        },
        emits: ['closeModal'],
        setup() {
            const {
                description,
                dataType,
                dataTypeCategoryImage,
                assetType,
                title,
                rowCount,
                columnCount,
                certificateStatus,
                certificateUpdatedAt,
                certificateUpdatedBy,
                certificateStatusMessage,
                getConnectorImage,
                assetTypeLabel,
                databaseName,
                schemaName,
                tableName,
            } = useAssetInfo()

            const isColumnAsset = (asset) => assetType(asset) === 'Column'
            const assetURL = (asset) => ({
                path: `/assets/${asset.guid}`,
            })
            return {
                isColumnAsset,
                // getColumnUrl,
                description,
                dataType,
                assetType,
                title,
                rowCount,
                columnCount,
                certificateStatus,
                certificateUpdatedAt,
                certificateUpdatedBy,
                certificateStatusMessage,
                dataTypeCategoryImage,
                assetURL,
                getConnectorImage,
                assetTypeLabel,
                databaseName,
                schemaName,
                tableName,
            }
        },
    })
</script>
