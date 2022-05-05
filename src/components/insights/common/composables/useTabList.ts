import { computed, ComputedRef } from 'vue'
import { TabInterface } from '~/types/insights/tab.interface'
import {
    featureEnabledMap,
    INSIGHT_SCHEDULE_QUERY,
} from '~/composables/labs/labFeatureList'

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
            isVisible: featureEnabledMap.value[INSIGHT_SCHEDULE_QUERY],
            title: 'Schedule',
        },
    ]

    const filteredTabs = tabList.filter((tab) => tab.isVisible === true)

    return { allTabs: tabList, filteredTabs }
}
