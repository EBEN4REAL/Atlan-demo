export const previewTabs = [
    {
        name: 'Overview',
        component: 'info',
        icon: 'Overview',
        activeIcon: 'OverviewActive',
        tooltip: 'Overview',
        scrubbed: false,
    },
    {
        name: 'Columns',
        component: 'columns',
        includes: ['Table', 'View', 'MaterialisedViews', 'PartitionTable'],
        icon: 'Columns',
        tooltip: 'Columns',
        scrubbed: false,
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
        excludes: [
            'Query',
            'QueryFolder',
            'AtlasGlossary',
            'AtlasGlossaryTerm',
            'AtlasGlossaryCategory',
            'Database',
            'Schema',
            'Connection',
        ],
        icon: 'Lineage',
        tooltip: 'Lineage',
        scrubbed: true,
    },
    {
        name: 'Activity',
        component: 'activity',
        excludes: ['Query', 'QueryFolder'],
        icon: 'ActivityLogs',
        tooltip: 'Activity',
        scrubbed: true,
    },
    {
        name: 'Relations',
        component: 'relations',
        excludes: [
            'Connection',
            'Database',
            'Schema',
            'AtlasGlossaryCategory',
            'AtlasGlossaryTerm',
            'Table',
            'View',
            'MaterialisedViews',
            'PartitionTable',
            'Column',
        ],
        icon: 'Relation',
        tooltip: 'Relationships',
        scrubbed: false,
    },
    {
        name: 'Resources',
        component: 'resources',
        icon: 'Link',
        activeIcon: 'Link',
        tooltip: 'Resources',
        scrubbed: true,
    },
    {
        name: 'Property',
        component: 'property',
        icon: 'Property',
        activeIcon: 'PropertyActive',
        tooltip: 'Property',
        scrubbed: false,
    },
]
