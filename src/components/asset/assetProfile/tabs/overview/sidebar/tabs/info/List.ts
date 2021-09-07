type collapsiblePanels = {
    id: string
    label: string
    component: string
}
type tableauProperty = {
    id: string
    label: string
    property: string
}
type AssetTab = {
    panels: collapsiblePanels[]
    properties?: tableauProperty[]
}

const CollapsiblePanels: { [key: string]: collapsiblePanels } = {
    columnDetails: {
        id: 'columnDetails',
        label: 'Details',
        component: 'columnDetails',
    },
    assetDetails: {
        id: 'assetDetails',
        label: 'Details',
        component: 'assetDetails',
    },
    linkedAsset: {
        id: 'linkedAsset',
        label: 'Governance',
        component: 'linkedAsset',
    },
    usage: {
        id: 'usage',
        label: 'Usage',
        component: 'usage',
    },
    properties: {
        id: 'properties',
        label: 'Properties',
        component: 'properties',
    },
    tableauProperties: {
        id: 'tableauProperties',
        label: 'Tableau Properties',
        component: 'tableauProperties',
    },
    tableauPreview: {
        id: 'tableauPreview',
        label: 'Preview',
        component: 'tableauPreview',
    },
    tableauHierarchy: {
        id: 'tableauHierarchy',
        label: 'Hierarchy',
        component: 'tableauHierarchy',
    },
    columnProfile: {
        id: 'columnProfile',
        label: 'Column Profile',
        component: 'columnProfile',
    },
}
const {
    columnDetails,
    linkedAsset,
    assetDetails,
    properties,
    tableauProperties,
    tableauPreview,
    tableauHierarchy,
    columnProfile,
    usage,
} = CollapsiblePanels

export const InfoTabPanels: { [key: string]: AssetTab } = {
    Column: {
        panels: [columnDetails, linkedAsset, usage, columnProfile],
    },
    TableauWorkbook: {
        panels: [
            tableauProperties,
            assetDetails,
            linkedAsset,
            tableauHierarchy,
            properties,
        ],
        properties: [
            {
                id: 'projectName',
                label: 'Project',
                property: 'projectName',
            },
            {
                id: '__timestamp',
                label: 'Created on',
                property: '__timestamp',
            },
            {
                id: '__modificationTimestamp',
                label: 'Modified on',
                property: '__modificationTimestamp',
            },
        ],
    },
    TableauSite: {
        panels: [
            tableauProperties,
            assetDetails,
            linkedAsset,
            tableauHierarchy,
            properties,
        ],
        properties: [
            {
                id: 'connectionName',
                label: 'Server',
                property: 'connectionName',
            },
            {
                id: '__timestamp',
                label: 'Created on',
                property: '__timestamp',
            },
        ],
    },
    TableauProject: {
        panels: [
            tableauProperties,
            assetDetails,
            linkedAsset,
            tableauHierarchy,
            properties,
        ],
        properties: [
            {
                id: 'siteName',
                label: 'Site',
                property: 'siteName',
            },
            {
                id: '__timestamp',
                label: 'Created on',
                property: '__timestamp',
            },
        ],
    },
    TableauDashboard: {
        panels: [
            tableauPreview,
            tableauProperties,
            assetDetails,
            linkedAsset,
            tableauHierarchy,
            properties,
        ],
        properties: [
            {
                id: 'workbookName',
                label: 'Workbook',
                property: 'workbookName',
            },
            {
                id: '__timestamp',
                label: 'Created on',
                property: '__timestamp',
            },
            {
                id: '__modificationTimestamp',
                label: 'Modified on',
                property: '__modificationTimestamp',
            },
        ],
    },
    TableauWorksheet: {
        panels: [
            tableauPreview,
            tableauProperties,
            assetDetails,
            linkedAsset,
            tableauHierarchy,
            properties,
        ],
        properties: [
            {
                id: 'workbookName',
                label: 'Workbook',
                property: 'workbookName',
            },
            {
                id: '__timestamp',
                label: 'Created on',
                property: '__timestamp',
            },
            {
                id: '__modificationTimestamp',
                label: 'Modified on',
                property: '__modificationTimestamp',
            },
        ],
    },
    // in attributes if isPublished -true ( means it is a published datasoruce )/ isPublished - false ( means it is a embedded datasource)
    TableauDatasource: {
        panels: [
            tableauProperties,
            assetDetails,
            linkedAsset,
            tableauHierarchy,
            properties,
        ],
        properties: [
            {
                id: 'projectName',
                label: 'Project',
                property: 'projectName',
            },
            {
                id: '__timestamp',
                label: 'Created on',
                property: '__timestamp',
            },
            {
                id: '__modificationTimestamp',
                label: 'Modified on',
                property: '__modificationTimestamp',
            },
        ],
    },
}

export function useInfoPanels(
    selectedAssetType: string
) {
    return InfoTabPanels[selectedAssetType]
}