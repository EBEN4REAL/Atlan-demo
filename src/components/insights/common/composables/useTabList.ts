import { computed, ComputedRef } from 'vue'
import { TabInterface } from '~/types/insights/tab.interface'

export default function useInsightsTabList(): {
    allTabs: TabInterface[]
    filteredTabs: TabInterface[]
} {
    const tabList: TabInterface[] = [
        {
            id: 'schema',
            name: 'Explorer',
            component: 'schema',
            icon: 'Schema2',
            isVisible: true,
            title: 'Schema Explorer',
        },
        {
            id: 'queries',
            name: 'Collections',
            component: 'queries',
            icon: 'CollectionIconLarge',
            isVisible: true,
            title: 'Query',
        },
        {
            id: 'variables',
            name: 'Variables',
            component: 'variables',
            icon: 'Queries',
            isVisible: false,
            title: 'Variables',
        },
        {
            id: 'history',
            name: 'History',
            component: 'history',
            icon: 'History',
            isVisible: false,
            title: 'History',
        },
        {
            id: 'schedule',
            name: 'Schedules',
            component: 'schedule',
            icon: 'Schedule24',
            isVisible: true,
            title: 'Schedule',
        },
    ]

    const filteredTabs = tabList.filter((tab) => tab.isVisible === true)

    return { allTabs: tabList, filteredTabs }
}
