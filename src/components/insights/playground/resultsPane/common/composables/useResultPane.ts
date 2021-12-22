import { Ref } from 'vue'
import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
import { useLocalStorageSync } from '~/components/insights/common/composables/useLocalStorageSync'
import { LINE_ERROR_NAMES } from '~/components/insights/common/constants'

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
    const isLineError = (activeInlineTab: Ref<activeInlineTabInterface>) => {
        const errorName =
            activeInlineTab.value?.playground?.resultsPane?.result
                ?.queryErrorObj?.errorName
        LINE_ERROR_NAMES.includes(errorName)
    }
    const haveLineNumber = (queryErrorObj) => {
        /* Line number for error*/
        if (queryErrorObj?.details?.line !== undefined) return true
        return false
    }

    return {
        haveLineNumber,
        isLineError,
        resultsPaneTabChange,
    }
}
