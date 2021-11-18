export const summaryVariants = [
    {
        id: 'table',
        label: 'Table',
        component: 'table',
        includes: ['Table', 'PartitionTable'],
    },
    {
        id: 'view',
        label: 'View',
        component: 'view',
        includes: ['View', 'MaterialisedViews'],
    },
    {
        id: 'workspace',
        label: 'Workspace',
        component: 'workspace',
        includes: ['PowerBIWorkspace'],
    },
    {
        id: 'datasource',
        label: 'Datasource',
        component: 'datasource',
        includes: ['PowerBIDatasource'],
    },
    {
        id: 'dataset',
        label: 'Dataset',
        component: 'dataset',
        includes: ['PowerBIDataset'],
    },
    {
        id: 'dataflow',
        label: 'Dataflow',
        component: 'dataflow',
        includes: ['PowerBIDataflow'],
    },
    {
        id: 'report',
        label: 'Report',
        component: 'report',
        includes: ['PowerBIReport'],
    },
    {
        id: 'dashboard',
        label: 'Dashboard',
        component: 'dashboard',
        includes: ['PowerBIDashboard'],
    },
    {
        id: 'page',
        label: 'Page',
        component: 'page',
        includes: ['PowerBIPage'],
    },
    {
        id: 'tile',
        label: 'Tile',
        component: 'tile',
        includes: ['PowerBITile'],
    },
]
