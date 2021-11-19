export const previewTabs = [
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
    // {
    //     name: 'Custom Metadata',
    //     component: 'businessMetadataTab',
    //     exclude: ['Query'],
    //     icon: 'Metadata',
    //     tooltip: 'Custom metadata',
    // },
    {
        name: 'Lineage',
        component: 'lineage',
        excludes: ['Query', 'QueryFolder'],
        icon: 'Lineage',
        tooltip: 'Lineage',
    },
    {
        name: 'Activity',
        component: 'activity',
        excludes: ['Query', 'QueryFolder'],
        icon: 'ActivityLogs',
        tooltip: 'Activity',
    },
    {
        name: 'Relations',
        component: 'relations',
        exclude: [
            'Connection',
            'Database',
            'Schema',
            'AtlasGlossaryCategory',
            'AtlasGlossaryTerm'
        ],
        icon: 'Relation',
        tooltip: 'Relationships',
    },
    {
        name: 'Property',
        component: 'property',
        icon: 'Property',
        activeIcon: 'PropertyActive',
        tooltip: 'Property',
    },
]
