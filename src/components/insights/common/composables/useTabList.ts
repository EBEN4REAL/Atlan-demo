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
        },
        {
            id: 'queries',
            name: 'Queries',
            component: 'queries',
            icon: undefined,
        },
        {
            id: 'history',
            name: 'History',
            component: 'history',
            icon: undefined,
        },
        {
            id: 'schedule',
            name: 'Schedule',
            component: 'schedule',
            icon: undefined,
        },
    ]

    const filteredTabs = computed(() => {
        return tabList
    })

    return { allTabs: tabList, filteredTabs }
}
