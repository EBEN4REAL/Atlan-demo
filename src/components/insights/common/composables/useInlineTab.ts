import { Ref, ref, computed, toRaw } from 'vue'
import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
import { useLocalStorageSync } from './useLocalStorageSync'
import { inlineTabsDemoData } from '../dummyData/demoInlineTabData'
import { useConnectionsStore } from '~/store/connections'

export function useInlineTab(treeSelectedKeys?: Ref<string[]>) {
    const {
        syncInlineTabsInLocalStorage,
        getInlineTabsFromLocalStorage,
        getActiveInlineTabKeyFromLocalStorage,
    } = useLocalStorageSync()

    // initial sidebar will be not visible
    const setInlineTabsVisibilityToNone = (
        localStorageInlineTabs: activeInlineTabInterface[]
    ) => {
        const localStorageInlineTabsX = localStorageInlineTabs.map((tab) => {
            tab.assetSidebar.isVisible = false
            return tab
        })
        return localStorageInlineTabsX
    }
    const setInlineTabsArray = (shouldDefaultTabAdd: boolean) => {
        // checking if localstorage already have active tabs
        const store = useConnectionsStore()
        let firstConnection = store?.data?.entities?.find(
            (item) => item.attributes.connectorName === 'snowflake'
        )
        console.log(firstConnection, 'firstConnection', store?.data?.entities)
        const localStorageInlineTabs = getInlineTabsFromLocalStorage()
        if (localStorageInlineTabs.length > 0) {
            return setInlineTabsVisibilityToNone(localStorageInlineTabs)
        }
        /* For intiial selection of connections */
        if (firstConnection && firstConnection?.attributes?.name) {
            inlineTabsDemoData[0].explorer.schema.connectors.attributeName =
                'connectionQualifiedName'
            inlineTabsDemoData[0].explorer.schema.connectors.attributeValue =
                firstConnection?.attributes?.qualifiedName
        }
        // if (shouldDefaultTabAdd) return inlineTabsDemoData

        return []
    }

    const isInlineTabAlreadyOpened = (
        inlineTab: activeInlineTabInterface,
        tabsArray: Ref<activeInlineTabInterface[]>
    ) => {
        let bool = false
        tabsArray.value.forEach((tab) => {
            if (tab.queryId === inlineTab.queryId) bool = true
            else if (tab.key === inlineTab.key) bool = true
        })
        return bool
    }

    const setActiveInlineTabKey = () => {
        // checking if localstorage already have active tab key
        const localStorageActiveInlineKey =
            getActiveInlineTabKeyFromLocalStorage()
        if (localStorageActiveInlineKey !== undefined) {
            const activeTab = tabsArray.value.find(
                (tab) => tab.key === localStorageActiveInlineKey
            )
            if (activeTab) return activeTab.key
        }
        if (tabsArray.value.length > 0) return tabsArray.value[0].key
        return ''
    }

    const inlineTabRemove = (
        inlineTabKey: string,
        tabsArray: Ref<activeInlineTabInterface[]>,
        activeInlineTabKey: Ref<string>,
        pushGuidToURL: Function
    ) => {
        let lastIndex = 0
        tabsArray.value.forEach((tab, i) => {
            if (tab.key === inlineTabKey) {
                lastIndex = i - 1
            }
        })
        tabsArray.value = tabsArray.value.filter(
            (tab) => tab.key !== inlineTabKey
        )
        if (treeSelectedKeys)
            treeSelectedKeys.value = treeSelectedKeys?.value.filter(
                (key) => key !== inlineTabKey
            )
        if (lastIndex >= 0) {
            activeInlineTabKey.value = tabsArray.value[lastIndex].key
            if (tabsArray.value[lastIndex].queryId)
                pushGuidToURL(tabsArray.value[lastIndex].queryId)
            else pushGuidToURL()
        } else {
            if (tabsArray.value.length > 0) {
                activeInlineTabKey.value = tabsArray.value[0].key
                if (tabsArray.value[0]?.queryId)
                    pushGuidToURL(tabsArray.value[0].queryId)
                else pushGuidToURL()
            } else {
                activeInlineTabKey.value = undefined
                pushGuidToURL()
            }
        }

        console.log(activeInlineTabKey.value)
        // syncying inline tabarray in localstorage
        syncInlineTabsInLocalStorage(tabsArray.value)
    }

    const modifyActiveInlineTab = (
        activeTab: activeInlineTabInterface,
        tabsArray: Ref<activeInlineTabInterface[]>,
        isSaved: boolean = false,
        localStorageSync: boolean = true
    ) => {
        /* There can be two case
        1-> It's already saved and being modified so save-> unsave ( activeTab.save(true) && isSaved(false))
        2-> It's unsaved and being saving into database so unsave-> save ( activeTab.save(true) && isSaved(true))
         */
        // saved query being modifed
        if (activeTab.isSaved && !isSaved) {
            activeTab.isSaved = false
        }
        if (activeTab.isSaved && isSaved) {
            activeTab.isSaved = true
        }
        const index = tabsArray.value.findIndex(
            (tab) => tab.key === activeTab.key
        )
        console.log(index, activeTab, 'dds')
        if (index !== -1) {
            console.log(index, activeTab, 'modifyTab')
            tabsArray.value[index] = activeTab
        }
        if (localStorageSync) {
            console.log('localStorageSync')
            // syncying inline tabarray in localstorage
            syncInlineTabsInLocalStorage(tabsArray.value)
        }
    }

    const modifyActiveInlineTabEditor = (
        activeTab: activeInlineTabInterface,
        tabsArray: Ref<activeInlineTabInterface[]>,
        isSaved: boolean = false,
        queryDataStore: boolean = false
    ) => {
        /* There can be two case
        1-> It's already saved and being modified so save-> unsave ( activeTab.save(true) && isSaved(false))
        2-> It's unsaved and being saving into database so unsave-> save ( activeTab.save(true) && isSaved(true))
         */
        const index = tabsArray.value.findIndex(
            (tab) => tab.key === activeTab.key
        )
        if (index !== -1) {
            // saved query being modifed
            if (activeTab.isSaved && !isSaved) {
                tabsArray.value[index].isSaved = false
            }
            if (activeTab.isSaved && isSaved) {
                tabsArray.value[index].isSaved = true
            }
            tabsArray.value[index].playground.editor =
                activeTab.playground.editor
        }
        // syncying inline tabarray in localstorage
        syncInlineTabsInLocalStorage(toRaw(tabsArray.value), queryDataStore)
    }
    const setActiveTabKey = (
        selectedKey: string,
        activeInlineTabKey: Ref<string>
    ) => {
        activeInlineTabKey.value = selectedKey
    }
    const overwriteInlineTab = (
        activeTab: activeInlineTabInterface,
        tabsArray: Ref<activeInlineTabInterface[]>
    ) => {
        const index = tabsArray.value.findIndex(
            (tab) => tab.key === activeTab.key
        )
        tabsArray.value[index] = activeTab
        // syncying inline tabarray in localstorage
        syncInlineTabsInLocalStorage(toRaw(tabsArray.value))
    }

    const inlineTabAdd = (
        inlineTab: activeInlineTabInterface,
        tabsArray: Ref<activeInlineTabInterface[]>,
        activeInlineTabKey: Ref<string>
    ) => {
        tabsArray.value.push(inlineTab)
        activeInlineTabKey.value = inlineTab.key
    }
    const isTwoInlineTabsEqual = (
        obj1: activeInlineTabInterface,
        obj2: activeInlineTabInterface
    ) => {
        console.log('run Equal')
        const obj1Length = Object.keys(obj1).length
        const obj2Length = Object.keys(obj2).length

        if (obj1Length === obj2Length) {
            return Object.keys(obj1).every(
                (key) => obj2.hasOwnProperty(key) && obj2[key] === obj1[key]
            )
        }
        return false
    }
    const changeInlineTabeKey = (
        currKey: string,
        newKey: string,
        activeTab: activeInlineTabInterface,
        activeInlineTabKey: Ref<string>
    ) => {
        const index = tabsArray.value.findIndex((tab) => tab.key === currKey)
        tabsArray.value[index] = activeTab
        tabsArray.value[index].key = newKey
        activeInlineTabKey.value = newKey
        // syncying inline tabarray in localstorage
        syncInlineTabsInLocalStorage(toRaw(tabsArray.value))
    }

    const tabsArray: Ref<activeInlineTabInterface[]> = ref(setInlineTabsArray())
    const activeInlineTabKey = ref(setActiveInlineTabKey())
    const activeInlineTab = computed(() =>
        tabsArray.value.find((tab) => tab.key === activeInlineTabKey.value)
    )

    return {
        tabsArray,
        activeInlineTabKey,
        activeInlineTab,
        isTwoInlineTabsEqual,
        isInlineTabAlreadyOpened,
        inlineTabRemove,
        inlineTabAdd,
        modifyActiveInlineTab,
        modifyActiveInlineTabEditor,
        setActiveTabKey,
        overwriteInlineTab,
        changeInlineTabeKey,
    }
}
