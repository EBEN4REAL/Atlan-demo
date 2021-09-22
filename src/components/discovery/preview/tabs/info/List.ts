import { Ref } from 'vue'
import { assetInterface } from '~/types/assets/asset.interface'

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
        label: 'Hierarchy',
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
    tableauHierarchy: {
        id: 'tableauHierarchy',
        label: 'Hierarchy',
        component: 'tableauHierarchy',
    },
    usage: {
        id: 'usage',
        label: 'Usage',
        component: 'usage',
    },
    columnProfile: {
        id: 'columnProfile',
        label: 'Column Profile',
        component: 'columnProfile',
    },
}
const {
    assetDetails,
    linkedAsset,
    heirarchy,
    properties,
    tableauProperties,
    tableauPreview,
    tableauHierarchy,
    columnProfile,
    usage,
} = CollapsiblePanels

export const InfoTabInAssetInDiscovery: { [key: string]: AssetTab } = {
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
    PowerBIWorkspace:{
        panels: [assetDetails, linkedAsset, properties]
    },
    PowerBIDashboard:{
        panels: [assetDetails, linkedAsset, properties]
    },
    PowerBIReport:{
        panels: [assetDetails, linkedAsset, properties]
    },
    PowerBIDataset:{
        panels: [assetDetails, linkedAsset, properties]
    },
    PowerBIDataflow:{
        panels: [assetDetails, linkedAsset, properties]
    },
    PowerBITile:{
        panels: [assetDetails, linkedAsset, properties]
    },
    PowerBIPage:{
        panels: [assetDetails, linkedAsset, properties]
    },
    PowerBIDatasource:{
        panels: [assetDetails, linkedAsset, properties]
    },
}

export const InfoTabInAssetProfile: { [key: string]: AssetTab } = {
    Connection: {
        panels: [assetDetails, linkedAsset, properties],
    },
    Database: {
        panels: [assetDetails, linkedAsset, properties],
    },
    Schema: {
        panels: [assetDetails, linkedAsset, properties],
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

export const InfoTabInNonBiOverview: { [key: string]: AssetTab } = {
    Column: {
        panels: [assetDetails, linkedAsset, usage, columnProfile, properties],
    },
}

export const InfoTabInBiOverview: { [key: string]: AssetTab } = {
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
    page: Ref<string>,
    selectedAsset: Ref<assetInterface>
) {
    switch (page.value) {
        case 'discovery': {
            return InfoTabInAssetInDiscovery[selectedAsset.value.typeName]
        }
        case 'profile': {
            return InfoTabInAssetProfile[selectedAsset.value.typeName]
        }
        case 'biOverview': {
            return InfoTabInBiOverview[selectedAsset.value.typeName]
        }
        case 'nonBiOverview': {
            return InfoTabInNonBiOverview[selectedAsset.value.typeName]
        }
    }
}
