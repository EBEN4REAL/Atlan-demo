import { ref, computed } from 'vue'

interface TabList {
    name: string
    component: string
    exclude?: string[]
}

export default function useColumnDetailsTabList() {
    const columnType = ref('')
    const tabList: TabList[] = [
        {
            name: 'Info',
            component: 'info',
        },
        {
            name: 'Chat',
            component: 'chat',
        },

    ]

    const filteredTabs = computed(() => {
        if (columnType.value)
            return tabList.filter(
                (tab) =>
                    !tab.exclude?.includes(columnType.value)
            )
        return tabList
    })

    return { allTabs: tabList, filteredTabs, columnType }
}
