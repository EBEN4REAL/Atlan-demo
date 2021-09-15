import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'

const InsightsLocalStorageKeys = {
    inlinetabs: 'insights_inlinetabs',
    activeInlineTab: 'insights_active_inlinetab',
}
export function useLocalStorageSync() {
    function syncInlineTabsInLocalStorage(
        tabsArray: activeInlineTabInterface[]
    ) {
        /* Necessary step to filter out other properties as it have additional tabs info like $el which
         cause error if added to obj in local storage */
        const filteredTabsArray = tabsArray.map((tab) => {
            return {
                label: tab.label,
                key: tab.key,
                favico: tab.favico,
                isSaved: tab.isSaved,
                queryId: tab.queryId,
                explorer: tab.explorer,
                playground: tab.playground,
                assetSidebar: tab.assetSidebar,
            }
        })
        localStorage.setItem(
            InsightsLocalStorageKeys.inlinetabs,
            JSON.stringify(filteredTabsArray)
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
