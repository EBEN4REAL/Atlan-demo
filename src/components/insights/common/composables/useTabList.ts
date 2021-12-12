import { computed, ComputedRef } from 'vue'
import { TabInterface } from '~/types/insights/tab.interface'

export default function useInsightsTabList(): {
    allTabs: TabInterface[]
    filteredTabs: TabInterface[]
} {
    const tabList: TabInterface[] = [
        {
            id: 'schema',
            name: 'Schema',
            component: 'schema',
            icon: 'Schema2',
            isVisible: false,
        },
        {
            id: 'queries',
            name: 'Queries',
            component: 'queries',
            icon: 'FolderNav24',
            isVisible: true,
        },
        {
            id: 'variables',
            name: 'Variables',
            component: 'variables',
            icon: 'Queries',
            isVisible: false,
        },
        {
            id: 'history',
            name: 'History',
            component: 'history',
            icon: 'History',
            isVisible: false,
        },
        {
            id: 'schedule',
            name: 'Schedule',
            component: 'schedule',
            icon: undefined,
            isVisible: false,
        },
    ]

    const filteredTabs = tabList.filter((tab) => tab.isVisible === true)

    return { allTabs: tabList, filteredTabs }
}
