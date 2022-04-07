export const mainTabs = [
    {
        id: 'monitor',
        label: 'Monitor',
        component: 'monitor',
        tooltip: 'Monitor workflow runs',
    },
    {
        id: 'manage',
        label: 'Manage',
        component: 'manage',
        tooltip: 'Manage workflows',
    },
    {
        id: 'marketplace',
        label: 'Marketplace',
        component: 'marketplace',
        tooltip: 'Atlan package marketplace',
    },
]

export const workflowPreviewTabs = [
    {
        name: 'Overview',
        component: 'info',
        icon: 'Overview',
        activeIcon: 'OverviewActive',
        tooltip: 'Overview',
        analyticsKey: 'info',
    },
    {
        name: 'Runs',
        component: 'runs',
        icon: 'Workflow',
        activeIcon: 'Workflow',
        tooltip: 'Workflow runs',
        analyticsKey: 'runs',
    },
]
