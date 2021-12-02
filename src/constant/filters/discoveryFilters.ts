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
            {
                name: '__hasLineage',
                displayName: 'Lineage',
                typeName: 'boolean',
                description: 'All assets which have lineage relationship',
                isMandatory: true,
            },
        ],
        overallCondition: 'OR',
        isDeleted: false,
        isDisabled: false,
        exclude: false,
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
                displayName: 'Size(Bytes)',
                typeName: 'long',
            },
            {
                name: 'schemaName',
                displayName: 'Schema Name',
                typeName: 'string',
            },
            {
                name: 'databaseName',
                displayName: 'Database Name',
                typeName: 'string',
            },
        ],
        overallCondition: 'OR',
        isDeleted: false,
        isDisabled: false,
        exclude: false,
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
                name: 'tableName',
                displayName: 'Table Name',
                typeName: 'string',
            },
            {
                name: 'viewName',
                displayName: 'View Name',
                typeName: 'string',
            },
            {
                name: 'schemaName',
                displayName: 'Schema Name',
                typeName: 'string',
            },
            {
                name: 'databaseName',
                displayName: 'Database Name',
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

export const packageFilters = [
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
]
