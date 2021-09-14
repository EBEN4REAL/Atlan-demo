// Always match the exclude fields with these assettypes
// import { AssetTypeList } from '~/constant/assetType'
import { ref, computed, Ref } from 'vue'
import { assetInterface } from '~/types/assets/asset.interface'

// Keep adding pages here as and when required
type Page = 'nonBiOverview' | 'BiOverview'

interface TabList {
    name: string
    component: string
    icon: string
    visibleOn: Page[]
}

export default function useAssetDetailsTabList(
    page: Ref<string>,
    selectedAsset: Ref<assetInterface>
) {
    const tabList: TabList[] = [
        {
            name: 'Info',
            component: 'info',
            visibleOn: ['nonBiOverview', 'BiOverview'],
            icon: 'Overview',
        },

        {
            name: 'Activity',
            component: 'activity',
            visibleOn: ['BiOverview'],
            icon: 'Activity',
        },
        {
            name: 'Chat',
            component: 'chat',
            visibleOn: ['nonBiOverview', 'BiOverview'],
            icon: '',
        },
        // {
        //     name: 'Actions',
        //     component: 'actions',
        //     visibleOn: ['nonBiOverview', 'BiOverview'],
        // },

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
