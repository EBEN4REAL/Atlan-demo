import { ref } from 'vue'
import { List as assetCategoryList } from '~/constant/assetCategory'

export function initialTabsForConnector(criterion: any) {
    let tabIds = []
    console.log('connector', criterion?.length, criterion[0]?.attributeValue)
    if (criterion?.length > 0) {
        const connectorType = criterion[0]?.attributeValue
        if (connectorType) {
            if (connectorType === 'tableau') {
                tabIds = [
                    'TableauSite',
                    'TableauProject',
                    'TableauWorkbook',
                    'TableauWorksheet',
                    'TableauDashboard',
                    'TableauDatasource',
                    'TableauDatasourceField',
                ]
            } else {
                tabIds = [
                    'Connection',
                    'Database',
                    'Schema',
                    'View',
                    'Table',
                    'TablePartition',
                    'MaterialisedView',
                    'Column',
                ]
            }
        } else {
            tabIds = [
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
    return tabIds
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
