<template>
    <div class="flex flex-wrap gap-x-16 gap-y-3">
        <div
            v-if="
                [
                    'PowerBIDataset',
                    'PowerBIDataflow',
                    'PowerBIReport',
                    'PowerBIDashboard',
                ].includes(asset?.typeName) && parentWorkspace(asset)?.guid
            "
            class="flex flex-col text-sm"
        >
            <span class="mb-1 text-sm text-gray-500">Workspace</span>
            <span
                class="font-bold cursor-pointer text-primary hover:underline"
                @click="handleOpenDrawer(parentWorkspace(asset)?.guid)"
                >{{ parentWorkspace(asset)?.attributes?.name }}</span
            >
        </div>
        <div
            v-if="
                ['PowerBIDatasource'].includes(asset?.typeName) &&
                parentDataset(asset)?.guid
            "
            class="flex flex-col text-sm"
        >
            <span class="mb-1 text-sm text-gray-500">Dataset</span>
            <span
                class="font-bold cursor-pointer text-primary hover:underline"
                @click="handleOpenDrawer(parentDataset(asset)?.guid)"
                >{{ parentDataset(asset)?.attributes?.name }}</span
            >
        </div>
        <div
            v-if="
                ['PowerBIPage'].includes(asset?.typeName) &&
                parentReport(asset)?.guid
            "
            class="flex flex-col text-sm"
        >
            <span class="mb-1 text-sm text-gray-500">Report</span>
            <span
                class="font-bold cursor-pointer text-primary hover:underline"
                @click="handleOpenDrawer(parentReport(asset)?.guid)"
                >{{ parentReport(asset)?.attributes?.name }}</span
            >
        </div>

        <div
            v-if="
                ['PowerBITile', 'LookerTile'].includes(asset?.typeName) &&
                parentDashboard(asset)?.guid
            "
            class="flex flex-col text-sm"
        >
            <span class="mb-1 text-sm text-gray-500">Dashboard</span>
            <span
                class="font-bold cursor-pointer text-primary hover:underline"
                @click="handleOpenDrawer(parentDashboard(asset)?.guid)"
                >{{ parentDashboard(asset)?.attributes?.name }}</span
            >
        </div>
        <div
            v-if="
                ['TableauProject'].includes(asset?.typeName) &&
                parentSite(asset)?.guid
            "
            class="flex flex-col text-sm"
        >
            <span class="mb-1 text-sm text-gray-500">Site</span>
            <span
                class="font-bold cursor-pointer text-primary hover:underline"
                @click="handleOpenDrawer(parentSite(asset)?.guid)"
                >{{ parentSite(asset)?.attributes?.name }}</span
            >
        </div>
        <div
            v-if="
                [
                    'TableauWorkbook',
                    'TableauFlow',
                    'TableauMetric',
                    'TableauDatasource',
                    'LookerModel',
                    'LookerExplore',
                    'LookerField',
                ].includes(asset?.typeName) && parentProject(asset)?.guid
            "
            class="flex flex-col text-sm"
        >
            <span class="mb-1 text-sm text-gray-500">Project</span>
            <span
                class="font-bold cursor-pointer text-primary hover:underline"
                @click="handleOpenDrawer(parentProject(asset)?.guid)"
                >{{ parentProject(asset)?.attributes?.name }}</span
            >
        </div>
        <div
            v-if="
                [
                    'TableauWorksheet',
                    'TableauDashboard',
                    'TableauDatasource',
                ].includes(asset?.typeName) && parentWorkbook(asset)?.guid
            "
            class="flex flex-col text-sm"
        >
            <span class="mb-1 text-sm text-gray-500">Workbook</span>
            <span
                class="font-bold cursor-pointer text-primary hover:underline"
                @click="handleOpenDrawer(parentWorkbook(asset)?.guid)"
                >{{ parentWorkbook(asset)?.attributes?.name }}</span
            >
        </div>
        <div
            v-if="
                ['TableauCalculatedField', 'TableauDatasourceField'].includes(
                    asset?.typeName
                ) && parentDatasource(asset)?.guid
            "
            class="flex flex-col text-sm"
        >
            <span class="mb-1 text-sm text-gray-500">Datasource</span>
            <span
                class="font-bold cursor-pointer text-primary hover:underline"
                @click="handleOpenDrawer(parentDatasource(asset)?.guid)"
                >{{ parentDatasource(asset)?.attributes?.name }}</span
            >
        </div>
        <div
            v-if="
                ['LookerDashboard', 'LookerLook'].includes(asset?.typeName) &&
                parentFolder(asset)?.guid
            "
            class="flex flex-col text-sm"
        >
            <span class="mb-1 text-sm text-gray-500">Folder</span>
            <span
                class="font-bold cursor-pointer text-primary hover:underline"
                @click="handleOpenDrawer(parentFolder(asset)?.guid)"
                >{{ parentFolder(asset)?.attributes?.name }}</span
            >
        </div>
        <div
            v-if="
                ['LookerLook', 'LookerExplore', 'LookerField'].includes(
                    asset?.typeName
                ) && parentModel(asset)?.guid
            "
            class="flex flex-col text-sm"
        >
            <span class="mb-1 text-sm text-gray-500">Model</span>
            <span
                class="font-bold cursor-pointer text-primary hover:underline"
                @click="handleOpenDrawer(parentModel(asset)?.guid)"
                >{{ parentModel(asset)?.attributes?.name }}</span
            >
        </div>
        <div
            v-if="
                [
                    'SalesforceDashboard',
                    'SalesforceReport',
                    'SalesforceObject',
                ].includes(asset?.typeName) && parentOrganization(asset)?.guid
            "
            class="flex flex-col text-sm"
        >
            <span class="mb-1 text-sm text-gray-500">Organization</span>
            <span
                class="font-bold cursor-pointer text-primary hover:underline"
                @click="handleOpenDrawer(parentOrganization(asset)?.guid)"
                >{{ parentOrganization(asset)?.attributes?.name }}</span
            >
        </div>
        <div
            v-if="
                ['SalesforceField'].includes(asset?.typeName) &&
                parentObject(asset)?.guid
            "
            class="flex flex-col text-sm"
        >
            <span class="mb-1 text-sm text-gray-500">Parent Object</span>
            <span
                class="font-bold cursor-pointer text-primary hover:underline"
                @click="handleOpenDrawer(parentObject(asset)?.guid)"
                >{{ parentObject(asset)?.attributes?.name }}</span
            >
        </div>
        <div
            v-if="
                ['LookerExplore'].includes(asset?.typeName) &&
                parentModel(asset)?.guid
            "
            class="flex flex-col text-sm"
        >
            <span class="mb-1 text-gray-500">View Name</span>
            <span class="text-gray-700">{{ asset?.attributes?.viewName }}</span>
        </div>

        <!-- SQL Parent Context -->
        <div
            v-if="
                ['Schema'].includes(asset?.typeName) &&
                parentDatabase(asset)?.guid
            "
            class="flex flex-col text-sm"
        >
            <span class="mb-1 text-sm text-gray-500">Database</span>
            <span
                class="font-bold cursor-pointer text-primary hover:underline"
                @click="handleOpenDrawer(parentDatabase(asset)?.guid)"
                >{{ parentDatabase(asset)?.attributes?.name }}</span
            >
        </div>
        <div
            v-if="
                [
                    'Table',
                    'View',
                    'MaterialisedView',
                    'TablePartition',
                ].includes(asset?.typeName) && parentSchema(asset)?.guid
            "
            class="flex flex-col text-sm"
        >
            <span class="mb-1 text-sm text-gray-500">Schema</span>
            <span
                class="font-bold cursor-pointer text-primary hover:underline"
                @click="handleOpenDrawer(parentSchema(asset)?.guid)"
                >{{ parentSchema(asset)?.attributes?.name }}</span
            >
        </div>
        <div
            v-if="
                ['ColumnProcess', 'BIProcess'].includes(asset?.typeName) &&
                parentProcess(asset)?.guid
            "
            class="flex flex-col text-sm"
        >
            <span class="mb-1 text-sm text-gray-500">Parent Process</span>
            <span
                class="font-bold cursor-pointer text-primary hover:underline"
                @click="handleOpenDrawer(parentProcess(asset)?.guid)"
                >{{ parentProcess(asset)?.attributes?.name }}</span
            >
        </div>
        <div
            v-if="
                ['S3Object'].includes(asset?.typeName) &&
                parentBucket(asset)?.guid
            "
            class="flex flex-col text-sm"
        >
            <span class="mb-1 text-sm text-gray-500">Bucket</span>
            <span
                class="font-bold cursor-pointer text-primary hover:underline"
                @click="handleOpenDrawer(parentBucket(asset)?.guid)"
                >{{ parentBucket(asset)?.attributes?.name }}</span
            >
        </div>
    </div>
    <AssetDrawer
        :show-drawer="drawerVisible"
        :guid="guidToFetch"
        @closeDrawer="handleCloseDrawer"
    />
</template>

<script lang="ts">
    import { defineComponent, PropType, ref } from 'vue'
    import AssetDrawer from '@/common/assets/preview/drawer.vue'

    // Composables
    import useAssetInfo from '~/composables/discovery/useAssetInfo'

    // Types
    import { assetInterface } from '~/types/assets/asset.interface'

    export default defineComponent({
        components: { AssetDrawer },
        props: {
            asset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        setup() {
            const {
                parentWorkspace,
                parentDataset,
                parentFolder,
                parentModel,
                parentProject,
                parentDatasource,
                parentSite,
                parentWorkbook,
                parentReport,
                parentDashboard,
                parentDatabase,
                parentSchema,
                parentOrganization,
                parentObject,
                parentProcess,
                parentBucket,
            } = useAssetInfo()

            const drawerVisible = ref(false)
            const guidToFetch = ref('')

            const handleOpenDrawer = (guid) => {
                drawerVisible.value = true
                guidToFetch.value = guid
            }

            const handleCloseDrawer = () => {
                drawerVisible.value = false
                guidToFetch.value = ''
            }

            return {
                parentWorkspace,
                parentDataset,
                parentFolder,
                parentModel,
                parentProject,
                parentDatasource,
                parentSite,
                parentWorkbook,
                parentReport,
                parentDashboard,
                parentDatabase,
                parentSchema,
                parentOrganization,
                parentObject,
                parentProcess,
                parentBucket,
                guidToFetch,
                drawerVisible,
                handleCloseDrawer,
                handleOpenDrawer,
            }
        },
    })
</script>
