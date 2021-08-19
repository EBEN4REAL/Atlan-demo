type collapsiblePanels = {
    id: string
    label: string
    component: string
}
type penlsMapToAsset = {
    panels: collapsiblePanels[]
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
    // TableauSite: {
    //     panels: [
    //         tableauProperties,
    //         assetDetails,
    //         linkedAsset,
    //         heirarchy,
    //         properties,
    //     ],
    // },
    TableauWorkbook: {
        panels: [
            tableauPreview,
            tableauProperties,
            assetDetails,
            linkedAsset,
            heirarchy,
            properties,
        ],
    },
    // TableauProject: {
    //     panels: [
    //         tableauProperties,
    //         assetDetails,
    //         linkedAsset,
    //         heirarchy,
    //         properties,
    //     ],
    // },
    // TableauDashboard: {
    //     panels: [
    //         tableauPreview,
    //         tableauProperties,
    //         assetDetails,
    //         linkedAsset,
    //         heirarchy,
    //         properties,
    //     ],
    // },
    // TableauWorksheet: {
    //     panels: [
    //         tableauPreview,
    //         tableauProperties,
    //         assetDetails,
    //         linkedAsset,
    //         heirarchy,
    //         properties,
    //     ],
    // },
    // in attributes if isPublished -true ( means it is a published datasoruce )/ isPublished - false ( means it is a embedded datasource)
    // TableauDatasource: {
    //     panels: [
    //         tableauProperties,
    //         assetDetails,
    //         linkedAsset,
    //         heirarchy,
    //         properties,
    //     ],
    // },
}

// preview
//
