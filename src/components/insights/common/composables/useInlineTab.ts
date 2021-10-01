import { Ref, ref, computed, toRaw } from 'vue'
import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
import { useLocalStorageSync } from './useLocalStorageSync'
import { inlineTabsDemoData } from '../dummyData/demoInlineTabData'

export function useInlineTab(treeSelectedKeys?: Ref<string[]>) {
    const {
        syncInlineTabsInLocalStorage,
        getInlineTabsFromLocalStorage,
        getActiveInlineTabKeyFromLocalStorage,
    } = useLocalStorageSync()

    const setInlineTabsArray = () => {
        // checking if localstorage already have active tabs
        const localStorageInlineTabs = getInlineTabsFromLocalStorage()
        if (localStorageInlineTabs.length > 0) {
            return localStorageInlineTabs
        }
        return inlineTabsDemoData
    }

    const isInlineTabAlreadyOpened = (
        inlineTab: activeInlineTabInterface,
        tabsArray: Ref<activeInlineTabInterface[]>
    ) => {
        let bool = false
        tabsArray.value.forEach((tab) => {
            if (tab.key === inlineTab.key) bool = true
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
        activeInlineTabKey: Ref<string>
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
        } else {
            if (tabsArray.value.length > 0)
                activeInlineTabKey.value = tabsArray.value[0].key
            else {
                activeInlineTabKey.value = undefined
            }
        }

        console.log(activeInlineTabKey.value)
        // syncying inline tabarray in localstorage
        syncInlineTabsInLocalStorage(tabsArray.value)
    }

    const modifyActiveInlineTab = (
        activeTab: activeInlineTabInterface,
        tabsArray: Ref<activeInlineTabInterface[]>,
        restrictIsSavedToggle?: boolean
    ) => {
        const index = tabsArray.value.findIndex(
            (tab) => tab.key === activeTab.key
        )
        if (index !== -1) {
            // changing from saved -> to unsaved
            if (activeTab.isSaved && !restrictIsSavedToggle)
                activeTab.isSaved = false
            console.log(index, activeTab, 'modifyTab')
            tabsArray.value[index] = activeTab
        }
        // syncying inline tabarray in localstorage
        syncInlineTabsInLocalStorage(tabsArray.value)
    }
    const modifyActiveInlineTabEditor = (
        activeTab: activeInlineTabInterface,
        tabsArray: Ref<activeInlineTabInterface[]>,
        queryDataStore?: boolean
    ) => {
        const index = tabsArray.value.findIndex(
            (tab) => tab.key === activeTab.key
        )
        if (index !== -1) {
            // changing from saved -> to unsaved
            if (activeTab.isSaved) activeTab.isSaved = false
            console.log(index, activeTab, 'modifyTab')
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
    }
}
