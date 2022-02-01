<template>
    <div class="flex gap-x-16">
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
                ['PowerBITile'].includes(asset?.typeName) &&
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
                ['LookerLook'].includes(asset?.typeName) &&
                parentModel(asset)?.guid
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
                guidToFetch,
                drawerVisible,
                handleCloseDrawer,
                handleOpenDrawer,
            }
        },
    })
</script>
