import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'

const InsightsLocalStorageKeys = {
    inlinetabs: 'insights_inlinetabs',
    activeInlineTab: 'insights_active_inlinetab',
}
export function useLocalStorageSync() {
    function syncInlineTabsInLocalStorage(
        tabsArray: activeInlineTabInterface[]
    ) {
        localStorage.setItem(
            InsightsLocalStorageKeys.inlinetabs,
            JSON.stringify(tabsArray)
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
