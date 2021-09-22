import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'

const InsightsLocalStorageKeys = {
    inlinetabs: 'insights_inlinetabs',
    activeInlineTab: 'insights_active_inlinetab',
}
export function useLocalStorageSync() {
    function syncInlineTabsInLocalStorage(
        tabsArray: activeInlineTabInterface[]
    ) {
        // for not saving the querying data into the local storage
        const alteredTabsArray = tabsArray.map((tab) => {
            const t = { ...tab }
            t.playground.editor.dataList = []
            t.playground.editor.columnList = []
            return t
        })
        localStorage.setItem(
            InsightsLocalStorageKeys.inlinetabs,
            JSON.stringify(alteredTabsArray)
        )
    }
    function syncActiveInlineTabKeyInLocalStorage(activeInlineTabKey: string) {
        localStorage.setItem(
            InsightsLocalStorageKeys.activeInlineTab,
            activeInlineTabKey
        )
    }
    function getInlineTabsFromLocalStorage(): activeInlineTabInterface[] {
        if (localStorage.getItem(InsightsLocalStorageKeys.inlinetabs))
            return JSON.parse(
                localStorage.getItem(InsightsLocalStorageKeys.inlinetabs)
            )
        else return []
    }
    function getActiveInlineTabKeyFromLocalStorage() {
        if (localStorage.getItem(InsightsLocalStorageKeys.activeInlineTab))
            return localStorage.getItem(
                InsightsLocalStorageKeys.activeInlineTab
            )
        else return undefined
    }
    return {
        syncInlineTabsInLocalStorage,
        getInlineTabsFromLocalStorage,
        syncActiveInlineTabKeyInLocalStorage,
        getActiveInlineTabKeyFromLocalStorage,
    }
}
