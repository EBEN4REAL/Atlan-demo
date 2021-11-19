export const profileTabs = [
    {
        id: 'overview',
        label: 'Overview',
        component: 'overview',
        icon: 'Overview',
        activeIcon: 'OverviewActive',
        tooltip: 'Overview',
    },
    {
        id: 'columns',
        label: 'Columns',
        component: 'columns',
        includes: ['Table', 'View', 'MaterialisedViews', 'PartitionTable'],
        icon: 'Columns',
        tooltip: 'Columns',
    },
    {
        id: 'lineage',
        label: 'Lineage',
        component: 'lineage',
        excludes: ['Query', 'QueryFolder'],
        icon: 'Lineage',
        tooltip: 'Lineage',
    },
    {
        id: 'queries',
        label: 'Queries',
        component: 'queries',
        includes: ['Table', 'View', 'MaterialisedViews', 'PartitionTable'],
        icon: 'Queries',
        tooltip: 'Queries',
    },
]
