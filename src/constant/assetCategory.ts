// import { CheckboxArray } from '~/types'

export const List = [
    {
        id: 'datasets',
        include: [
            'View',
            'Table',
            'TablePartition',
            'MaterialisedView',
            'TableauDatasource',
            'PowerBIDataset',
        ],
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
            'TableauDatasource',
            'PowerBIDataset',
        ],
        popoverText: 'All assets from BI integrations',
        description: 'Visualizations',
    },
    {
        id: 'businessTerms',
        include: ['AtlasGlossaryTerm', 'AtlasGlossaryCategory'],
        label: 'Business Terms',
        description: 'Business Terms',
        popoverText: 'Business Terms & Categories',
    },
]
