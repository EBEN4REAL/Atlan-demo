// import { CheckboxArray } from '~/types'

export const List: any = [
    {
        id: 'datasets',
        include: ['View', 'Table', 'TablePartition', 'MaterialisedView'],
        includeLabels:['View', 'Table', 'Table Partition', 'Materialised View'],
        label: 'Datasets',
        description: 'Datasets',
    },
    {
        id: 'fields',
        label: 'Fields',
        include: ['Column'],
        includeLabels:['Column'],
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
        includeLabels: [
            'Tableau Site',
            'Tableau Project',
            'Tableau Workbook',
            'Tableau Worksheet',
            'Tableau Dashboard',
            'Tableau Datasource',
            'Power BI Workspace',
            'Power BI Dashboard',
            'Power BI Report',
            'Power BI Dataset',
            'Power BI Dataflow',
            'Power BI Tile',
            'Power BI Page',
            'Power BI Datasource'
        ],
        description: 'Visualizations',
    },
]
