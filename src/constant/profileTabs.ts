export const profileTabs = [
    {
        id: 'overview',
        label: 'Overview',
        component: 'overview',
        icon: 'Overview',
        activeIcon: 'OverviewActive',
        tooltip: 'Overview',
        scrubbed: false,
    },
    /* {
        id: 'columns',
        label: 'Columns',
        component: 'columns',
        includes: ['Table', 'View', 'MaterialisedView', 'PartitionTable'],
        icon: 'Columns',
        tooltip: 'Columns',
    }, */
    {
        id: 'lineage',
        label: 'Lineage',
        component: 'lineage',
        excludes: [
            'Connection',
            'Database',
            'Schema',
            'Query',
            'Folder',
            'Procedure',
            'AtlasGlossary',
            'AtlasGlossaryCategory',
            'AtlasGlossaryTerm',
            'SalesforceOrganization',
            'SalesforceDashboard',
            'SalesforceReport',
            'SalesforceObject',
            'SalesforceField',
        ],
        icon: 'Lineage',
        tooltip: 'Lineage',
        scrubbed: false,
    },
    /*  {
        id: 'queries',
        label: 'Queries',
        component: 'queries',
        includes: ['Table', 'View', 'MaterialisedView', 'PartitionTable'],
        icon: 'Queries',
        tooltip: 'Queries',
        scrubbed: false,
    }, */
    {
        id: 'linkedAssets',
        label: 'Linked Assets',
        component: 'linkedAssets',
        includes: ['AtlasGlossaryTerm'],
        icon: 'LinkedAssets',
        tooltip: 'Linked Assets',
        scrubbed: false,
    },
    {
        id: 'termsAndCategories',
        label: 'Terms and Categories',
        component: 'termsAndCategories',
        includes: ['AtlasGlossary', 'AtlasGlossaryCategory'],
        icon: 'TermsAndCategories',
        tooltip: 'Terms and Categories',
        scrubbed: false,
    },
    {
        id: 'uploadHistory',
        label: 'Upload history',
        component: 'uploadHistory',
        includes: ['AtlasGlossary'],
        icon: 'LinkedAssets',
        tooltip: 'Upload history',
        scrubbed: false,
    },
    {
        id: 'related',
        label: 'Related Assets',
        component: 'relatedAssets',
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
            'Query',
            'Procedure',
        ],
        tooltip: 'Related Assets',
        scrubbed: false,
    },
]
