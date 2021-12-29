import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
import { editorConfigInterface } from '~/types/insights/editoConfig.interface'
import dayjs from 'dayjs'
import { message } from 'ant-design-vue'

const InsightsLocalStorageKeys = {
    inlinetabs: 'insights_inlinetabs',
    activeInlineTab: 'insights_active_inlinetab',
}
export function useLocalStorageSync() {
    function syncInlineTabsInLocalStorage(
        tabsArray: activeInlineTabInterface[],
        queryDataStore?: boolean
    ) {
        message.success({
            content: `Local storage sync!`,
        })

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
            /* NOTE: we have to convert the plain date string to dayjs object.
            JSON.stringify change the dayjs object to plain string, so on retreving we have 
            to convert it again otherwise flow will break as antdday picker takes only dayjs object not plain string
            */

            const parsedInlineTabs = JSON.parse(
                localStorage.getItem(InsightsLocalStorageKeys.inlinetabs)
            )

            const alteredTabsArray = parsedInlineTabs?.map((tab) => {
                const t = JSON.parse(JSON.stringify(tab))
                t.playground.editor.variables =
                    t.playground.editor.variables?.map((_variable) => {
                        const copy__variable = { ..._variable }
                        if (copy__variable.type === 'date')
                            copy__variable.value = dayjs(copy__variable.value)
                        return copy__variable
                    })
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
    return {
        setUserPreferenceToLocalStorage,
        getUserPereferenceFromLocalStorage,
        syncInlineTabsInLocalStorage,
        getInlineTabsFromLocalStorage,
        syncActiveInlineTabKeyInLocalStorage,
        getActiveInlineTabKeyFromLocalStorage,
    }
}
