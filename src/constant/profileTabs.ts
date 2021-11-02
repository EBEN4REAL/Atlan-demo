export const profileTabs = [
    {
        name: 'Overview',
        component: 'info',
        icon: 'Overview',
        activeIcon: 'OverviewActive',
        tooltip: 'Overview',
    },
    {
        name: 'Columns',
        component: 'columns',
        includes: ['Table', 'View', 'MaterialisedViews', 'PartitionTable'],
        icon: 'Columns',
        tooltip: 'Columns',
    },
    {
        name: 'Lineage',
        component: 'lineage',
        excludes: ['Query', 'QueryFolder'],
        icon: 'Lineage',
        tooltip: 'Lineage',
    },
]
