import { computed, ComputedRef } from 'vue'
import { TabInterface } from '~/types/insights/tab.interface'

export default function useInsightsTabList(): {
    allTabs: TabInterface[]
    filteredTabs: ComputedRef<any>
} {
    const tabList: TabInterface[] = [
        {
            id: 'result',
            name: 'Result',
            component: 'result',
            icon: undefined,
        },
        {
            id: 'metadata',
            name: 'Metadata',
            component: 'metadata',
            icon: undefined,
        },
        {
            id: 'queries',
            name: 'Queries',
            component: 'queries',
            icon: undefined,
        },
        {
            id: 'joins',
            name: 'Joins',
            component: 'joins',
            icon: undefined,
        },
        {
            id: 'filters',
            name: 'Filters',
            component: 'filters',
            icon: undefined,
        },
        {
            id: 'impersonation',
            name: 'Impersonation',
            component: 'impersonation',
            icon: undefined,
        },
        {
            id: 'downstream',
            name: 'Downstream',
            component: 'downstream',
            icon: undefined,
        },
        {
            id: 'sqlHelp',
            name: 'SQL Help',
            component: 'sqlHelp',
            icon: undefined,
        },
    ]

    const filteredTabs = computed(() => {
        return tabList
    })

    return { allTabs: tabList, filteredTabs }
}
