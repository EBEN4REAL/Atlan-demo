import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
import { editorConfigInterface } from '~/types/insights/editoConfig.interface'
import { outputPaneSize } from '~/components/insights/common/composables/useSpiltPanes'

const InsightsLocalStorageKeys = {
    inlinetabs: 'insights_inlinetabs',
    activeInlineTab: 'insights_active_inlinetab',
    activeExplorerTab: 'active_explorer_tab',
}

export function useLocalStorageSync() {
    function syncInlineTabsInLocalStorage(
        tabsArray: activeInlineTabInterface[],
        queryDataStore?: boolean
    ) {
        if (!queryDataStore) {
            // for not saving the querying data into the local storage
            const alteredTabsArray = [...tabsArray].map((tab) => {
                const t = JSON.parse(JSON.stringify(tab))
                t.playground.editor.dataList = []
                t.playground.editor.columnList = []
                t.playground.resultsPane.result.isQueryRunning = ''
                t.playground.resultsPane.result.executionTime = -1
                t.playground.resultsPane.result.totalRowsCount = -1
                t.playground.resultsPane.result.totalRowsCount = []
                t.playground.resultsPane.result.buttonDisable = undefined
                t.playground.resultsPane.result.runQueryId = undefined
                t.playground.resultsPane.result.eventSourceInstance = undefined
                t.assetSidebar.isVisible = false
                t.playground.vqb.panels = t.playground.vqb.panels.map((x) => {
                    return {
                        ...x,
                        expand: false,
                    }
                })
                return t
            })

            localStorage.setItem(
                InsightsLocalStorageKeys.inlinetabs,
                JSON.stringify(alteredTabsArray)
            )
        } else {
            localStorage.setItem(
                InsightsLocalStorageKeys.inlinetabs,
                JSON.stringify(tabsArray)
            )
        }
    }
    function syncActiveInlineTabKeyInLocalStorage(activeInlineTabKey: string) {
        localStorage.setItem(
            InsightsLocalStorageKeys.activeInlineTab,
            activeInlineTabKey
        )
    }
    function getInlineTabsFromLocalStorage(): activeInlineTabInterface[] {
        if (localStorage.getItem(InsightsLocalStorageKeys.inlinetabs)) {
            const parsedInlineTabs = JSON.parse(
                localStorage.getItem(InsightsLocalStorageKeys.inlinetabs)
            )

            // temeperory loop for avoiding crashing it on customer instances

            const alteredTabsArray = parsedInlineTabs.map((tab) => {
                const t = JSON.parse(JSON.stringify(tab))
                if (!t.playground.resultsPane?.outputPaneSize) {
                    t.playground.resultsPane.outputPaneSize =
                        outputPaneSize.value
                }
                if (!t.explorer.schema?.facetsFilters) {
                    t.explorer.schema.facetsFilters = {}
                }
                if (!t.explorer.schema?.sortOrderTable) {
                    t.explorer.schema.sortOrderTable = 'name.keyword-asc'
                }
                if (!t.explorer.schema?.sortOrderColumn) {
                    t.explorer.schema.sortOrderColumn = 'order-asc'
                }
                return t
            })

            return alteredTabsArray
        } else return []
    }
    function getActiveInlineTabKeyFromLocalStorage() {
        if (localStorage.getItem(InsightsLocalStorageKeys.activeInlineTab))
            return localStorage.getItem(
                InsightsLocalStorageKeys.activeInlineTab
            )
        else return undefined
    }

    const setUserPreferenceToLocalStorage = (
        editorConfig: editorConfigInterface
    ) => {
        let preferences = {}
        if (localStorage.getItem('editor_preferences'))
            preferences = JSON.parse(localStorage.getItem('editor_preferences'))
        preferences = editorConfig
        localStorage.setItem('editor_preferences', JSON.stringify(preferences))
    }

    const getUserPereferenceFromLocalStorage = () => {
        if (localStorage.getItem('editor_preferences'))
            return JSON.parse(localStorage.getItem('editor_preferences'))
        else
            return {
                theme: 'AtlanLight',
                tabSpace: 3,
                fontSize: 14,
                cursorStyle: 'line',
            }
    }
    const setActiveExplorerTab = (activeTabId: string) => {
        localStorage.setItem(
            InsightsLocalStorageKeys.activeExplorerTab,
            activeTabId
        )
    }

    const getActiveExplorerTab = () => {
        if (localStorage.getItem(InsightsLocalStorageKeys.activeExplorerTab))
            return localStorage.getItem(
                InsightsLocalStorageKeys.activeExplorerTab
            )
        return ''
    }
    return {
        setUserPreferenceToLocalStorage,
        getUserPereferenceFromLocalStorage,
        syncInlineTabsInLocalStorage,
        getInlineTabsFromLocalStorage,
        syncActiveInlineTabKeyInLocalStorage,
        getActiveInlineTabKeyFromLocalStorage,
        setActiveExplorerTab,
        getActiveExplorerTab,
    }
}
