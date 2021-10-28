<!-- TODO: remove hardcoded prop classes and make component generic -->
<template>
    <div class="flex flex-col mx-3">
        <div
            class="flex items-start flex-1 px-3 py-4 transition-all duration-300 border-b border-gray-200 "
        >
            <div
                class="box-border flex flex-col flex-1 overflow-hidden  gap-y-1 lg:pr-16"
            >
                <!-- Asset type + Hierarchy bar -->
                <div class="flex items-center text-gray-500 gap-x-2">
                    <!-- <AssetLogo
                        v-if="showAssetTypeIcon"
                        :asset="item"
                        :selected="isSelected"
                    />

                    <HierarchyBar
                        v-if="projection?.includes('hierarchy')"
                        :selected-asset="item"
                    /> -->
                </div>

                <!-- Title bar -->
                <!-- <div
                    v-if="item.guid === '-1'"
                    class="flex flex-shrink mb-0 overflow-hidden text-base font-bold text-gray-700 truncate overflow-ellipsis whitespace-nowrap"
                >
                    <div>{{ item.displayText }}</div>
                    <AtlanIcon icon="Lock" class="ml-1 mt-0.5" />
                </div> -->
                <div class="flex items-center mb-0 overflow-hidden">
                    <router-link
                        to="/"
                        class="flex-shrink mb-0 mr-1 overflow-hidden font-bold truncate cursor-pointer  text-md text-primary hover:underline overflow-ellipsis whitespace-nowrap"
                    >
                        {{ title(item) }}
                    </router-link>

                    <CertificateBadge
                        :status="certificateStatus(item)"
                        :username="certificateUpdatedBy(item)"
                        :timestamp="certificateUpdatedAt(item)"
                    ></CertificateBadge>
                    <!-- <CertificatePopover :data="item" /> -->
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
                                class="h-4 mr-1 mb-0.5"
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
                        v-if="
                            [
                                'table',
                                'view',
                                'tablepartition',
                                'materialisedview',
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
                                    icon="Database"
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
                                <AtlanIcon icon="Schema" class="mr-1 mb-0.5" />
                                <div class="tracking-tight text-gray-500">
                                    {{ schemaName(item) }}
                                </div>
                            </div>
                            <template #title>
                                <span>Schema - {{ schemaName(item) }}</span>
                            </template>
                        </a-tooltip>
                    </div>
                    <div
                        v-if="item.typeName?.toLowerCase() === 'column'"
                        class="flex items-center gap-x-1"
                    >
                        <div class="flex">
                            <!-- <component
                                :is="dataTypeImage(item)"
                                class="w-auto h-4 text-gray-500"
                                style="margin-top: 1px"
                            ></component> -->

                            <component
                                :is="dataTypeCategoryImage(item)"
                                class="h-4 text-gray-500"
                            />
                            <span class="ml-1 text-sm text-gray-700">{{
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
                        <!-- <div v-if="item.attributes?.isPrimary" class="flex">
                            <AtlanIcon icon="PrimaryKey" />
                        </div> -->
                    </div>

                    <!-- Row/Col bar -->

                    <!-- <div
                        v-if="
                            getCombinedUsersAndGroups(item).length &&
                            ['table', 'view', 'tablepartition'].includes(
                                item.typeName.toLowerCase()
                            )
                        "
                        style="color: #c4c4c4"
                    >
                        •
                    </div> -->
                    <!-- Owner bar -->
                    <!-- <div
                        v-if="getCombinedUsersAndGroups(item).length"
                        class="flex items-center text-sm text-gray-500 gap-x-1"
                    >
                        <AtlanIcon icon="User" />
                        <span
                            v-html="
                                getTruncatedUsers(
                                    getCombinedUsersAndGroups(item),
                                    20
                                )
                            "
                        />
                    </div> -->
                </div>
                <!-- Description -->
                <!-- <div
                    v-if="
                        projection?.includes('description') &&
                        description(item)?.length
                    "
                    class="mt-2 mb-1 text-sm text-gray-500 truncate-overflow"
                    style="max-width: 80%"
                >
                    {{ description(item) }}
                </div> -->
                <!-- Classification and terms -->
                <!-- <template
                    v-if="
                        (projection?.includes('classifications') ||
                            projection?.includes('terms')) &&
                        (item.classificationNames?.length ||
                            item.meanings?.length)
                    "
                >
                    <ScrollStrip>
                        <Pill
                            v-for="clsf in item.classificationNames"
                            v-if="projection?.includes('classifications')"
                            class="flex-none"
                            :label="getClassificationDisplayname(clsf)"
                            :has-action="false"
                            :class="isSelected ? 'bg-white' : ''"
                        >
                            <template #prefix>
                                <AtlanIcon
                                    icon="Shield"
                                    class="
                                        text-pink-400
                                        group-hover:text-white
                                        h-3.5
                                        w-auto
                                    "
                                />
                            </template>
                        </Pill>
                        <Pill
                            v-for="clsf in item.meanings"
                            v-if="projection?.includes('terms')"
                            class="flex-none"
                            :label="clsf.displayText"
                            :has-action="false"
                            :class="isSelected ? 'bg-white' : ''"
                        >
                            <template #prefix>
                                <AtlanIcon
                                    icon="Term"
                                    class="text-gray h-3.5 w-auto"
                                />
                            </template>
                        </Pill>
                    </ScrollStrip>
                </template> -->
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

        <!-- <hr class="mx-4" :class="bulkSelectMode && isChecked ? 'hidden' : ''" /> -->
    </div>
</template>

<script lang="ts">
    // import HierarchyBar from '@common/badge/hierarchy.vue'
    // import StatusBadge from '@common/badge/status/index.vue'
    import { defineComponent, PropType } from 'vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import CertificateBadge from '@/common/badge/certificate/index.vue'
    // import Pill from '@/UI/pill/pill.vue'
    // import CertificatePopover from '~/components/common/certificatePopover.vue'
    // import ThreeDotMenu from '@/glossary/threeDotMenu/threeDotMenu.vue'

    // import AssetLogo from '@/common/icon/assetIcon.vue'
    // import { Components } from '~/api/atlas/client'
    // import useAssetInfo from '~/composables/asset/useAssetInfo'
    // import { assetInterface } from '~/types/assets/asset.interface'
    // import ScrollStrip from '@/UI/scrollStrip.vue'
    // import { useClassificationStore } from '~/components/admin/classifications/_store'

    export default defineComponent({
        name: 'AssetListItem',
        components: {
            CertificateBadge,
            // StatusBadge,
            // HierarchyBar,
            // AssetLogo,
            // Pill,
            // ThreeDotMenu,
            // ScrollStrip,
            // CertificatePopover,
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

            // function getTruncatedUsers(arr: string[], wordCount: number = 30) {
            //     const strSize: number[] = [0]
            //     let idx = 0
            //     arr.forEach((name) => {
            //         strSize.push(strSize[strSize.length - 1] + name.length)
            //     })

            //     // Check upto how long it is possible to display
            //     while (strSize[idx] < wordCount && idx < strSize.length) {
            //         idx += 1
            //     }
            //     // // Compenstion for the initial 0 in strSize
            //     idx -= 1

            //     /** The elements that would be displayed */
            //     const displayArray = arr.slice(0, idx)
            //     /** The elements that would be truncated as x other(s) */
            //     const truncated = arr.slice(idx)

            //     // Check if something needs to be truncated
            //     if (truncated.length) {
            //         // If there is only 1 element to be truncated then compare the
            //         // length of name and 'x others(s)'
            //         const lastElm =
            //             truncated.length === 1 &&
            //             truncated[0].length <
            //                 `${truncated.length} other(s)`.length
            //                 ? `${truncated[0]}`
            //                 : `${truncated.length} other(s)`

            //         return `${displayArray.join(', ')} and ${lastElm}`
            //     }
            //     // Check if everything can be directly displayed
            //     // If so then take the last element from array, append it with 'and'
            //     const lastElm = displayArray.pop()
            //     return displayArray.length
            //         ? `${displayArray.join(', ')} and ${lastElm}`
            //         : `${lastElm}`
            // }

            // function getCombinedUsersAndGroups(item: assetInterface) {
            //     return [...ownerUsers(item), ...ownerGroups(item)].filter(
            //         (name) => name.length
            //     )
            // }

            // const isColumnAsset = (asset) => assetType(asset) === 'Column'
            // const isQueryAsset = (asset) => assetType(asset) === 'Query'
            // const isQueryFolderAsset = (asset) =>
            //     assetType(asset) === 'QueryFolder'

            // const getColumnUrl = (asset) => {
            //     const tableGuid = asset?.attributes?.table?.guid
            //     return `/assets/${tableGuid}/overview?column=${asset.guid}`
            // }
            // const getQueryUrl = (asset) => {
            //     return `/insights?id=${asset.guid}`
            // }

            // function getClassificationDisplayname(name: string) {
            //     return useClassificationStore().getClasificationByName(name)
            //         ?.displayName
            // }

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
            }
        },
    })
</script>
