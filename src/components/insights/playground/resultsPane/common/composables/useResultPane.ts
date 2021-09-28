import { Ref } from 'vue'
import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
import { useLocalStorageSync } from '~/components/insights/common/composables/useLocalStorageSync'

export function useResultPane(tabsArray: Ref<activeInlineTabInterface[]>) {
    const { syncInlineTabsInLocalStorage } = useLocalStorageSync()

    const resultsPaneTabChange = (
        resultPaneActiveKey: number,
        activeTab: activeInlineTabInterface
    ) => {
        const index = tabsArray.value.findIndex(
            (tab) => tab.key === activeTab.key
        )
        if (index !== -1) {
            tabsArray.value[index].playground.resultsPane.activeTab =
                resultPaneActiveKey
        }
        // syncying inline tabarray in localstorage
        syncInlineTabsInLocalStorage(tabsArray.value)
    }

    return {
        resultsPaneTabChange,
    }
}
