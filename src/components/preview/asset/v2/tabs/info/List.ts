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
type penlsMapToAsset = {
    panels: collapsiblePanels[]
    properties?: tableauProperty[]
}

const CollapsiblePanels: { [key: string]: collapsiblePanels } = {
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
    heirarchy: {
        id: 'heirarchy',
        label: 'Heirarchy',
        component: 'heirarchy',
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
}
const {
    assetDetails,
    linkedAsset,
    heirarchy,
    properties,
    tableauProperties,
    tableauPreview,
} = CollapsiblePanels
export const PanelsMapToAsset: { [key: string]: penlsMapToAsset } = {
    Connection: {
        panels: [assetDetails, linkedAsset, heirarchy, properties],
    },
    Database: {
        panels: [assetDetails, linkedAsset, heirarchy, properties],
    },
    Schema: {
        panels: [assetDetails, linkedAsset, heirarchy, properties],
    },
    View: {
        panels: [assetDetails, linkedAsset, heirarchy, properties],
    },
    Table: {
        panels: [assetDetails, linkedAsset, heirarchy, properties],
    },
    TablePartition: {
        panels: [assetDetails, linkedAsset, heirarchy, properties],
    },
    MaterialisedView: {
        panels: [assetDetails, linkedAsset, heirarchy, properties],
    },
    Column: {
        panels: [assetDetails, linkedAsset, heirarchy, properties],
    },
    TableauWorkbook: {
        panels: [
            tableauPreview,
            tableauProperties,
            assetDetails,
            linkedAsset,
            heirarchy,
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
            heirarchy,
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
            heirarchy,
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
            heirarchy,
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
            heirarchy,
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
            heirarchy,
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

// preview
//
