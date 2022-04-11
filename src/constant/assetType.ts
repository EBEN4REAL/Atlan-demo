export const assetTypeList: {
    id: string
    label: string
    fullLabel?: string
    nameAttribute?: string
    qualifiedNameAttribute?: string
    image?: string
    source?: string
    categoryType?: string
    parents?: string[]
    children?: string[]
    isDiscoverable?: boolean
    orderWeight?: number
    count?: number
    relationships?: string[]
    groupOrder?: number
    priorityOrder?: number
}[] = [
    {
        id: 'Connection',
        label: 'Connection',
        nameAttribute: 'connectionName',
        qualifiedNameAttribute: 'connectionQualifiedName',
        parents: [],
        children: ['Column'],
        count: 0,
        image: 'Connection',
        relationships: [],
        groupOrder: 50, // For grouping according to asset types
        // Connection, Schema, Database will always come at last
    },
    {
        id: 'Database',
        label: 'Database',
        nameAttribute: 'databaseName',
        qualifiedNameAttribute: 'databaseQualifiedName',
        parents: ['AtlanConnection'],
        categoryType: 'SQL',
        children: ['Column'],
        isDiscoverable: false,
        image: 'DatabaseGray',
        count: 0,
        relationships: ['schemas'],
        groupOrder: 50,
    },
    {
        id: 'Schema',
        label: 'Schema',
        nameAttribute: 'schemaName',
        qualifiedNameAttribute: 'schemaQualifiedName',
        parents: ['AtlanConnection', 'AtlanDatabase'],
        children: ['Column'],
        categoryType: 'SQL',
        isDiscoverable: false,
        image: 'SchemaGray',
        count: 0,
        relationships: [
            'tables',
            'views',
            'partitions',
            'procedures',
            'materialisedViews',
        ],
        groupOrder: 50,
    },
    {
        id: 'View',
        label: 'View',
        nameAttribute: 'viewName',
        qualifiedNameAttribute: 'viewQualifiedName',
        parents: ['Connection', 'Database', 'Schema'],
        children: ['Table', 'Column'],
        isDiscoverable: true,
        orderWeight: 90,
        categoryType: 'SQL',
        count: 0,
        image: 'ViewGray',
        relationships: [],
        groupOrder: 1,
        priorityOrder: 2, // For deciding the priority within this group
    },
    {
        id: 'Table',
        label: 'Table',
        nameAttribute: 'tableName',
        qualifiedNameAttribute: 'tableQualifiedName',
        parents: ['Connection', 'Database', 'Schema'],
        children: ['Column'],
        isDiscoverable: true,
        orderWeight: 100,
        categoryType: 'SQL',
        count: 0,
        image: 'TableGray',
        relationships: [],
        groupOrder: 1,
        priorityOrder: 1,
    },
    {
        id: 'TablePartition',
        label: 'Table Partition',
        nameAttribute: 'partitionName',
        qualifiedNameAttribute: 'partitionQualifiedName',
        parents: ['Connection', 'Database', 'Schema'],
        children: ['Column'],
        image: 'TablePartition',
        isDiscoverable: true,
        orderWeight: 100,
        categoryType: 'SQL',
        count: 0,
        relationships: [],
        groupOrder: 1,
        priorityOrder: 3,
    },
    {
        id: 'MaterialisedView',
        label: 'Materialised View',
        nameAttribute: 'materialisedView',
        qualifiedNameAttribute: 'materialisedViewQualifiedName',
        parents: ['Connection', 'Database', 'Schema'],
        children: ['Column'],
        isDiscoverable: true,
        image: 'MaterialisedView',
        categoryType: 'SQL',
        orderWeight: 100,
        count: 0,
        relationships: [],
        groupOrder: 1,
        priorityOrder: 4,
    },
    {
        id: 'Column',
        label: 'Column',
        nameAttribute: '',
        qualifiedNameAttribute: 'databaseQualifiedName',
        parents: ['Connection', 'Database', 'Schema', 'Table', 'View'],
        children: [],
        isDiscoverable: true,
        orderWeight: 80,
        categoryType: 'SQL',
        count: 0,
        image: 'ColumnGray',
        relationships: [],
        groupOrder: 1,
        priorityOrder: 5,
    },
    /*  {
            id: 'Procedure',
            label: 'Procedure',
            nameAttribute: 'procedureName',
            qualifiedNameAttribute: 'procedureQualifiedName',
            parents: ['Connection', 'Database', 'Schema'],
            children: [],
            isDiscoverable: true,
            count: 0,
            relationships: [],
            groupOrder: 1,
            priorityOrder: 5,
        }, */
    {
        id: 'Query',
        label: 'Query',
        nameAttribute: 'queryName',
        qualifiedNameAttribute: 'queryQualifiedName',
        parents: ['Connection', 'Database', 'Schema'],
        children: [],
        isDiscoverable: true,
        orderWeight: 70,
        categoryType: 'Insights',
        count: 0,
        image: 'Query',
        relationships: ['tables', 'views', 'columns'],
        groupOrder: 1,
        priorityOrder: 5,
    },
    {
        id: 'Folder',
        label: 'Folder',
        qualifiedNameAttribute: 'parentQualifiedName',
        parents: ['Connection', 'Database', 'Schema'],
        children: ['Query'],
        isDiscoverable: false,
        categoryType: 'Insights',
        orderWeight: 60,
        count: 0,
        groupOrder: 1,
        priorityOrder: 6,
    },
    {
        id: 'Collection',
        label: 'Collection',
        parents: ['Connection', 'Database', 'Schema'],
        children: ['Query'],
        isDiscoverable: false,
        categoryType: 'Insights',
        image: 'CollectionIconSmallGray',
        orderWeight: 60,
        count: 0,
        groupOrder: 1,
        priorityOrder: 7,
        relationships: ['childrenQueries'],
    },
    {
        id: 'AtlasGlossary',
        label: 'Glossary',
        isDiscoverable: false,
        image: 'Glossary',
        relationships: [],
        groupOrder: 2,
        categoryType: 'BusinessTerms',
    },
    {
        id: 'AtlasGlossaryTerm',
        label: 'Term',
        fullLabel: 'Glossary Term',
        isDiscoverable: true,
        image: 'Term',
        relationships: [],
        groupOrder: 2,
        categoryType: 'BusinessTerms',
    },
    {
        id: 'AtlasGlossaryCategory',
        label: 'Category',
        fullLabel: 'Glossary Category',
        isDiscoverable: true,
        image: 'Category',
        relationships: [],
        groupOrder: 2,
        categoryType: 'BusinessTerms',
    },
    {
        id: 'Process',
        label: 'Process',
        isDiscoverable: false,
        image: 'Process',
        relationships: [],
        groupOrder: 9,
        categoryType: 'Lineage',
    },
    {
        id: 'ColumnProcess',
        label: 'Column Process',
        isDiscoverable: false,
        image: 'ColumnProcess',
        relationships: [],
        groupOrder: 9,
        categoryType: 'Lineage',
    },
    {
        id: 'TableauSite',
        label: 'Site',
        fullLabel: 'Tableau Site',
        nameAttribute: 'siteName',
        isDiscoverable: true,
        parents: [],
        image: 'Tableau',
        source: 'Tableau',
        categoryType: 'BI',
        relationships: ['projects'],
        groupOrder: 3,
    },
    {
        id: 'TableauProject',
        label: 'Project',
        fullLabel: 'Tableau Project',
        nameAttribute: 'projectName',
        isDiscoverable: true,
        // in order of hierarchy
        parents: ['TableauSite'],
        categoryType: 'BI',
        image: 'Tableau',
        source: 'Tableau',
        relationships: [
            'workbooks',
            'site',
            'datasources',
            'flows',
            'metrics',
            'parentProject',
            'childProjects',
        ],
        groupOrder: 3,
    },
    {
        id: 'TableauWorkbook',
        label: 'Workbook',
        fullLabel: 'Tableau Workbook',
        nameAttribute: 'workbookName',
        isDiscoverable: true,
        image: 'Tableau',
        source: 'Tableau',
        parents: ['TableauProject'],
        categoryType: 'BI',
        relationships: ['worksheets', 'datasources', 'project', 'dashboards'],
        groupOrder: 3,
    },
    {
        id: 'TableauWorksheet',
        label: 'Worksheet',
        fullLabel: 'Tableau Worksheet',
        isDiscoverable: true,
        image: 'Tableau',
        source: 'Tableau',
        parents: ['TableauWorkbook'],
        categoryType: 'BI',
        relationships: [
            'workbook',
            'dashboards',
            'datasourceFields',
            'calculatedFields',
        ],
        groupOrder: 3,
    },
    {
        id: 'TableauDashboard',
        label: 'Dashboard',
        fullLabel: 'Tableau Dashboard',
        isDiscoverable: true,
        image: 'Tableau',
        source: 'Tableau',
        parents: ['TableauWorkbook'],
        categoryType: 'BI',
        relationships: ['workbook', 'worksheets'],
        groupOrder: 3,
    },
    {
        id: 'TableauDatasource',
        label: 'Datasource',
        fullLabel: 'Tableau Datasource',
        nameAttribute: 'datasourceName',
        isDiscoverable: true,
        image: 'Tableau',
        source: 'Tableau',
        parents: ['TableauWorkbook'],
        categoryType: 'BI',
        relationships: ['workbook', 'project', 'fields'],
        groupOrder: 3,
    },
    {
        id: 'TableauDatasourceField',
        label: 'Datasource Field',
        fullLabel: 'Tableau Field',
        parents: ['TableauWorkbook'],
        isDiscoverable: true,
        image: 'Tableau',
        source: 'Tableau',
        relationships: ['datasource', 'worksheets'],
        categoryType: 'BI',
        groupOrder: 3,
    },
    {
        id: 'TableauCalculatedField',
        label: 'Calculated Field',
        fullLabel: 'Tableau Calculated Field',
        isDiscoverable: true,
        image: 'Tableau',
        source: 'Tableau',
        parents: ['TableauWorkbook'],
        categoryType: 'BI',
        relationships: ['worksheets', 'datasource'],
        groupOrder: 3,
    },
    {
        id: 'TableauFlow',
        label: 'Flow',
        fullLabel: 'Tableau Flow',
        isDiscoverable: true,
        image: 'Tableau',
        source: 'Tableau',
        parents: ['TableauProject'],
        categoryType: 'BI',
        relationships: ['project'],
        groupOrder: 3,
    },
    {
        id: 'TableauMetric',
        label: 'Metric',
        fullLabel: 'Tableau Metric',
        isDiscoverable: true,
        image: 'Tableau',
        source: 'Tableau',
        parents: ['TableauProject'],
        categoryType: 'BI',
        relationships: ['project'],
        groupOrder: 3,
    },
    {
        id: 'PowerBIWorkspace',
        label: 'Workspace',
        fullLabel: 'PowerBI Workspace',
        isDiscoverable: true,
        image: 'PowerBI',
        source: 'PowerBI',
        parents: [],
        children: ['PowerBIDashboard'],
        categoryType: 'BI',
        relationships: ['reports', 'datasets', 'dashboards', 'dataflows'],
        groupOrder: 4,
    },
    {
        id: 'PowerBIDashboard',
        label: 'Dashboard',
        fullLabel: 'PowerBI Dashboard',
        isDiscoverable: true,
        image: 'PowerBI',
        source: 'PowerBI',
        parents: ['PowerBIWorkspace'],
        categoryType: 'BI',
        children: ['PowerBITile'],
        relationships: ['tiles', 'workspace'],
        groupOrder: 4,
    },
    {
        id: 'PowerBIReport',
        label: 'Report',
        fullLabel: 'PowerBI Report',
        isDiscoverable: true,
        image: 'PowerBI',
        source: 'PowerBI',
        parents: ['PowerBIWorkspace'],
        categoryType: 'BI',
        children: ['PowerBIPage'],
        relationships: ['workspace', 'pages', 'tiles', 'dataset'],
        groupOrder: 4,
    },
    {
        id: 'PowerBIDataset',
        label: 'Dataset',
        fullLabel: 'PowerBI Dataset',
        isDiscoverable: true,
        image: 'PowerBI',
        source: 'PowerBI',
        parents: ['PowerBIWorkspace'],
        children: ['PowerBIDatasource'],
        categoryType: 'BI',
        relationships: [
            'workspace',
            'datasources',
            'reports',
            'tiles',
            'dataflows',
        ],
        groupOrder: 4,
    },
    {
        id: 'PowerBIDataflow',
        label: 'Dataflow',
        fullLabel: 'PowerBI Dataflow',
        isDiscoverable: true,
        image: 'PowerBI',
        source: 'PowerBI',
        parents: ['PowerBIWorkspace'],
        categoryType: 'BI',
        relationships: ['workspace', 'datasets'],
        groupOrder: 4,
    },
    {
        id: 'PowerBITile',
        label: 'Tile',
        fullLabel: 'PowerBI Tile',
        isDiscoverable: true,
        image: 'PowerBI',
        source: 'PowerBI',
        categoryType: 'BI',
        parents: ['PowerBIWorkspace', 'PowerBIDashboard'],
        relationships: ['dashboard', 'dataset', 'report'],
        groupOrder: 4,
    },
    {
        id: 'PowerBIPage',
        label: 'Page',
        fullLabel: 'PowerBI Page',
        isDiscoverable: true,
        image: 'PowerBI',
        source: 'PowerBI',
        categoryType: 'BI',
        parents: ['PowerBIWorkspace', 'PowerBIReport'],
        relationships: ['report'],
        groupOrder: 4,
    },
    {
        id: 'PowerBIDatasource',
        label: 'Datasource',
        fullLabel: 'PowerBI Datasource',
        isDiscoverable: true,
        image: 'PowerBI',
        source: 'PowerBI',
        categoryType: 'BI',
        parents: ['PowerBIWorkspace', 'PowerBIDataset'],
        relationships: ['datasets'],
        groupOrder: 4,
    },
    {
        id: 'LookerDashboard',
        label: 'Dashboard',
        fullLabel: 'Looker Dashboard',
        isDiscoverable: true,
        image: 'Looker',
        source: 'Looker',
        categoryType: 'BI',
        parents: ['LookerFolder'],
        relationships: ['folder', 'looks', 'tiles'],
        groupOrder: 5,
    },
    {
        id: 'LookerExplore',
        label: 'Explore',
        fullLabel: 'Looker Explore',
        isDiscoverable: true,
        image: 'Looker',
        source: 'Looker',
        parents: [],
        categoryType: 'BI',
        relationships: ['project', 'model'],
        groupOrder: 5,
    },
    {
        id: 'LookerField',
        label: 'Field',
        fullLabel: 'Looker Field',
        isDiscoverable: true,
        image: 'Looker',
        source: 'Looker',
        parents: [],
        categoryType: 'BI',
        relationships: ['project', 'model'],
        groupOrder: 5,
    },
    {
        id: 'LookerFolder',
        label: 'Folder',
        fullLabel: 'Looker Folder',
        isDiscoverable: true,
        image: 'Looker',
        source: 'Looker',
        parents: [],
        categoryType: 'BI',
        relationships: ['looks', 'dashboards'],
        groupOrder: 5,
    },
    {
        id: 'LookerLook',
        label: 'Look',
        fullLabel: 'Looker Look',
        isDiscoverable: true,
        image: 'Looker',
        source: 'Looker',
        parents: [],
        categoryType: 'BI',
        relationships: ['folder', 'query', 'model', 'tile', 'dashboard'],
        groupOrder: 5,
    },
    {
        id: 'LookerModel',
        label: 'Model',
        fullLabel: 'Looker Model',
        isDiscoverable: true,
        image: 'Looker',
        source: 'Looker',
        parents: [],
        categoryType: 'BI',
        relationships: ['explores', 'queries', 'project', 'fields', 'look'],
        groupOrder: 5,
    },
    {
        id: 'LookerProject',
        label: 'Project',
        fullLabel: 'Looker Project',
        isDiscoverable: true,
        image: 'Looker',
        source: 'Looker',
        parents: [],
        categoryType: 'BI',
        relationships: ['explores', 'models', 'fields'],
        groupOrder: 5,
    },
    {
        id: 'LookerQuery',
        label: 'Query',
        fullLabel: 'Looker Query',
        isDiscoverable: true,
        image: 'Looker',
        source: 'Looker',
        parents: [],
        categoryType: 'BI',
        relationships: ['tiles', 'model', 'looks'],
        groupOrder: 5,
    },
    {
        id: 'LookerTile',
        label: 'Tile',
        fullLabel: 'Looker Tile',
        isDiscoverable: true,
        image: 'Looker',
        source: 'Looker',
        parents: [],
        categoryType: 'BI',
        relationships: ['query', 'dashboard', 'look'],
        groupOrder: 5,
    },
    {
        id: 'SalesforceOrganization',
        label: 'Organization',
        fullLabel: 'Salesforce Organization',
        isDiscoverable: true,
        image: 'Salesforce',
        source: 'Salesforce',
        categoryType: 'SaaS',
        relationships: ['reports', 'objects', 'dashboards'],
        groupOrder: 6,
        priorityOrder: 5,
    },
    {
        id: 'SalesforceDashboard',
        label: 'Dashboard',
        fullLabel: 'Salesforce Dashboard',
        isDiscoverable: true,
        image: 'Salesforce',
        source: 'Salesforce',
        categoryType: 'SaaS',
        parents: ['SalesforceOrganization'],
        relationships: ['reports', 'organization'],
        groupOrder: 6,
        priorityOrder: 4,
    },

    {
        id: 'SalesforceReport',
        label: 'Report',
        fullLabel: 'Salesforce Report',
        isDiscoverable: true,
        image: 'Salesforce',
        source: 'Salesforce',
        categoryType: 'SaaS',
        parents: ['SalesforceOrganization'],
        relationships: ['dashboards', 'organization'],
        groupOrder: 6,
        priorityOrder: 3,
    },
    {
        id: 'SalesforceObject',
        label: 'Object',
        fullLabel: 'Salesforce Object',
        isDiscoverable: true,
        image: 'Salesforce',
        source: 'Salesforce',
        categoryType: 'SaaS',
        parents: ['SalesforceOrganization'],
        relationships: ['lookupFields', 'organization'],
        groupOrder: 6,
        priorityOrder: 1,
    },
    {
        id: 'SalesforceField',
        label: 'Field',
        fullLabel: 'Salesforce Field',
        isDiscoverable: true,
        image: 'Salesforce',
        source: 'Salesforce',
        categoryType: 'SaaS',
        parents: ['SalesforceObject'],
        relationships: ['lookupObjects'],
        groupOrder: 6,
        priorityOrder: 2,
    },
]
