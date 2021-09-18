import { Ref } from 'vue'
import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
import { useLocalStorageSync } from './useLocalStorageSync'
import { tableInterface } from '~/types/insights/table.interface'

export function useAssetSidebar(
    tabsArray: Ref<activeInlineTabInterface[]>,
    activeInlineTab: Ref<activeInlineTabInterface>
) {
    const { syncInlineTabsInLocalStorage } = useLocalStorageSync()

    const closeAssetSidebar = (activeTab: activeInlineTabInterface) => {
        console.log(activeTab, tabsArray)
        const index = tabsArray.value.findIndex(
            (tab) => tab.key === activeTab.key
        )
        if (index !== -1) {
            tabsArray.value[index].assetSidebar.isVisible = false
            tabsArray.value[index].assetSidebar.title = ''
            tabsArray.value[index].assetSidebar.id = ''
        }
        console.log(tabsArray, 'tabsArray')
        // syncying inline tabarray in localstorage
        syncInlineTabsInLocalStorage(tabsArray.value)
    }

    const openAssetSidebar = (table: tableInterface) => {
        if (activeInlineTab.value) {
            const index = tabsArray.value.findIndex(
                (tab) => tab.key === activeInlineTab.value?.key
            )
            if (index !== -1) {
                tabsArray.value[index].assetSidebar.isVisible = true
                tabsArray.value[index].assetSidebar.title = table.label
                tabsArray.value[index].assetSidebar.id = table.id
                // syncying inline tabarray in localstorage
                syncInlineTabsInLocalStorage(tabsArray.value)
            }
        }
    }
    return {
        closeAssetSidebar,
        openAssetSidebar,
    }
}
