import { TabInterface } from '~/types/insights/tab.interface'

export default function useInsightsTabList(): {
    allTabs: TabInterface[]
    filteredTabs: TabInterface[]
} {
    const tabList: TabInterface[] = [
        {
            id: 'result',
            name: 'Result',
            component: 'result',
            icon: undefined,
            isVisible: true,
        },
        {
            id: 'metadata',
            name: 'Metadata',
            component: 'metadata',
            icon: undefined,
            isVisible: false,
        },
        {
            id: 'queries',
            name: 'Queries',
            component: 'queries',
            icon: undefined,
            isVisible: false,
        },
        {
            id: 'joins',
            name: 'Joins',
            component: 'joins',
            icon: undefined,
            isVisible: false,
        },
        {
            id: 'filters',
            name: 'Filters',
            component: 'filters',
            icon: undefined,
            isVisible: false,
        },
        {
            id: 'impersonation',
            name: 'Impersonation',
            component: 'impersonation',
            icon: undefined,
            isVisible: false,
        },
        {
            id: 'downstream',
            name: 'Downstream',
            component: 'downstream',
            icon: undefined,
            isVisible: false,
        },
        {
            id: 'sqlHelp',
            name: 'SQL Help',
            component: 'sqlHelp',
            icon: undefined,
            isVisible: false,
        },
    ]

    const filteredTabs = tabList.filter((tab) => tab.isVisible === true)

    return { allTabs: tabList, filteredTabs }
}
