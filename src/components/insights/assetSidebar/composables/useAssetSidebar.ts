import { Ref, ComputedRef } from 'vue'
import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
import { useLocalStorageSync } from '~/components/insights/common/composables/useLocalStorageSync'
import { tableInterface } from '~/types/insights/table.interface'

export function useAssetSidebar(
    tabsArray: Ref<activeInlineTabInterface[]>,
    activeInlineTab: ComputedRef<activeInlineTabInterface>
) {
    const { syncInlineTabsInLocalStorage } = useLocalStorageSync()

    const closeAssetSidebar = (activeTab: activeInlineTabInterface) => {
        const index = tabsArray.value.findIndex(
            (tab) => tab.key === activeTab.key
        )
        if (index !== -1) {
            tabsArray.value[index].assetSidebar.isVisible = false
            tabsArray.value[index].assetSidebar.title = ''
            tabsArray.value[index].assetSidebar.id = ''
        }
        // syncying inline tabarray in localstorage
        syncInlineTabsInLocalStorage(tabsArray.value)
    }

    const openAssetSidebar = (activeInlineTabCopy: any, pos: string) => {
        switch (pos) {
            case 'not_editor': {
                if (activeInlineTab.value) {
                    const index = tabsArray.value.findIndex(
                        (tab) => tab.key === activeInlineTab.value?.key
                    )
                    const t = activeInlineTabCopy.assetSidebar
                    t.openingPos = 'not_editor'
                    if (index !== -1) {
                        tabsArray.value[index].assetSidebar = t
                        // syncying inline tabarray in localstorage
                        syncInlineTabsInLocalStorage(tabsArray.value)
                    }
                }
            }
            case 'default': {
                if (activeInlineTab.value) {
                    const index = tabsArray.value.findIndex(
                        (tab) => tab.key === activeInlineTab.value?.key
                    )
                    const t = activeInlineTabCopy.assetSidebar
                    t.openingPos = 'editor'
                    if (index !== -1) {
                        tabsArray.value[index].assetSidebar =
                            activeInlineTabCopy.assetSidebar
                        // syncying inline tabarray in localstorage
                        syncInlineTabsInLocalStorage(tabsArray.value)
                    }
                }
            }
        }
    }

    return {
        closeAssetSidebar,
        openAssetSidebar,
    }
}
