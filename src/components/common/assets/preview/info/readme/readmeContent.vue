<template>
    <AtlanReadme
        v-model="localReadmeContent"
        class="flex flex-col bg-white border border-gray-200 rounded-lg"
        :is-editing-allowed="editPermission"
        :asset-type="readmeAsset.typeName"
        :handle-save="handleSave"
        :used-in-modal="true"
        :load-edit-mode="loadEditMode"
    >
        <template #assetInfo>
            <div class="flex items-start gap-x-3">
                <div
                    class="px-2 py-1.5 bg-white border rounded-md border-new-gray-300"
                >
                    <AtlanIcon
                        icon="Readme"
                        class="w-4 h-4 text-new-gray-600"
                    />
                </div>
                <div class="flex flex-col gap-y-2">
                    <span class="text-lg font-bold text-gray-700">Readme</span>
                    <div class="flex items-center">
                        <a-tooltip
                            v-if="connectorName(selectedAsset)"
                            placement="left"
                        >
                            <template #title>
                                <span>{{ connectorName(selectedAsset) }} </span>
                                <span v-if="connectionName(selectedAsset)">{{
                                    `/${connectionName(selectedAsset)}`
                                }}</span>
                            </template>
                            <img
                                :src="getConnectorImage(selectedAsset)"
                                class="h-4 mr-1 mb-0.5"
                            />
                        </a-tooltip>
                        <div
                            v-if="
                                ['column'].includes(
                                    selectedAsset.typeName?.toLowerCase()
                                )
                            "
                            class="flex items-center mr-1"
                        >
                            <component
                                :is="dataTypeCategoryImage(selectedAsset)"
                                class="h-4 mb-1 text-gray-500"
                            />
                        </div>

                        <div class="truncate max-w-300px text-new-gray-800">
                            {{ title(selectedAsset) }}
                        </div>

                        <div class="mx-2 dot"></div>

                        <div class="flex items-center mr-2">
                            <AtlanIcon
                                v-if="
                                    ['s3object', 's3bucket'].includes(
                                        selectedAsset.typeName?.toLowerCase()
                                    )
                                "
                                :icon="selectedAsset?.typeName"
                                class="self-center mr-1 text-gray-500 mb-0.5"
                            ></AtlanIcon>

                            <AtlanIcon
                                v-if="
                                    ['atlasglossarycategory'].includes(
                                        selectedAsset.typeName?.toLowerCase()
                                    )
                                "
                                icon="Category"
                                class="h-4 mr-1"
                            ></AtlanIcon>
                            <AtlanIcon
                                v-if="
                                    ['atlasglossaryterm'].includes(
                                        selectedAsset.typeName?.toLowerCase()
                                    )
                                "
                                icon="Term"
                                class="h-4 mr-1"
                            ></AtlanIcon>
                            <AtlanIcon
                                v-if="
                                    [
                                        'table',
                                        'view',
                                        'tablepartition',
                                        'materialisedview',
                                        'column',
                                        'schema',
                                        'query',
                                    ].includes(
                                        selectedAsset.typeName?.toLowerCase()
                                    )
                                "
                                :icon="
                                    assetTypeImage(selectedAsset) ||
                                    selectedAsset?.typeName
                                "
                                class="self-center mr-1 text-gray-500 mb-0.5"
                            ></AtlanIcon>

                            <div class="text-sm text-new-gray-800">
                                {{
                                    assetTypeLabel(selectedAsset) ||
                                    selectedAsset.typeName
                                }}
                                <span
                                    v-if="
                                        ['SalesforceObject'].includes(
                                            selectedAsset.typeName
                                        ) && isCustom(selectedAsset)
                                    "
                                    >(custom)</span
                                >
                                <span
                                    v-if="
                                        ['TableauDatasource'].includes(
                                            selectedAsset.typeName
                                        ) && isPublished(selectedAsset)
                                    "
                                    >(Published)</span
                                >
                            </div>
                        </div>

                        <div
                            v-if="
                                ['column'].includes(
                                    selectedAsset.typeName?.toLowerCase()
                                )
                            "
                            class="flex mr-2 text-sm text-gray-500 gap-x-2"
                        >
                            <a-tooltip
                                v-if="tableName(selectedAsset)"
                                placement="bottomLeft"
                            >
                                <div
                                    v-if="tableName(selectedAsset)"
                                    class="flex items-center text-gray-500"
                                >
                                    in
                                    <AtlanIcon
                                        v-if="
                                            parentTable(selectedAsset)
                                                ?.attributes?.certificateStatus
                                        "
                                        :icon="
                                            getEntityStatusIcon(
                                                'Table',
                                                parentTable(selectedAsset)
                                                    ?.attributes
                                                    ?.certificateStatus
                                            )
                                        "
                                        class="mr-1 ml-2 mb-0.5"
                                    />
                                    <AtlanIcon
                                        v-else
                                        icon="TableGray"
                                        class="mr-1 ml-2 mb-0.5"
                                    />
                                    <div
                                        class="tracking-tight truncate text-new-gray-800 max-w-300px"
                                    >
                                        {{ tableName(selectedAsset) }}
                                    </div>
                                </div>
                                <template #title>
                                    <span
                                        >Table -
                                        {{ tableName(selectedAsset) }}</span
                                    >
                                </template>
                            </a-tooltip>
                            <a-tooltip
                                v-if="viewName(selectedAsset)"
                                placement="bottomLeft"
                            >
                                <div
                                    v-if="viewName(selectedAsset)"
                                    class="flex items-center text-gray-500"
                                >
                                    in
                                    <AtlanIcon
                                        v-if="
                                            parentView(selectedAsset)
                                                ?.attributes?.certificateStatus
                                        "
                                        :icon="
                                            getEntityStatusIcon(
                                                'View',
                                                parentView(selectedAsset)
                                                    ?.attributes
                                                    ?.certificateStatus
                                            )
                                        "
                                        class="mr-1 ml-2 mb-0.5"
                                    />
                                    <AtlanIcon
                                        v-else
                                        icon="ViewGray"
                                        class="mr-1 ml-2 mb-0.5"
                                    />
                                    <div
                                        class="tracking-tight truncate text-new-gray-800 max-w-300px"
                                    >
                                        {{ viewName(selectedAsset) }}
                                    </div>
                                </div>
                                <template #title>
                                    <span
                                        >View -
                                        {{ viewName(selectedAsset) }}</span
                                    >
                                </template>
                            </a-tooltip>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </AtlanReadme>
</template>

<script lang="ts">
    import { defineComponent, ref, toRefs, PropType, inject } from 'vue'
    import { until } from '@vueuse/core'
    import { assetInterface } from '~/types/assets/asset.interface'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import updateAssetAttributes from '~/composables/discovery/updateAssetAttributes'
    import getEntityStatusIcon from '~/utils/getEntityStatusIcon'
    import AtlanReadme from '~/components/common/readme/index.vue'

    export default defineComponent({
        props: {
            readmeAsset: {
                type: Object as PropType<assetInterface>,
                required: false,
                default() {
                    return {}
                },
            },
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: false,
                default() {
                    return {}
                },
            },
            editPermission: {
                type: Boolean,
                required: false,
                default: false,
            },
            loadEditMode: {
                type: Boolean,
                required: false,
                default: false,
            },
        },
        components: {
            AtlanReadme,
        },

        setup(props) {
            const { readmeAsset } = toRefs(props)

            const {
                title,
                connectorName,
                connectionName,
                getConnectorImage,
                dataTypeCategoryImage,
                isCustom,
                isPublished,
                assetTypeImage,
                assetTypeLabel,
                tableName,
                viewName,
                parentTable,
                parentView,
            } = useAssetInfo()

            const isDrawer = inject('isDrawer')

            const { localReadmeContent, handleUpdateReadme, isLoading } =
                updateAssetAttributes(readmeAsset, isDrawer.value)

            const handleSave = (editorContent: string) => {
                handleUpdateReadme()
                return until(isLoading).toBe(false)
            }

            const readmeVisible = ref<boolean>(false)

            return {
                title,
                connectorName,
                connectionName,
                getConnectorImage,
                dataTypeCategoryImage,
                isCustom,
                isPublished,
                assetTypeImage,
                assetTypeLabel,
                tableName,
                viewName,
                parentTable,
                parentView,
                readmeVisible,
                localReadmeContent,
                handleSave,
                getEntityStatusIcon,
            }
        },
    })
</script>

<style lang="less" scoped>
    .max-w-300px {
        max-width: 300px;
    }

    .dot {
        height: 5px;
        width: 5px;
        @apply text-new-gray-300 inline-block rounded-full bg-new-gray-300;
    }
</style>
