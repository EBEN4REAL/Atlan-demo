// Always match the exclude fields with these assettypes
// import { AssetTypeList } from '~/constant/assetType'
import { computed, Ref } from 'vue'
import { assetInterface } from '~/types/assets/asset.interface'

// Keep adding pages here as and when required
type Page = 'discovery' | 'profile' | 'biOverview' | 'nonBiOverview'

interface TabList {
    name: string
    component: string
    icon: string
    visibleOn: Page[]
    exclude?: string[]
    tooltip: string
}

export default function useAssetDetailsTabList(
    page: Ref<string>,
    selectedAsset: Ref<assetInterface>
) {
    const tabList: TabList[] = [
        {
            name: 'Overview',
            component: 'info',
            visibleOn: ['discovery', 'profile', 'biOverview', 'nonBiOverview'],
            icon: 'Overview',
            tooltip: 'Overview',
        },
        {
            name: 'Custom Metadata',
            component: 'businessMetadataTab',
            visibleOn: ['discovery', 'profile', 'biOverview', 'nonBiOverview'],
            exclude: [
                'Query',
                'QueryFolder',
            ],
            icon: 'Metadata',
            tooltip: 'Custom metadata',
        },
        {
            name: 'Columns',
            component: 'columns',
            exclude: [
                'Column',
                'Query',
                'QueryFolder',
                'TableauWorkbook',
                'TableauWorksheet',
                'TableauSite',
                'TableauProject',
                'TableauDashboard',
                'TableauDatasource',
                'TableauDatasourceField',
                'TableauCalculatedField',
                'PowerBIWorkspace',
                'PowerBIDashboard',
                'PowerBITile',
                'PowerBIReport',
                'PowerBIPage',
                'PowerBIDataset',
                'PowerBIDatasource',
                'PowerBIDataflow',

            ],
            visibleOn: ['discovery', 'profile'],
            icon: 'Columns',
            tooltip: 'Columns',
        },
        {
            name: 'Activity',
            component: 'activity',
            visibleOn: ['discovery', 'profile', 'biOverview', 'nonBiOverview'],
            exclude: [
                'Query',
                'QueryFolder',
            ],
            icon: 'Activity',
            tooltip: 'Activity',
        },
        {
            name: 'Relations',
            component: 'relations',
            exclude: [
                'Connection',
                'Database',
                'Schema',
                'View',
                'Table',
                'TablePartition',
                'MaterialisedView',
                'Column',
            ],
            visibleOn: ['discovery'],
            icon: 'Relation',
            tooltip: 'Related Assets',
        },
        // {
        //     name: 'Chat',
        //     component: 'chat',
        //     visibleOn: ['biOverview', 'nonBiOverview'],
        //     icon: 'Chat',
        // },
        // {
        //     name: 'Actions',
        //     component: 'actions',
        //     visibleOn: ["discovery", "profile"],
        // },
        {
            name: 'Lineage',
            component: 'lineage',
            visibleOn: ['discovery'],
            exclude: [
                'Query',
                'QueryFolder',
            ],
            icon: 'Lineage',
            tooltip: 'Lineage',
        },
    ]

    const filteredTabs = computed(() => {
        if (selectedAsset.value.typeName)
            return tabList.filter(
                (tab) =>
                    !tab.exclude?.includes(selectedAsset.value.typeName) &&
                    tab.visibleOn.includes(page.value)
            )
        return tabList
    })

    return { allTabs: tabList, filteredTabs }
}
