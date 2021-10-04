import { List as assetCategoryList } from '~/constant/assetCategory'

export const allTypeNames = [
    'View',
    'Table',
    'TablePartition',
    'MaterialisedView',
    'Column',
    'TableauSite',
    'TableauProject',
    'TableauWorkbook',
    'TableauWorksheet',
    'TableauDashboard',
    'TableauDatasource',
    'TableauDatasourceField',
]

const integrationTypeMapping = {
    snowflake: [
        'View',
        'Table',
        'TablePartition',
        'MaterialisedView',
        'Column',
    ],
    tableau: [
        'TableauSite',
        'TableauProject',
        'TableauWorkbook',
        'TableauWorksheet',
        'TableauDashboard',
        'TableauDatasource',
        'TableauDatasourceField',
    ],
    athena: [],
    postgres: ['View', 'Table', 'TablePartition', 'MaterialisedView', 'Column'],
}

const categoryTypeMapping = {
    datasets: ['View', 'Table', 'TablePartition', 'MaterialisedView'],
    fields: ['Column'],
    visualizations: [
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
        'PowerBIDatasource',
    ],
}

export function tabsByConnector(
    { attributeName, attributeValue }: Record<string, string> = {},
    initialTabs: string[] = []
) {
    const connector = () => {
        if (attributeName === 'integrationName') return attributeValue
        else {
            let qfChunks = attributeValue?.split('/')
            return qfChunks?.length > 1 ? qfChunks[1] : ''
        }
    }
    let connectorType = connector()

    const tabs = initialTabs
    const fTab = connectorType ? integrationTypeMapping[connectorType] : []

    return fTab.length ? tabs.filter((tab) => fTab.includes(tab)) : tabs
}

export function tabsByCategory(
    selectedIds: string[],
    initialTabs: string[] = []
) {
    const tabs = initialTabs

    const fTab = selectedIds?.reduce((acc, id) => {
        return [...acc, ...categoryTypeMapping[id]]
    }, [] as string[])

    return fTab?.length ? tabs.filter((tab) => fTab.includes(tab)) : tabs
}

const filterFnMap = {
    connector: tabsByConnector,
    category: tabsByCategory,
}

export function useFilteredTabs(config: Record<keyof typeof filterFnMap, any>) {
    let tabs = [...allTypeNames]

    for (const [key, value] of Object.entries(config)) {
        tabs = filterFnMap[key](value, tabs)
    }
    return tabs
}