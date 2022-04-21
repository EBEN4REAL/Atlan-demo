import { computed } from 'vue'
import {
    featureEnabledMap,
    INSIGHT_WORKSPACE_LEVEL_TAB,
} from '~/composables/labs/labFeatureList'

export const workspaceList = computed(() => {
    const list = [
        {
            path: '/assets',
            label: 'Assets',
            icon: 'AssetsActive',
            isActive: true,
            inactiveIcon: 'AssetsInactive',
            description:
                'Discover & enrich all data assets in your organization',
        },
        {
            path: '/glossary',
            label: 'Glossary',
            icon: 'Glossary',
            isActive: true,
            inactiveIcon: 'GlossaryInactive',
            description: ` Define and organize all your data terms and metrics`,
            activeBackground: '#FFECF1',
        },
        {
            path: '/insights',
            label: 'Insights',
            icon: 'InsightsActive',
            isActive: featureEnabledMap.value[INSIGHT_WORKSPACE_LEVEL_TAB],
            inactiveIcon: 'InsightsInactive',
            description: `Query your data and derive business insights`,
            activeBackground: '#FFF5C6',
        },
        // {
        //     path: '/workflows',
        //     label: 'Workflows',
        //     icon: 'WorkflowsActive',
        //     isActive: true,
        //     inactiveIcon: 'WorkflowsInactive',
        // },
    ]
    return list
})

export const topNavKeys = [
    {
        path: '/assets',
        label: 'Assets',
        id: 'assets',
        icon: 'AssetsActive',
        inactiveIcon: 'AssetsInactive',
    },
    {
        path: '/glossary',
        label: 'Glossary',
        id: 'glossary',
        icon: 'Glossary',
        inactiveIcon: 'GlossaryInactive',
    },
    {
        path: '/insights',
        label: 'Insights',
        id: 'insights',
        icon: 'InsightsActive',
        inactiveIcon: 'InsightsInactive',
    },
    {
        path: '/workflows',
        label: 'Workflows',
        id: 'workflows',
        icon: 'WorkflowsActive',
        inactiveIcon: 'WorkflowsInactive',
    },
]

export const bottomNavKeys = [
    {
        path: '/admin',
        icon: 'Admin',
        id: 'admin',
        label: 'Admin Center',
        image: '',
    },
    {
        path: '/reporting',
        icon: 'Report',
        label: 'Reporting Center',
    },
    // {
    //     path: '/platform',
    //     icon: 'Platform',
    //     label: 'Platform Center',
    // },
    {
        path: '/#',
        icon: 'Support',
        label: 'Help & Community',
    },
    {
        path: '/#',
        icon: 'Feedback',
        label: 'Feedback',
    },
]
