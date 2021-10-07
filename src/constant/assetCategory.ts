// import { CheckboxArray } from '~/types'

export const List: any = [
    {
        id: 'datasets',
        include: ['View', 'Table', 'TablePartition', 'MaterialisedView', 'TableauDatasource', 'PowerBIDataset'],
        label: 'Datasets',
        description: 'Datasets',
        popoverText: 'Tabular assets (Tables, Views, etc.)',
    },
    {
        id: 'fields',
        label: 'Fields',
        include: ['Column', 'TableauDatasourceField', 'TableauCalculatedField'],
        popoverText: 'Column assets (Columns)',
        description: 'Fields',
    },
    {
        id: 'visualizations',
        label: 'Visualizations',
        include: [
            'TableauSite',
            'TableauProject',
            'TableauWorkbook',
            'TableauWorksheet',
            'TableauDashboard',
            'PowerBIWorkspace',
            'PowerBIDashboard',
            'PowerBIReport',
            'PowerBIDataflow',
            'PowerBITile',
            'PowerBIPage',
            'PowerBIDatasource',
        ],
        popoverText: 'All assets from BI integrations',
        description: 'Visualizations',
    },
]
