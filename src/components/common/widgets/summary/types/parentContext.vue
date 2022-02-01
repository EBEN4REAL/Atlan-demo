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
            <router-link
                :to="`/assets/${parentWorkspace(asset)?.guid}`"
                class="font-bold text-primary hover:underline"
                >{{ parentWorkspace(asset)?.attributes?.name }}</router-link
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
            <router-link
                :to="`/assets/${parentDataset(asset)?.guid}`"
                class="font-bold text-primary hover:underline"
                >{{ parentDataset(asset)?.attributes?.name }}</router-link
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
            <router-link
                :to="`/assets/${parentReport(asset)?.guid}`"
                class="font-bold text-primary hover:underline"
                >{{ parentReport(asset)?.attributes?.name }}</router-link
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
            <router-link
                :to="`/assets/${parentDashboard(asset)?.guid}`"
                class="font-bold text-primary hover:underline"
                >{{ parentDashboard(asset)?.attributes?.name }}</router-link
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
            <router-link
                :to="`/assets/${parentSite(asset)?.guid}`"
                class="font-bold text-primary hover:underline"
                >{{ parentSite(asset)?.attributes?.name }}</router-link
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
            <router-link
                :to="`/assets/${parentProject(asset)?.guid}`"
                class="font-bold text-primary hover:underline"
                >{{ parentProject(asset)?.attributes?.name }}</router-link
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
            <router-link
                :to="`/assets/${parentWorkbook(asset)?.guid}`"
                class="font-bold text-primary hover:underline"
                >{{ parentWorkbook(asset)?.attributes?.name }}</router-link
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
            <router-link
                :to="`/assets/${parentDatasource(asset)?.guid}`"
                class="font-bold text-primary hover:underline"
                >{{ parentDatasource(asset)?.attributes?.name }}</router-link
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
            <router-link
                :to="`/assets/${parentFolder(asset)?.guid}`"
                class="font-bold text-primary hover:underline"
                >{{ parentFolder(asset)?.attributes?.name }}</router-link
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
            <router-link
                :to="`/assets/${parentModel(asset)?.guid}`"
                class="font-bold text-primary hover:underline"
                >{{ parentModel(asset)?.attributes?.name }}</router-link
            >
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'

    // Composables
    import useAssetInfo from '~/composables/discovery/useAssetInfo'

    // Types
    import { assetInterface } from '~/types/assets/asset.interface'

    export default defineComponent({
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
            }
        },
    })
</script>
