<!-- TODO: remove hardcoded prop classes and make component generic -->
<template>
    <div class="flex flex-col">
        <div class="flex items-start flex-1 px-3 py-3">
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
                    <router-link
                        :to="assetURL(item)"
                        class="flex-shrink mb-0 mr-1 overflow-hidden font-bold truncate cursor-pointer  text-md text-primary hover:underline overflow-ellipsis whitespace-nowrap"
                    >
                        {{ title(item) }}
                    </router-link>

                    <CertificateBadge
                        v-if="certificateStatus(item)"
                        :status="certificateStatus(item)"
                        :username="certificateUpdatedBy(item)"
                        :timestamp="certificateUpdatedAt(item)"
                        class="mb-0.5"
                    ></CertificateBadge>
                </div>

                <!-- Info bar -->
                <div class="flex items-center gap-x-2">
                    <div class="flex items-center mr-1">
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
                            {{ assetTypeLabel(item) || item.typeName }}
                        </div>
                    </div>

                    <div
                        v-if="
                            ['table', 'view', 'tablepartition'].includes(
                                item.typeName?.toLowerCase()
                            )
                        "
                        class="flex text-sm text-gray-500"
                    >
                        <a-tooltip placement="bottomLeft">
                            <span
                                v-if="
                                    ['table', 'tablepartition'].includes(
                                        item.typeName?.toLowerCase()
                                    ) && rowCount(item, false) !== '-'
                                "
                                class="mr-2 text-gray-500"
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
                            <!-- <component
                                :is="dataTypeImage(item)"
                                class="w-auto h-4 text-gray-500"
                                style="margin-top: 1px"
                            ></component> -->

                            <component
                                :is="dataTypeCategoryImage(item)"
                                class="h-4 text-gray-500 mt-0.5"
                            />
                            <span class="text-sm text-gray-500">{{
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
                                icon="PrimaryKey"
                                class="mb-0.5 text-yellow-500"
                            ></AtlanIcon>

                            <span
                                class="ml-1 text-sm text-gray-700"
                                v-if="isPrimary(item)"
                                >Primary</span
                            >
                            <span
                                class="ml-1 text-sm text-gray-700"
                                v-if="isDist(item)"
                                >Dist</span
                            >
                            <span
                                class="ml-1 text-sm text-gray-700"
                                v-if="isPartition(item)"
                                >Partition</span
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

                <div class="flex">
                    <span
                        class="text-xs text-gray-500"
                        v-if="preference?.display?.includes('description')"
                        >{{ description(item) }}</span
                    >
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    // import HierarchyBar from '@common/badge/hierarchy.vue'
    // import StatusBadge from '@common/badge/status/index.vue'
    import { defineComponent, PropType, toRefs } from 'vue'
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
            preference: {
                type: Object,
                required: false,
                default() {
                    return {}
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
        setup(props) {
            const { preference } = toRefs(props)

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
                description,
                assetTypeLabel,
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
            const assetURL = (asset) => {
                return {
                    path: `/assets/${asset.guid}`,
                }
            }

            // function getClassificationDisplayname(name: string) {
            //     return useClassificationStore().getClasificationByName(name)
            //         ?.displayName
            // }

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
                preference,
                assetTypeLabel,
                description,
            }
        },
    })
</script>
