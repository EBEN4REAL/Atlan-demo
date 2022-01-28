export const assetTypeList: {
    id: string
    label: string
    nameAttribute?: string
    qualifiedNameAttribute?: string
    image?: string
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
        relationships: [],
        groupOrder: 5, // For grouping according to asset types
    },
    {
        id: 'Database',
        label: 'Database',
        nameAttribute: 'databaseName',
        qualifiedNameAttribute: 'databaseQualifiedName',
        parents: ['AtlanConnection'],
        children: ['Column'],
        isDiscoverable: false,
        image: 'DatabaseGray',
        count: 0,
        relationships: [],
        groupOrder: 5,
    },
    {
        id: 'Schema',
        label: 'Schema',
        nameAttribute: 'schemaName',
        qualifiedNameAttribute: 'schemaQualifiedName',
        parents: ['AtlanConnection', 'AtlanDatabase'],
        children: ['Column'],
        isDiscoverable: false,
        image: 'SchemaGray',
        count: 0,
        relationships: [],
        groupOrder: 5,
    },
    {
        id: 'View',
        label: 'View',
        nameAttribute: 'viewName',
        qualifiedNameAttribute: 'viewQualifiedName',
        parents: ['Connection', 'Database', 'Schema'],
        children: ['Column'],
        isDiscoverable: true,
        orderWeight: 90,
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
        count: 0,
        image: 'TableGray',
        relationships: [],
        groupOrder: 1,
        priorityOrder: 1,
    },
    {
        id: 'TablePartition',
        label: 'Partition',
        nameAttribute: 'partitionName',
        qualifiedNameAttribute: 'partitionQualifiedName',
        parents: ['Connection', 'Database', 'Schema'],
        children: ['Column'],
        isDiscoverable: true,
        orderWeight: 100,
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
         groupOrder: 1,priorityOrder: 5,
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
        count: 0,
        image: 'Query',
        relationships: ['tables', 'views', 'columns'],
        groupOrder: 1,
        priorityOrder: 5,
    },
    /*   {
        id: 'Folder',
        label: 'Folder',
        qualifiedNameAttribute: 'parentQualifiedName',
        parents: ['Connection', 'Database', 'Schema'],
        children: ['Query'],
        isDiscoverable: true,
        orderWeight: 60,
        count: 0,
         groupOrder: 1,priorityOrder: 5,
    }, */
    {
        id: 'AtlasGlossaryTerm',
        label: 'Term',
        isDiscoverable: true,
        image: 'Term',
        relationships: [],
        groupOrder: 2,
    },
    {
        id: 'AtlasGlossaryCategory',
        label: 'Categories',
        isDiscoverable: true,
        image: 'Category',
        relationships: [],
        groupOrder: 2,
    },
    {
        id: 'TableauSite',
        label: 'Site',
        nameAttribute: 'siteName',
        isDiscoverable: true,
        parents: [],
        image: 'Tableau',
        relationships: ['projects'],
        groupOrder: 3,
    },
    {
        id: 'TableauProject',
        label: 'Project',
        nameAttribute: 'projectName',
        isDiscoverable: true,
        // in order of hierarchy
        parents: ['TableauSite'],
        image: 'Tableau',
        relationships: ['workbooks', 'site', 'datasources', 'flows', 'metrics'],
        groupOrder: 3,
    },
    {
        id: 'TableauWorkbook',
        label: 'Workbook',
        nameAttribute: 'workbookName',
        isDiscoverable: true,
        image: 'Tableau',
        parents: ['TableauProject'],
        relationships: ['worksheets', 'datasources', 'project', 'dashboards'],
        groupOrder: 3,
    },
    {
        id: 'TableauWorksheet',
        label: 'Worksheet',
        isDiscoverable: true,
        image: 'Tableau',
        parents: ['TableauWorkbook'],
        relationships: ['workbook', 'dashboards'],
        groupOrder: 3,
    },
    {
        id: 'TableauDashboard',
        label: 'Dashboard',
        isDiscoverable: true,
        image: 'Tableau',
        parents: ['TableauWorkbook'],
        relationships: ['workbook', 'worksheets'],
        groupOrder: 3,
    },
    {
        id: 'TableauDatasource',
        label: 'Datasource',
        nameAttribute: 'datasourceName',
        isDiscoverable: true,
        image: 'Tableau',
        parents: ['TableauWorkbook'],
        relationships: ['workbook', 'project', 'fields'],
        groupOrder: 3,
    },
    {
        id: 'TableauDatasourceField',
        label: 'Datasource Field',
        parents: ['TableauWorkbook'],
        isDiscoverable: true,
        image: 'Tableau',
        relationships: ['datasource'],
        groupOrder: 3,
    },
    {
        id: 'TableauCalculatedField',
        label: 'Calculated Field',
        isDiscoverable: true,
        image: 'Tableau',
        parents: ['TableauWorkbook'],
        relationships: ['datasource'],
        groupOrder: 3,
    },
    {
        id: 'TableauFlow',
        label: 'Flow',
        isDiscoverable: true,
        image: 'Tableau',
        parents: ['TableauProject'],
        relationships: ['project'],
        groupOrder: 3,
    },
    {
        id: 'TableauMetric',
        label: 'Metric',
        isDiscoverable: true,
        image: 'Tableau',
        parents: ['TableauProject'],
        relationships: ['project'],
        groupOrder: 3,
    },
    {
        id: 'PowerBIWorkspace',
        label: 'Workspace',
        isDiscoverable: true,
        image: 'PowerBI',
        parents: [],
        children: ['PowerBIDashboard'],
        relationships: ['reports', 'datasets', 'dashboards', 'dataflows'],
        groupOrder: 4,
    },
    {
        id: 'PowerBIDashboard',
        label: 'Dashboard',
        isDiscoverable: true,
        image: 'PowerBI',
        parents: ['PowerBIWorkspace'],
        children: ['PowerBITile'],
        relationships: ['tiles', 'workspace'],
        groupOrder: 4,
    },
    {
        id: 'PowerBIReport',
        label: 'Report',
        isDiscoverable: true,
        image: 'PowerBI',
        parents: ['PowerBIWorkspace'],
        children: ['PowerBIPage'],
        relationships: ['workspace', 'pages', 'tiles', 'dataset'],
        groupOrder: 4,
    },
    {
        id: 'PowerBIDataset',
        label: 'Dataset',
        isDiscoverable: true,
        image: 'PowerBI',
        parents: ['PowerBIWorkspace'],
        children: ['PowerBIDatasource'],
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
        isDiscoverable: true,
        image: 'PowerBI',
        parents: ['PowerBIWorkspace'],
        relationships: ['workspace', 'datasets'],
        groupOrder: 4,
    },
    {
        id: 'PowerBITile',
        label: 'Tile',
        isDiscoverable: true,
        image: 'PowerBI',
        parents: ['PowerBIWorkspace', 'PowerBIDashboard'],
        relationships: ['dashboard', 'dataset', 'report'],
        groupOrder: 4,
    },
    {
        id: 'PowerBIPage',
        label: 'Page',
        isDiscoverable: true,
        image: 'PowerBI',
        parents: ['PowerBIWorkspace', 'PowerBIReport'],
        relationships: ['report'],
        groupOrder: 4,
    },
    {
        id: 'PowerBIDatasource',
        label: 'Datasource',
        isDiscoverable: true,
        image: 'PowerBI',
        parents: ['PowerBIWorkspace', 'PowerBIDataset'],
        relationships: ['datasets'],
        groupOrder: 4,
    },
    {
        id: 'LookerDashboard',
        label: 'Dashboard',
        isDiscoverable: true,
        image: 'Looker',
        parents: [],
        relationships: ['folder', 'looks', 'tiles'],
        groupOrder: 6,
    },
    {
        id: 'LookerExplore',
        label: 'Explore',
        isDiscoverable: true,
        image: 'Looker',
        parents: [],
        relationships: ['project', 'model'],
        groupOrder: 6,
    },
    {
        id: 'LookerField',
        label: 'Field',
        isDiscoverable: true,
        image: 'Looker',
        parents: [],
        relationships: ['project', 'model'],
        groupOrder: 6,
    },
    {
        id: 'LookerFolder',
        label: 'Folder',
        isDiscoverable: true,
        image: 'Looker',
        parents: [],
        relationships: ['looks', 'dashboards'],
        groupOrder: 6,
    },
    {
        id: 'LookerLook',
        label: 'Look',
        isDiscoverable: true,
        image: 'Looker',
        parents: [],
        relationships: ['folder', 'query', 'model', 'tile', 'dashboard'],
        groupOrder: 6,
    },
    {
        id: 'LookerModel',
        label: 'Model',
        isDiscoverable: true,
        image: 'Looker',
        parents: [],
        relationships: ['explores', 'query', 'project', 'fields', 'look'],
        groupOrder: 6,
    },
    {
        id: 'LookerProject',
        label: 'Project',
        isDiscoverable: true,
        image: 'Looker',
        parents: [],
        relationships: ['explores', 'models', 'fields'],
        groupOrder: 6,
    },
    {
        id: 'LookerQuery',
        label: 'Query',
        isDiscoverable: true,
        image: 'Looker',
        parents: [],
        relationships: ['tile', 'model', 'look'],
        groupOrder: 6,
    },
    {
        id: 'LookerTile',
        label: 'Tile',
        isDiscoverable: true,
        image: 'Looker',
        parents: [],
        relationships: ['query', 'dashboard', 'look'],
        groupOrder: 6,
    },
]
