export const summaryVariants = [
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
        includes: ['View', 'MaterialisedViews'],
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
        components: ['ParentGlossary', 'TermsCount'],
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
            'ParentDataset',
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
            'ParentWorkspace',
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
            'ParentWorkspace',
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
            'ParentWorkspace',
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
            'ParentWorkspace',
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
            'ParentReport',
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
            'ParentDashboard',
            'Connection',
            'SourceCreated',
            'SourceUpdated',
        ],
        includes: ['PowerBITile'],
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
            'ParentSite',
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
            'ParentProject',
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
            'ParentWorkbook',
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
            'ParentWorkbook',
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
            'ParentWorkbook',
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
            'ParentDatasource',
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
            'ParentDatasource',
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
            'ParentProject',
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
            'ParentProject',
            'Connection',
            'SourceCreated',
            'SourceUpdated',
        ],
        includes: ['TableauMetric'],
    },
]
