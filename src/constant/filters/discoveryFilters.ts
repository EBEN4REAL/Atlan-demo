export const discoveryFilters = [
    {
        id: 'hierarchy',
        label: 'Connection',
        component: 'hierarchy',
        overallCondition: 'OR',
        attributes: [],
        isDeleted: false,
        isDisabled: false,
        exclude: false,
        analyticsKey: 'connection',
    },
    {
        id: 'certificateStatus',
        label: 'Certificate',
        component: 'certificate',
        overallCondition: 'OR',
        attributes: [],
        isDeleted: false,
        isDisabled: false,
        exclude: false,
        analyticsKey: 'certificate',
    },
    {
        id: 'owners',
        label: 'Owners',
        component: 'owners',
        overallCondition: 'OR',
        attributes: [],
        isDeleted: false,
        isDisabled: false,
        exclude: false,
        analyticsKey: 'owner',
    },
    // {
    //     id: 'terms',
    //     label: 'Terms',
    //     component: 'governance',
    //     overallCondition: 'OR',
    //     attributes: [],
    //     isDeleted: false,
    //     isDisabled: false,
    //     exclude: false,
    // },
    {
        id: '__traitNames',
        label: 'Classifications',
        component: 'classifications',
        overallCondition: 'OR',
        attributes: [],
        isDeleted: false,
        isDisabled: false,
        exclude: false,
        analyticsKey: 'classification',
    },
    {
        id: 'terms',
        label: 'Terms',
        component: 'terms',
        overallCondition: 'OR',
        attributes: [],
        isDeleted: false,
        isDisabled: false,
        exclude: false,
        analyticsKey: 'term',
    },
    {
        id: 'properties',
        label: 'Properties',
        component: 'properties',
        attributes: [
            {
                name: 'name.keyword',
                displayName: 'Name',
                typeName: 'string',
                description: 'Name of the asset',
                isMandatory: true,
            },
            {
                name: 'description',
                displayName: 'Description',
                typeName: 'string',
                description:
                    'Description of the asset crawled from the source.',
                isMandatory: false,
            },
            {
                name: 'userDescription',
                displayName: 'User Description',
                typeName: 'string',
                description: 'Description of the asset updated on Atlan.',
                isMandatory: false,
            },
            {
                name: '__modifiedBy',
                displayName: 'Last updated by',
                typeName: 'string',
                subTypeName: 'user',
                description: 'User who last updated the asset on Atlan',
                isMandatory: true,
            },
            {
                name: '__modificationTimestamp.date',
                displayName: 'Last updated at',
                typeName: 'dateTime',
                description: 'Last updated timestamp of the asset on Atlan',
                isMandatory: true,
            },
            {
                name: '__guid',
                displayName: 'Unique identifier',
                description: 'Unique Id for Assets',
                typeName: 'string',
                isMandatory: true,
            },
            {
                name: 'qualifiedName',
                displayName: 'Qualified name',
                description: 'Unique name for asset',
                typeName: 'string',
                isMandatory: true,
            },
            {
                name: '__createdBy',
                displayName: 'Created by',
                typeName: 'string',
                subTypeName: 'user',
                description: 'User who created the asset on Atlan',
                isMandatory: true,
            },
            {
                name: '__hasLineage',
                displayName: 'Has Lineage',
                typeName: 'boolean',
                description: 'All assets which have lineage relationship',
                isMandatory: true,
            },
            {
                name: '__state',
                displayName: 'Is Archived',
                typeName: 'boolean',
                description: 'All assets which have been archived',
                isMandatory: true,
            },
        ],
        overallCondition: 'OR',
        isDeleted: false,
        isDisabled: false,
        exclude: false,
        analyticsKey: 'property',
    },
    {
        id: 'sql',
        label: 'SQL Assets',
        component: 'properties',
        includes: [
            'Table',
            'View',
            'MaterialisedViews',
            'PartitionTable',
            'Column',
        ],
        attributes: [
            {
                name: 'databaseName.keyword',
                displayName: 'Database Name',
                typeName: 'string',
            },
            {
                name: 'schemaName.keyword',
                displayName: 'Schema Name',
                typeName: 'string',
            },
            {
                name: 'tableName.keyword',
                displayName: 'Table Name',
                typeName: 'string',
            },
            {
                name: 'viewName.keyword',
                displayName: 'View Name',
                typeName: 'string',
            },
        ],
        overallCondition: 'OR',
        isDeleted: false,
        isDisabled: false,
        exclude: false,
        analyticsKey: 'sql_assets',
    },

    {
        id: 'table',
        label: 'Table/View',
        component: 'properties',
        includes: ['Table', 'View', 'MaterialisedViews', 'PartitionTable'],
        attributes: [
            {
                name: 'rowCount',
                displayName: 'Row Count',
                typeName: 'long',
            },
            {
                name: 'columnCount',
                displayName: 'Column Count',
                typeName: 'long',
            },
            {
                name: 'sizeBytes',
                displayName: 'Size (MB)',
                typeName: 'long',
            },
        ],
        overallCondition: 'OR',
        isDeleted: false,
        isDisabled: false,
        exclude: false,
        analyticsKey: 'table',
    },
    {
        id: 'column',
        label: 'Column',
        component: 'properties',
        includes: ['Column'],
        attributes: [
            {
                name: 'dataType',
                displayName: 'Data Type',
                typeName: 'string',
            },
            {
                name: 'isPrimary',
                displayName: 'Primary Key',
                typeName: 'boolean',
            },
            {
                name: 'isPartition',
                displayName: 'Partition Key',
                typeName: 'boolean',
            },
            {
                name: 'isSort',
                displayName: 'Sort Key',
                typeName: 'boolean',
            },
        ],
        overallCondition: 'OR',
        isDeleted: false,
        isDisabled: false,
        exclude: false,
        analyticsKey: 'table',
    },
]

export const glossaryFilters = [
    {
        id: 'certificateStatus',
        label: 'Certificate',
        component: 'certificate',
        overallCondition: 'OR',
        attributes: [],
        isDeleted: false,
        isDisabled: false,
        exclude: false,
    },
    {
        id: 'owners',
        label: 'Owners',
        component: 'owners',
        overallCondition: 'OR',
        attributes: [],
        isDeleted: false,
        isDisabled: false,
        exclude: false,
    },
    {
        id: 'properties',
        label: 'Properties',
        component: 'properties',
        attributes: [
            {
                name: 'name.keyword',
                displayName: 'Name',
                typeName: 'string',
                description: 'Name of the asset',
                isMandatory: true,
            },
            {
                name: '__modifiedBy',
                displayName: 'Last updated by',
                typeName: 'string',
                subTypeName: 'user',
                description: 'User who last updated the asset on Atlan',
                isMandatory: true,
            },
            {
                name: '__modificationTimestamp.date',
                displayName: 'Last updated at',
                typeName: 'date',
                description: 'Last updated timestamp of the asset on Atlan',
                isMandatory: true,
            },
            {
                name: '__guid',
                displayName: 'Unique identifier',
                description: 'Unique Id for Assets',
                typeName: 'string',
                isMandatory: true,
            },
            {
                name: 'qualifiedName',
                displayName: 'Qualified name',
                description: 'Unique name for asset',
                typeName: 'string',
                isMandatory: true,
            },
            {
                name: '__createdBy',
                displayName: 'Created by',
                typeName: 'string',
                subTypeName: 'user',
                description: 'User who created the asset on Atlan',
                isMandatory: true,
            },
        ],
        overallCondition: 'OR',
        isDeleted: false,
        isDisabled: false,
        exclude: false,
    },
]
