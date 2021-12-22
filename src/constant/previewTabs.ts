export const previewTabs = [
    {
        name: 'Overview',
        component: 'info',
        icon: 'Overview',
        activeIcon: 'OverviewActive',
        tooltip: 'Overview',
        scrubbed: false,
        requiredInProfile: true,
    },
    {
        name: 'Columns',
        component: 'columns',
        includes: ['Table', 'View', 'MaterialisedViews', 'PartitionTable'],
        icon: 'Columns',
        tooltip: 'Columns',
        scrubbed: false,
        requiredInProfile: true,
    },
    {
        name: 'Lineage',
        component: 'lineage',
        excludes: [
            'Query',
            'Folder',
            'AtlasGlossary',
            'AtlasGlossaryTerm',
            'AtlasGlossaryCategory',
            'Database',
            'Schema',
            'Connection',
            'Process',
        ],
        icon: 'Lineage',
        tooltip: 'Lineage',
        scrubbed: true,
        requiredInProfile: false,
    },
    {
        name: 'Activity',
        component: 'activity',
        excludes: ['Query', 'Folder'],
        icon: 'ActivityLogs',
        tooltip: 'Activity',
        scrubbed: true,
        requiredInProfile: true,
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
            'Process',
        ],
        icon: 'Relation',
        tooltip: 'Relationships',
        scrubbed: false,
        requiredInProfile: false,
    },
    {
        name: 'Resources',
        component: 'resources',
        icon: 'Link',
        activeIcon: 'Link',
        tooltip: 'Resources',
        scrubbed: true,
        requiredInProfile: true,
    },
    {
        name: 'Property',
        component: 'property',
        icon: 'Property',
        activeIcon: 'PropertyActive',
        tooltip: 'Property',
        scrubbed: false,
        requiredInProfile: true,
    },
]
