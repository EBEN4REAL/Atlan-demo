<!-- TODO: remove hardcoded prop classes and make component generic -->
<template>
    <div
        class="my-1 transition-all duration-300 hover:bg-primary-light"
        :class="isSelected ? 'outline-primary bg-primary-light shadow-sm' : ''"
        @click="handlePreview(item)"
    >
        <div
            class="flex flex-col"
            :class="[
                !bulkSelectMode && isSelected
                    ? 'border-primary bg-primary-light'
                    : 'bg-white border-transparent',
                bulkSelectMode && isChecked ? 'bg-primary-light' : '',
            ]"
        >
            <div class="flex items-start flex-1 px-3 py-3">
                <a-checkbox
                    v-if="showCheckBox"
                    :checked="isChecked"
                    class="ml-2 mr-3 opacity-60 hover:opacity-100"
                    :class="bulkSelectMode ? 'opacity-100' : 'opacity-0'"
                    @click.stop
                    @change="(e) => $emit('listItem:check', e, item)"
                />
                <div class="flex flex-col flex-1 lg:pr-16">
                    <div class="flex items-center overflow-hidden">
                        <div
                            v-if="
                                ['column'].includes(
                                    item.typeName?.toLowerCase()
                                )
                            "
                            class="flex items-center mr-1"
                        >
                            <component
                                :is="dataTypeCategoryImage(item)"
                                class="h-4 mb-1 text-gray-500"
                            />
                        </div>
                        <AtlanIcon
                            v-if="
                                ['atlasglossarycategory'].includes(
                                    item.typeName?.toLowerCase()
                                )
                            "
                            icon="Category"
                            class="h-4 mb-0.5 mr-1"
                        ></AtlanIcon>
                        <AtlanIcon
                            v-if="
                                ['atlasglossaryterm'].includes(
                                    item.typeName?.toLowerCase()
                                )
                            "
                            icon="Term"
                            class="h-4 mb-0.5 mr-1"
                        ></AtlanIcon>

                        <router-link
                            :to="assetURL(item)"
                            class="flex-shrink mb-0 mr-1 overflow-hidden font-bold truncate cursor-pointer text-md text-primary hover:underline overflow-ellipsis whitespace-nowrap"
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

                    <div v-if="description(item)" class="flex mt-0.5">
                        <span
                            v-if="preference?.display?.includes('description')"
                            class="text-xs text-gray-500"
                            >{{ description(item) }}</span
                        >
                    </div>

                    <!-- Info bar -->
                    <div class="flex flex-wrap items-center mt-1">
                        <div class="flex items-center mr-2">
                            <a-tooltip
                                v-if="connectorName(item)"
                                placement="left"
                            >
                                <template #title>
                                    <span>{{ connectorName(item) }} </span>
                                    <span v-if="connectionName(item)">{{
                                        `/${connectionName(item)}`
                                    }}</span>
                                </template>
                                <img
                                    :src="getConnectorImage(item)"
                                    class="h-3 mr-1 mb-0.5"
                                />
                            </a-tooltip>

                            <AtlanIcon
                                v-if="
                                    ['atlasglossarycategory'].includes(
                                        item.typeName?.toLowerCase()
                                    )
                                "
                                icon="Category"
                                class="h-4 mb-0.5 mr-1"
                            ></AtlanIcon>
                            <AtlanIcon
                                v-if="
                                    ['atlasglossaryterm'].includes(
                                        item.typeName?.toLowerCase()
                                    )
                                "
                                icon="Term"
                                class="h-4 mb-0.5 mr-1"
                            ></AtlanIcon>

                            <div
                                class="text-sm tracking-wider text-gray-500 uppercase"
                            >
                                {{ assetTypeLabel(item) || item.typeName }}
                            </div>
                        </div>

                        <div class="flex items-center">
                            <div
                                v-if="categories(item)?.length > 0"
                                class="flex items-center mr-3 text-sm text-gray-500 gap-x-1"
                            >
                                in
                                <div
                                    v-for="(cat, index) in categories(item)"
                                    v-if="
                                        ['atlasglossaryterm'].includes(
                                            item.typeName?.toLowerCase()
                                        )
                                    "
                                    :key="cat.guid"
                                    class="flex"
                                >
                                    <AtlanIcon
                                        icon="Category"
                                        class="h-4 mt-0.5 mr-1"
                                    ></AtlanIcon>
                                    {{ cat.attributes?.name }}
                                    <span
                                        v-if="
                                            index ===
                                                categories(item).length - 2 &&
                                            categories(item).length > 1
                                        "
                                        class="ml-1"
                                    >
                                        and
                                    </span>
                                    <span
                                        v-else-if="
                                            index !==
                                            categories(item).length - 1
                                        "
                                        >,</span
                                    >
                                </div>
                            </div>
                            <div
                                v-if="parentCategory(item)"
                                class="flex items-center mr-3 text-sm text-gray-500 gap-x-1"
                            >
                                in
                                <div
                                    v-if="
                                        ['atlasglossarycategory'].includes(
                                            item.typeName?.toLowerCase()
                                        )
                                    "
                                    :key="parentCategory(item).guid"
                                    class="flex"
                                >
                                    <AtlanIcon
                                        icon="Category"
                                        class="h-4 mt-0.5 mr-1"
                                    ></AtlanIcon>
                                    {{ parentCategory(item).attributes?.name }}
                                </div>
                            </div>
                            <div
                                v-if="isGTC(item)"
                                class="flex items-center text-sm text-gray-500"
                            >
                                <AtlanIcon
                                    icon="Glossary"
                                    class="h-4 mr-1"
                                ></AtlanIcon>
                                {{ getAnchorName(item) }}
                            </div>
                        </div>

                        <div
                            v-if="
                                ['table', 'view', 'tablepartition'].includes(
                                    item.typeName?.toLowerCase()
                                )
                            "
                            class="flex mr-2 text-sm text-gray-500"
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
                                        class="font-semibold tracking-tight text-gray-500"
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
                                    class="font-semibold tracking-tight text-gray-500"
                                    >{{ columnCount(item, false) }}</span
                                >
                                Cols</span
                            >
                        </div>

                        <div
                            v-if="
                                ['database'].includes(
                                    item.typeName?.toLowerCase()
                                )
                            "
                            class="flex mr-2 text-sm text-gray-500"
                        >
                            <div class="flex items-center text-gray">
                                <img
                                    :src="getConnectorImage(item)"
                                    class="h-3 mr-1 mb-0.5"
                                />
                                <span>{{
                                    `${connectorName(item)}/${connectionName(
                                        item
                                    )}`
                                }}</span>
                            </div>
                        </div>

                        <div
                            v-if="item.typeName?.toLowerCase() === 'column'"
                            class="flex items-center mr-2"
                        >
                            <div class="flex items-center">
                                <!-- <component
                                :is="dataTypeImage(item)"
                                class="w-auto h-4 text-gray-500"
                                style="margin-top: 1px"
                            ></component> -->

                                <component
                                    :is="dataTypeCategoryImage(item)"
                                    class="h-4 text-gray-500 mr-0.5 mb-0.5"
                                />
                                <span
                                    class="text-sm tracking-wider text-gray-500"
                                    >{{ dataType(item) }}</span
                                >
                            </div>
                            <div
                                v-if="
                                    isPrimary(item) ||
                                    isDist(item) ||
                                    isPartition(item)
                                "
                                class="flex"
                            >
                                <AtlanIcon
                                    icon="PrimaryKey"
                                    class="mb-0.5 text-yellow-500"
                                ></AtlanIcon>

                                <span
                                    v-if="isPrimary(item)"
                                    class="ml-1 text-sm text-gray-700"
                                    >Primary</span
                                >
                                <span
                                    v-if="isDist(item)"
                                    class="ml-1 text-sm text-gray-700"
                                    >Dist</span
                                >
                                <span
                                    v-if="isPartition(item)"
                                    class="ml-1 text-sm text-gray-700"
                                    >Partition</span
                                >
                            </div>
                        </div>
                        <div
                            v-if="
                                ['column'].includes(
                                    item.typeName?.toLowerCase()
                                )
                            "
                            class="flex mr-2 text-sm text-gray-500 gap-x-2"
                        >
                            <a-tooltip
                                v-if="tableName(item)"
                                placement="bottomLeft"
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
                            <a-tooltip
                                v-if="viewName(item)"
                                placement="bottomLeft"
                            >
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
                            class="flex flex-wrap text-sm text-gray-500 gap-x-2"
                        >
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
                            <a-tooltip placement="bottomLeft">
                                <div
                                    v-if="databaseName(item)"
                                    class="flex items-center text-gray-500"
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
                                    <span
                                        >Database -
                                        {{ databaseName(item) }}</span
                                    >
                                </template>
                            </a-tooltip>
                        </div>
                    </div>

                    <div
                        v-if="
                            list.length > 0 &&
                            preference?.display?.includes('classifications')
                        "
                        class="flex flex-wrap mt-1 gap-x-1"
                    >
                        <template
                            v-for="classification in list"
                            :key="classification.guid"
                        >
                            <PopoverClassification
                                :classification="classification"
                            >
                                <ClassificationPill
                                    :name="classification.name"
                                    :display-name="classification?.displayName"
                                    :is-propagated="
                                        isPropagated(classification)
                                    "
                                    :allow-delete="false"
                                ></ClassificationPill>
                            </PopoverClassification>
                        </template>
                    </div>
                </div>
            </div>
        </div>
        <hr class="mx-4" :class="bulkSelectMode && isChecked ? 'hidden' : ''" />
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, toRefs, computed } from 'vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import CertificateBadge from '@/common/badge/certificate/index.vue'
    import useTypedefData from '~/composables/typedefs/useTypedefData'
    import { mergeArray } from '~/utils/array'
    import ClassificationPill from '@/common/pills/classification.vue'
    import PopoverClassification from '@/common/popover/classification.vue'

    export default defineComponent({
        name: 'AssetListItem',
        components: {
            CertificateBadge,
            ClassificationPill,
            PopoverClassification,
        },
        props: {
            item: {
                type: Object,
                required: false,
                default() {
                    return {}
                },
            },
            selectedGuid: {
                type: String,
                required: false,
                default() {
                    return ''
                },
            },

            isChecked: {
                type: Boolean,
                required: false,
                default: () => false,
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
            preference: {
                type: Object,
                required: false,
                default() {
                    return {}
                },
            },
            showThreeDotMenu: {
                type: Boolean,
                required: false,
                default: false,
            },
            noBg: {
                type: Boolean,
                required: false,
                default: false,
            },
        },
        emits: ['listItem:check', 'unlinkAsset', 'preview'],
        setup(props, { emit }) {
            const {
                preference,
                selectedGuid,
                item,
                isChecked,
                showCheckBox,
                bulkSelectMode,
            } = toRefs(props)
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
                getAnchorName,
                isGTC,
                categories,
                parentCategory,
                classifications,
            } = useAssetInfo()

            const assetURL = (asset) => ({
                path: `/assets/${asset.guid}`,
            })

            const handlePreview = (item: any) => {
                emit('preview', item)
            }

            const isSelected = computed(() => {
                if (selectedGuid.value === item?.value?.guid) {
                    return true
                }
                return false
            })

            const { classificationList } = useTypedefData()

            const isPropagated = (classification) => {
                if (!item?.value?.guid?.value) {
                    return false
                }
                if (item?.value?.guid === classification.entityGuid) {
                    return false
                }
                return true
            }

            const list = computed(() => {
                const { matchingIdsResult } = mergeArray(
                    classificationList.value,
                    classifications(item.value),
                    'name',
                    'typeName'
                )
                return matchingIdsResult
            })

            return {
                isChecked,
                showCheckBox,
                bulkSelectMode,
                item,
                isSelected,
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
                handlePreview,
                isGTC,
                getAnchorName,
                categories,
                parentCategory,
                isPropagated,
                list,
                classifications,
            }
        },
    })
</script>
