import { List as assetCategoryList } from '~/constant/assetCategory'

export const getTabsForConnector = ({
    attributeName,
    attributeValue,
}: Record<string, string>) => {
    const connector = () => {
        if (attributeName === 'integrationName') return attributeValue
        else {
            let qfChunks = attributeValue?.split('/')
            return qfChunks?.length > 1 ? qfChunks[1] : ''
        }
    }
    let connectorType = connector()

    if (connectorType) {
        if (connectorType === 'tableau')
            return [
                'TableauSite',
                'TableauProject',
                'TableauWorkbook',
                'TableauWorksheet',
                'TableauDashboard',
                'TableauDatasource',
                'TableauDatasourceField',
            ]
        else
            return [
                'Connection',
                'Database',
                'Schema',
                'View',
                'Table',
                'TablePartition',
                'MaterialisedView',
                'Column',
            ]
    } else {
        return [
            'Connection',
            'Database',
            'Schema',
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
    }
}

export function initialTabsForAssetCategory(selectedIds: string[]) {
    console.log(selectedIds, 'selectedIds')
    let tabs = []
    selectedIds?.forEach((selectedId) => {
        const assetCategory = assetCategoryList.find(
            (assetCategory) => assetCategory.id === selectedId
        )
        tabs = [...tabs, ...assetCategory.include]
    })
    return tabs
}
