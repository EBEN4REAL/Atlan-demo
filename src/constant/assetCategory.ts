// import { CheckboxArray } from '~/types'

export const List: any = [
    {
        id: 'datasets',
        include: ['View', 'Table', 'TablePartition', 'MaterialisedView'],
        includeLabels:['View', 'Table', 'Table Partition', 'Materialised View'],
        label: 'Datasets',
        description: 'Datasets',
        popoverText:'Tabular assets (Tables, Views, etc.)'
    },
    {
        id: 'fields',
        label: 'Fields',
        include: ['Column'],
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
            'TableauDatasource',
            'PowerBIWorkspace',
            'PowerBIDashboard',
            'PowerBIReport',
            'PowerBIDataset',
            'PowerBIDataflow',
            'PowerBITile',
            'PowerBIPage',
            'PowerBIDatasource'
        ],
        popoverText: 'All assets from BI integrations',
        description: 'Visualizations',
    },
]
