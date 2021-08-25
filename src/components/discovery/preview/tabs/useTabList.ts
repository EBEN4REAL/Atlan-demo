// Always match the exclude fields with these assettypes
// import { AssetTypeList } from '~/constant/assetType'
import { ref, computed, Ref } from 'vue'

// Keep adding pages here as and when required
type Page = 'discovery' | 'profile'

interface TabList {
    name: string
    component: string
    visibleOn: Page[]
    exclude?: string[]
}

export default function useAssetDetailsTabList(page: Ref<string>) {
    const assetType = ref('')
    const tabList: TabList[] = [
        {
            name: 'Info',
            component: 'info',
            visibleOn: ['discovery', 'profile'],
        },
        {
            name: 'Columns',
            component: 'columns',
            exclude: [
                'Column',
                'TableauWorkbook',
                'TableauWorksheet',
                'TableauSite',
                'TableauProject',
                'TableauDashboard',
                'TableauDatasource',
            ],
            visibleOn: ['discovery', 'profile'],
        },
        {
            name: 'Activity',
            component: 'activity',
            visibleOn: ['discovery', 'profile'],
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
        },
        // {
        //     name: 'Chat',
        //     component: 'chat',
        //     visibleOn: ["discovery", "profile"],
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
        },
    ]

    const filteredTabs = computed(() => {
        if (assetType.value)
            return tabList.filter(
                (tab) =>
                    !tab.exclude?.includes(assetType.value) &&
                    tab.visibleOn.includes(page.value)
            )
        return tabList
    })

    return { allTabs: tabList, filteredTabs, assetType }
}
