// import { CheckboxArray } from '~/types'

export const List: any = [
    {
        id: 'datasets',
        include: ['View', 'Table', 'TablePartition', 'MaterialisedView'],
        label: 'Datasets',
        description: 'Datasets',
    },
    {
        id: 'fields',
        label: 'Fields',
        include: ['Column'],
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
        ],
        description: 'Visualizations',
    },
]
