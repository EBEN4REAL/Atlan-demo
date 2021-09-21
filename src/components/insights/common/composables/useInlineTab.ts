import { Ref, ref, computed } from 'vue'
import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
import { useLocalStorageSync } from './useLocalStorageSync'
import { inlineTabsDemoData } from '../dummyData/demoInlineTabData'

export function useInlineTab() {
    const {
        syncInlineTabsInLocalStorage,
        getInlineTabsFromLocalStorage,
        getActiveInlineTabKeyFromLocalStorage,
    } = useLocalStorageSync()

    const setInlineTabsArray = () => {
        // checking if localstorage already have active tabs
        const localStorageInlineTabs = getInlineTabsFromLocalStorage()
        if (localStorageInlineTabs.length > 0) {
            console.log(localStorageInlineTabs, 'local')
            return localStorageInlineTabs
        }
        return inlineTabsDemoData
    }

    const isInlineTabAlreadyOpened = (inlineTab: activeInlineTabInterface) => {
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
        console.log(localStorageActiveInlineKey, 'localStorageKey')
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
        if (
            tabsArray.value.length &&
            activeInlineTabKey.value === inlineTabKey
        ) {
            if (lastIndex >= 0) {
                activeInlineTabKey.value = tabsArray.value[lastIndex].key
            } else {
                activeInlineTabKey.value = tabsArray.value[0].key
            }
        } else {
            activeInlineTabKey.value = undefined
        }
        // syncying inline tabarray in localstorage
        syncInlineTabsInLocalStorage(tabsArray.value)
    }

    const modifyActiveInlineTab = (
        activeTab: activeInlineTabInterface,
        tabsArray: Ref<activeInlineTabInterface[]>
    ) => {
        const index = tabsArray.value.findIndex(
            (tab) => tab.key === activeTab.key
        )
        if (index !== -1) {
            console.log(index, activeTab, 'modifyTab')
            tabsArray.value[index] = activeTab
        }
        // syncying inline tabarray in localstorage
        syncInlineTabsInLocalStorage(tabsArray.value)
    }
    const modifyActiveInlineTabEditor = (
        activeTab: activeInlineTabInterface,
        tabsArray: Ref<activeInlineTabInterface[]>
    ) => {
        const index = tabsArray.value.findIndex(
            (tab) => tab.key === activeTab.key
        )
        if (index !== -1) {
            tabsArray.value[index].playground.editor =
                activeTab.playground.editor
        }
        // syncying inline tabarray in localstorage
        syncInlineTabsInLocalStorage(tabsArray.value)
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

    const tabsArray: Ref<activeInlineTabInterface[]> = ref(setInlineTabsArray())
    const activeInlineTabKey = ref(setActiveInlineTabKey())
    const activeInlineTab = computed(() =>
        tabsArray.value.find((tab) => tab.key === activeInlineTabKey.value)
    )

    return {
        tabsArray,
        activeInlineTabKey,
        activeInlineTab,
        isInlineTabAlreadyOpened,
        inlineTabRemove,
        inlineTabAdd,
        modifyActiveInlineTab,
        modifyActiveInlineTabEditor,
        setActiveTabKey,
    }
}
