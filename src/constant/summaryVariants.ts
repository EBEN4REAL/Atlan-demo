export const summaryVariants = [
    {
        id: 'table',
        label: 'Table',
        components: ['Rows', 'Columns'],
        includes: ['Table', 'PartitionTable'],
    },
    {
        id: 'view',
        label: 'View',
        components: ['Definition', 'Columns'],
        includes: ['View', 'MaterialisedViews'],
    },
    {
        id: 'term',
        label: 'Term',
        components: ['ParentGlossary', 'Categories'],
        includes: ['AtlasGlossaryTerm'],
    },
    {
        id: 'category',
        label: 'Category',
        components: ['ParentGlossary'],
        includes: ['AtlasGlossaryCategory'],
    },
    {
        id: 'workspace',
        label: 'Workspace',
        components: ['Datasets', 'Reports', 'Dashboards'],
        includes: ['PowerBIWorkspace'],
    },
    {
        id: 'datasource',
        label: 'Datasource',
        components: ['Workspace'],
        includes: ['PowerBIDatasource'],
    },
    {
        id: 'dataset',
        label: 'Dataset',
        components: ['Workspace'],
        includes: ['PowerBIDataset'],
    },
    {
        id: 'dataflow',
        label: 'Dataflow',
        components: ['Workspace'],
        includes: ['PowerBIDataflow'],
    },
    {
        id: 'report',
        label: 'Report',
        components: ['Workspace', 'Pages'],
        includes: ['PowerBIReport'],
    },
    {
        id: 'dashboard',
        label: 'Dashboard',
        components: ['Workspace', 'Tiles'],
        includes: ['PowerBIDashboard'],
    },
    {
        id: 'page',
        label: 'Page',
        components: ['Workspace', 'Report'],
        includes: ['PowerBIPage'],
    },
    {
        id: 'tile',
        label: 'Tile',
        components: ['Workspace', 'Dashboard'],
        includes: ['PowerBITile'],
    },
]
