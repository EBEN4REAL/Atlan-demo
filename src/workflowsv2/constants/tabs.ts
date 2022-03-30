export const mainTabs = [
    {
        id: 'monitor',
        label: 'Monitor',
        component: 'monitor',
        tooltip: 'Monitor workflow runs',
    },
    {
        id: 'manage',
        label: 'Manage workflows',
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
        scrubbed: false,
        analyticsKey: 'info',
    },
]
