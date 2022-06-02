<template>
    <div>
        <div class="">
            <a-tooltip v-if="connectorName(asset)" placement="left">
                <template #title>
                    <span>{{ connectorName(asset) }} </span>
                    <span v-if="connectionName(asset)">{{
                        `/${connectionName(asset)}`
                    }}</span>
                </template>
                <img :src="getConnectorImage(asset)" class="h-4 mr-1 mb-0.5" />
            </a-tooltip>
            <div
                v-if="['column'].includes(asset.typeName?.toLowerCase())"
                class="flex items-center mr-1"
            >
                <component
                    :is="dataTypeCategoryImage(asset)"
                    class="h-4 mb-1 text-gray-500"
                />
            </div>
        </div>
        <div class="">
            <span>
                <Tooltip
                    :tooltip-text="`${title(asset)}`"
                    :route-to="getProfilePath(asset)"
                    :classes="
                        isScrubbed(asset)
                            ? 'text-md mb-0  font-semibold cursor-pointer text-primary hover:underline opacity-80 tracking-wide'
                            : 'text-md font-bold mb-0 cursor-pointer text-primary hover:underline tracking-wide '
                    "
                    :should-open-in-new-tab="true"
                    @click="(e) => e.stopPropagation()"
                />
            </span>
            <div class="">
                <ReadOnly :attribute="a" />
            </div>
            <span>technicalengineer</span>
        </div>
        <div class="">clear</div>
    </div>
</template>

<script setup lang="ts">

        const props = defineProps({
           visible: {
               type: Boolean,
               required: true,
           },
           linkedAssets: {
               type: Object,
               required: true,
           },
           assetCount: {
               type: Number,
               required: true,
           },
           metadata: {
               type: Object,
               required: true,
           },
       })


         selectedAsset: {
                   type: Object as PropType<assetInterface>,
                   required: true,
               },
    const applicableList = ref(
                   getApplicableAttributes(
                       metadata.value,
                       selectedAsset.value.typeName
                   )
               )

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
           getProfilePath,
           isUserDescription,
           isScrubbed,
           meaningRelationships,
           meanings,
           parentWorkspace,
           parentReport,
           parentDashboard,
           parentDataset,
           reportCount,
           dashboardCount,
           datasetCount,
           dataflowCount,
           tileCount,
           pageCount,
           parentProject,
           parentDatasource,
           parentWorkbook,
           parentSite,
           parentOrganization,
           parentObject,
           sourceViewCount,
           sourceChildCount,
           fieldCount,
           s3ObjectCount,
           isCustom,
           announcementType,
           assetTypeImage,
           isPublished,
           databaseQualifiedName,
           schemaQualifiedName,
           connectionQualifiedName,
           parentTable,
           parentView,
           s3BucketName,
       } = useAssetInfo()
</script>

<style scoped></style>
