export const summaryVariants = [
    {
        id: 'schema',
        label: 'Schema',
        components: ['ParentContext', 'TableCount', 'ViewCount', 'Connection'],
        includes: ['Schema'],
    },
    {
        id: 'table',
        label: 'Table',
        components: ['Rows', 'Columns', 'Connection'],
        includes: ['Table', 'PartitionTable'],
    },
    {
        id: 'view',
        label: 'View',
        components: ['Definition', 'Columns', 'Connection'],
        includes: ['View', 'MaterialisedView'],
    },
    {
        id: 'glossary',
        label: 'Glossary',
        components: ['TermsCount', 'CategoriesCount'],
        includes: ['AtlasGlossary'],
    },
    {
        id: 'category',
        label: 'Category',
        components: ['ParentGlossary'],
        includes: ['AtlasGlossaryCategory'],
    },
    {
        id: 'term',
        label: 'Term',
        components: ['ParentGlossary', 'Categories'],
        includes: ['AtlasGlossaryTerm'],
    },
    {
        id: 'workspace',
        label: 'Workspace',
        components: [
            'WorkspaceRelationsCount',
            'Connection',
            'SourceCreated',
            'SourceUpdated',
        ],
        includes: ['PowerBIWorkspace'],
    },
    {
        id: 'powerBIDatasource',
        label: 'Datasource',
        components: [
            'ParentContext',
            'Connection',
            'SourceCreated',
            'SourceUpdated',
        ],
        includes: ['PowerBIDatasource'],
    },
    {
        id: 'dataset',
        label: 'Dataset',
        components: [
            'ParentContext',
            'Connection',
            'SourceCreated',
            'SourceUpdated',
        ],
        includes: ['PowerBIDataset'],
    },
    {
        id: 'dataflow',
        label: 'Dataflow',
        components: [
            'ParentContext',
            'Connection',
            'SourceCreated',
            'SourceUpdated',
        ],
        includes: ['PowerBIDataflow'],
    },
    {
        id: 'report',
        label: 'Report',
        components: [
            'ParentContext',
            'Pages',
            'Connection',
            'SourceCreated',
            'SourceUpdated',
        ],
        includes: ['PowerBIReport'],
    },
    {
        id: 'powerBIDashboard',
        label: 'Dashboard',
        components: [
            'ParentContext',
            'Tiles',
            'Connection',
            'SourceCreated',
            'SourceUpdated',
        ],
        includes: ['PowerBIDashboard'],
    },
    {
        id: 'page',
        label: 'Page',
        components: [
            'ParentContext',
            'Connection',
            'SourceCreated',
            'SourceUpdated',
        ],
        includes: ['PowerBIPage'],
    },
    {
        id: 'tile',
        label: 'Tile',
        components: [
            'ParentContext',
            'Connection',
            'SourceCreated',
            'SourceUpdated',
        ],
        includes: ['PowerBITile'],
    },
    {
        id: 'powerBITable',
        label: 'Table',
        components: [
            'ParentContext',
            'PowerBITableCounts',
            'Connection',
            'SourceCreated',
            'SourceUpdated',
        ],
        includes: ['PowerBITable'],
    },
    {
        id: 'powerBIColumn',
        label: 'Column',
        components: [
            'ParentContext',
            'Connection',
            'SourceCreated',
            'SourceUpdated',
        ],
        includes: ['PowerBIColumn'],
    },
    {
        id: 'powerBIMeasure',
        label: 'Measure',
        components: [
            'ParentContext',
            'Connection',
            'SourceCreated',
            'SourceUpdated',
        ],
        includes: ['PowerBIMeasure'],
    },
    {
        id: 'site',
        label: 'Site',
        components: ['Connection', 'SourceCreated', 'SourceUpdated'],
        includes: ['TableauSite'],
    },
    {
        id: 'project',
        label: 'Project',
        components: [
            'ParentContext',
            'Connection',
            'SourceCreated',
            'SourceUpdated',
        ],
        includes: ['TableauProject'],
    },
    {
        id: 'workbook',
        label: 'Workbook',
        components: [
            'ParentContext',
            'Connection',
            'SourceCreated',
            'SourceUpdated',
        ],
        includes: ['TableauWorkbook'],
    },
    {
        id: 'worksheet',
        label: 'Worksheet',
        components: [
            'ParentContext',
            'Connection',
            'SourceCreated',
            'SourceUpdated',
        ],
        includes: ['TableauWorksheet'],
    },
    {
        id: 'tableauDashboard',
        label: 'Dashboard',
        components: [
            'ParentContext',
            'Connection',
            'SourceCreated',
            'SourceUpdated',
        ],
        includes: ['TableauDashboard'],
    },
    {
        id: 'tableauDatasource',
        label: 'Datasource',
        components: [
            'ParentContext',
            'Connection',
            'SourceCreated',
            'SourceUpdated',
        ],
        includes: ['TableauDatasource'],
    },
    {
        id: 'calculatedField',
        label: 'Calculated Field',
        components: [
            'ParentContext',
            'Connection',
            'SourceCreated',
            'SourceUpdated',
        ],
        includes: ['TableauCalculatedField'],
    },
    {
        id: 'datasourceField',
        label: 'Datasource Field',
        components: [
            'ParentContext',
            'Connection',
            'SourceCreated',
            'SourceUpdated',
        ],
        includes: ['TableauDatasourceField'],
    },
    {
        id: 'flow',
        label: 'Flow',
        components: [
            'ParentContext',
            'Connection',
            'SourceCreated',
            'SourceUpdated',
        ],
        includes: ['TableauFlow'],
    },
    {
        id: 'metric',
        label: 'Metric',
        components: [
            'ParentContext',
            'Connection',
            'SourceCreated',
            'SourceUpdated',
        ],
        includes: ['TableauMetric'],
    },
    {
        id: 'lookerDashboard',
        label: 'Dashboard',
        components: [
            'ParentContext',
            'SourceViewCount',
            'Connection',
            'SourceCreated',
            'SourceUpdated',
        ],
        includes: ['LookerDashboard'],
    },
    {
        id: 'lookerExplore',
        label: 'Explore',
        components: [
            'ParentContext',
            'Connection',
            'SourceCreated',
            'SourceUpdated',
        ],
        includes: ['LookerExplore'],
    },
    {
        id: 'lookerField',
        label: 'Field',
        components: [
            'ParentContext',
            'Connection',
            'SourceCreated',
            'SourceUpdated',
        ],
        includes: ['LookerField'],
    },
    {
        id: 'lookerFolder',
        label: 'Folder',
        components: [
            'SubFolderCount',
            'Connection',
            'SourceCreated',
            'SourceUpdated',
        ],
        includes: ['LookerFolder'],
    },
    {
        id: 'lookerLook',
        label: 'Look',
        components: [
            'ParentContext',
            'SourceViewCount',
            'Connection',
            'SourceCreated',
            'SourceUpdated',
        ],
        includes: ['LookerLook'],
    },
    {
        id: 'lookerModel',
        label: 'Model',
        components: [
            'ParentContext',
            'Connection',
            'SourceCreated',
            'SourceUpdated',
        ],
        includes: ['LookerModel'],
    },
    {
        id: 'lookerProject',
        label: 'Project',
        components: ['Connection', 'SourceCreated', 'SourceUpdated'],
        includes: ['LookerProject'],
    },
    {
        id: 'lookerQuery',
        label: 'Query',
        components: ['Connection', 'SourceCreated', 'SourceUpdated'],
        includes: ['LookerQuery'],
    },
    {
        id: 'lookerTile',
        label: 'Tile',
        components: [
            'ParentContext',
            'Connection',
            'SourceCreated',
            'SourceUpdated',
        ],
        includes: ['LookerTile'],
    },
    {
        id: 'lookerView',
        label: 'View',
        components: ['Connection', 'SourceCreated', 'SourceUpdated'],
        includes: ['LookerView'],
    },
    {
        id: 'salesforceOrganization',
        label: 'Organization',
        components: ['Connection', 'SourceCreated', 'SourceUpdated'],
        includes: ['SalesforceOrganization'],
    },
    {
        id: 'salesforceDashboard',
        label: 'Dashboard',
        components: [
            'ParentContext',
            'ReportCount',
            'Connection',
            'SourceCreated',
            'SourceUpdated',
        ],
        includes: ['SalesforceDashboard'],
    },
    {
        id: 'salesforceReport',
        label: 'Report',
        components: [
            'ParentContext',
            'Connection',
            'SourceCreated',
            'SourceUpdated',
        ],
        includes: ['SalesforceReport'],
    },
    {
        id: 'salesforceObject',
        label: 'Object',
        components: [
            'ParentContext',
            'FieldCount',
            'Connection',
            'SourceCreated',
            'SourceUpdated',
        ],
        includes: ['SalesforceObject'],
    },
    {
        id: 'salesforceField',
        label: 'Field',
        components: [
            'ParentContext',
            'Connection',
            'SourceCreated',
            'SourceUpdated',
        ],
        includes: ['SalesforceField'],
    },
    {
        id: 's3Bucket',
        label: 'Bucket',
        components: ['S3ObjectCount', 'Connection'],
        includes: ['S3Bucket'],
    },
    {
        id: 's3Object',
        label: 'Object',
        components: ['ParentContext', 'Connection'],
        includes: ['S3Object'],
    },
    {
        id: 'dataStudioAsset',
        label: 'Data Studio Asset',
        components: ['Connection'],
        includes: ['DataStudioAsset'],
    },
]
