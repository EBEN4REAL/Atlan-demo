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
            name: 'Runs',
            component: 'runs',
            visibleOn: ['discovery', 'profile', 'biOverview', 'nonBiOverview'],
            icon: 'Activity',
            tooltip: 'Runs',
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
