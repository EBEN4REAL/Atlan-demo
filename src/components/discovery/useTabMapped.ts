import { List as assetCategoryList } from '~/constant/assetCategory'

export const allTypeNames = [
    'View',
    'Table',
    'TablePartition',
    'MaterialisedView',
    'Column',
    'Query',
    'QueryFolder',
    'TableauSite',
    'TableauProject',
    'TableauWorkbook',
    'TableauWorksheet',
    'TableauDashboard',
    'TableauDatasource',
    'TableauDatasourceField',
    'TableauCalculatedField',
    'AtlasGlossaryTerm',
    'AtlasGlossaryCategory',
]

const integrationTypeMapping = {
    snowflake: [
        'View',
        'Table',
        'TablePartition',
        'MaterialisedView',
        'Column',
        'Query',
        'QueryFolder',
    ],
    tableau: [
        'TableauSite',
        'TableauProject',
        'TableauWorkbook',
        'TableauWorksheet',
        'TableauDashboard',
        'TableauDatasource',
        'TableauDatasourceField',
        'TableauCalculatedField',
    ],
    athena: [],
    postgres: ['View', 'Table', 'TablePartition', 'MaterialisedView', 'Column', 'Query', 'QueryFolder'],
}

const categoryTypeMapping = {
    datasets: ['View', 'Table', 'TablePartition', 'MaterialisedView', 'TableauDatasource', 'PowerBIDataset'],
    fields: ['Column', 'TableauDatasourceField', 'TableauCalculatedField'],
    visualizations: [
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
    businessTerms: ['AtlasGlossaryTerm', 'AtlasGlossaryCategory'],
    queries: ['Query', 'QueryFolder']
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
