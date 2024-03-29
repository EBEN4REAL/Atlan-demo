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
        name: 'Objects',
        component: 's3Objects',
        includes: ['S3Bucket'],
        icon: 'S3Object',
        tooltip: 'Objects',
        scrubbed: false,
        requiredInProfile: true,
        analyticsKey: 's3objects',
    },
    {
        name: 'Lineage',
        component: 'lineage',
        excludes: [
            'Query',
            'Folder',
            'Collection',
            'AtlasGlossary',
            'AtlasGlossaryTerm',
            'AtlasGlossaryCategory',
            'Database',
            'Schema',
            'Connection',
            'Procedure',
            'SalesforceOrganization',
            'SalesforceDashboard',
            'SalesforceReport',
            'SalesforceObject',
            'SalesforceField',
            'S3Bucket',
            'S3Object',
            'DataStudioAsset',
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
            'Procedure',
            'Collection',
            'S3Bucket',
            'S3Object',
            'DataStudioAsset',
        ],
        icon: 'Relation',
        activeIcon: 'RelationActive',
        tooltip: 'Related Assets',
        scrubbed: false,
        requiredInProfile: true,
        analyticsKey: 'relations',
    },
    {
        name: 'Assets',
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
        name: 'Queries',
        component: 'queries',
        includes: ['Table', 'Column', 'View', 'Collection'],
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
        excludes: ['Connection'],
        icon: 'Request',
        activeIcon: 'RequestActive',
        tooltip: 'Request',
        scrubbed: false,
        requiredInProfile: true,
        analyticsKey: 'request',
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
        name: 'Property',
        component: 'property',
        icon: 'Property',
        activeIcon: 'PropertyActive',
        tooltip: 'Property',
        scrubbed: false,
        requiredInProfile: true,
        analyticsKey: 'property',
    },
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

export const SlackResourcesTab = {
    name: 'Slack',
    title: 'Slack Conversations',
    component: 'SlackResourcesTab',
    icon: 'Slack',
    activeIcon: 'Slack',
    tooltip: 'Slack',
    scrubbed: false,
    requiredInProfile: true,
    analyticsKey: 'slack',
}
