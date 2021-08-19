// Always match the exclude fields with these assettypes
// import { AssetTypeList } from '~/constant/assetType'
import { ref, computed } from 'vue'
type tabList = {
    name: string
    component: string
    exclude?: string[]
}
export default function useAssetDetailsTabList() {
    const assetType = ref('')
    const tabList: tabList[] = [
        {
            name: 'Info',
            component: 'info',
        },
        {
            name: 'Columns',
            component: 'columns',
            exclude: ['Column'],
        },
        {
            name: 'Activity',
            component: 'activity',
        },
        {
            name: 'Relations',
            component: 'relations',
        },
        {
            name: 'Chat',
            component: 'chat',
        },
        {
            name: 'Actions',
            component: 'actions',
        },
        {
            name: 'Lineage',
            component: 'lineage',
        },
    ]

    const filteredTabs = computed(() => {
        if (assetType.value)
            return tabList.filter(
                (tab) => !tab.exclude?.includes(assetType.value)
            )
        return tabList
    })

    return { allTabs: tabList, filteredTabs, assetType }
}
