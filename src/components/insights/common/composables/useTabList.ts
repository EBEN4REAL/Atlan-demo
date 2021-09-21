import { computed, ComputedRef } from 'vue'
import { TabInterface } from '~/types/insights/tab.interface'

export default function useInsightsTabList(): {
    allTabs: TabInterface[]
    filteredTabs: ComputedRef<any>
} {
    const tabList: TabInterface[] = [
        {
            id: 'schema',
            name: 'Schema',
            component: 'schema',
            icon: undefined,
            isVisible: true,
        },
        {
            id: 'queries',
            name: 'Queries',
            component: 'queries',
            icon: undefined,
            isVisible: true,
        },
        {
            id: 'history',
            name: 'History',
            component: 'history',
            icon: undefined,
            isVisible: true,
        },
        {
            id: 'schedule',
            name: 'Schedule',
            component: 'schedule',
            icon: undefined,
            isVisible: true,
        },
    ]

    const filteredTabs = computed(() => {
        return tabList
    })

    return { allTabs: tabList, filteredTabs }
}
