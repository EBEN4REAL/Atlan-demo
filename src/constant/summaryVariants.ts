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
        components: ['WorkspaceRelationsCount', 'Connection'],
        includes: ['PowerBIWorkspace'],
    },
    {
        id: 'datasource',
        label: 'Datasource',
        components: ['ParentWorkspace', 'Connection'],
        includes: ['PowerBIDatasource'],
    },
    {
        id: 'dataset',
        label: 'Dataset',
        components: ['ParentWorkspace', 'Connection'],
        includes: ['PowerBIDataset'],
    },
    {
        id: 'dataflow',
        label: 'Dataflow',
        components: ['ParentWorkspace', 'Connection'],
        includes: ['PowerBIDataflow'],
    },
    {
        id: 'report',
        label: 'Report',
        components: ['ParentWorkspace', 'Pages', 'Connection'],
        includes: ['PowerBIReport'],
    },
    {
        id: 'dashboard',
        label: 'Dashboard',
        components: ['ParentWorkspace', 'Tiles', 'Connection'],
        includes: ['PowerBIDashboard'],
    },
    {
        id: 'page',
        label: 'Page',
        components: [/* 'ParentWorkspace', */ 'ParentReport', 'Connection'],
        includes: ['PowerBIPage'],
    },
    {
        id: 'tile',
        label: 'Tile',
        components: [/* 'ParentWorkspace', */ 'ParentDashboard', 'Connection'],
        includes: ['PowerBITile'],
    },
]
