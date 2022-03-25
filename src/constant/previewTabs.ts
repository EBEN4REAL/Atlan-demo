export const previewTabs = [
    {
        name: 'Overview',
        component: 'info',
        icon: 'Overview',
        activeIcon: 'OverviewActive',
        tooltip: 'Overview',
        scrubbed: false,
        requiredInProfile: true,
        analyticsKey: 'info',
    },
    {
        name: 'Columns',
        component: 'columns',
        includes: ['Table', 'View', 'MaterialisedView', 'PartitionTable'],
        icon: 'Columns',
        tooltip: 'Columns',
        scrubbed: false,
        requiredInProfile: true,
        analyticsKey: 'columns',
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
            'Procedure',
        ],
        icon: 'Lineage',
        tooltip: 'Lineage',
        scrubbed: false,
        requiredInProfile: true,
        analyticsKey: 'lineage',
    },
    {
        name: 'Relations',
        component: 'relations',
        excludes: [
            'Connection',
            'AtlasGlossary',
            'AtlasGlossaryCategory',
            'AtlasGlossaryTerm',
            'Table',
            'View',
            'MaterialisedView',
            'PartitionTable',
            'Column',
            'Process',
            'Procedure',
        ],
        icon: 'Relation',
        activeIcon: 'RelationActive',
        tooltip: 'Related Assets',
        scrubbed: false,
        requiredInProfile: true,
        analyticsKey: 'relations',
    },
    {
        name: 'Linked Assets',
        component: 'linkedAssets',
        icon: 'AssetsInactiveLight',
        activeIcon: 'AssetsActiveLight',
        tooltip: 'Linked Assets',
        scrubbed: false,
        requiredInProfile: false,
        analyticsKey: 'linkedAssets',
        includes: ['AtlasGlossaryTerm'],
    },
    {
        name: 'Activity',
        component: 'activity',
        excludes: ['Folder'],
        icon: 'ActivityLogs',
        tooltip: 'Activity',
        scrubbed: true,
        requiredInProfile: true,
        analyticsKey: 'activity',
    },
    {
        name: 'Queries',
        component: 'queries',
        includes: ['Table', 'Column', 'View'],
        icon: 'QueryDiscovery',
        tooltip: 'Queries',
        scrubbed: false,
        requiredInProfile: true,
        analyticsKey: 'queries',
    },

    {
        name: 'Resources',
        component: 'resources',
        icon: 'Link',
        activeIcon: 'Link',
        tooltip: 'Resources',
        scrubbed: true,
        requiredInProfile: true,
        analyticsKey: 'resources',
    },
    {
        name: 'Request',
        component: 'request',
        icon: 'Request',
        activeIcon: 'RequestActive',
        tooltip: 'Request',
        scrubbed: false,
        requiredInProfile: true,
        analyticsKey: 'request',
    },
    {
        name: 'Property',
        component: 'property',
        icon: 'Property',
        activeIcon: 'PropertyActive',
        tooltip: 'Property',
        scrubbed: false,
        requiredInProfile: true,
        analyticsKey: 'property',
    }
]

export const JiraPreviewTab = {
    name: 'Jira',
    component: 'Jira',
    icon: 'Jira',
    activeIcon: 'Jira',
    tooltip: 'Jira',
    scrubbed: false,
    requiredInProfile: true,
    analyticsKey: 'jira',
}