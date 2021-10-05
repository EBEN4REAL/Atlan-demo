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
        panels: [assetDetails,  heirarchy, properties],
    },
    Database: {
        panels: [assetDetails,  heirarchy, properties],
    },
    Schema: {
        panels: [assetDetails,  heirarchy, properties],
    },
    View: {
        panels: [assetDetails,  heirarchy, properties],
    },
    Table: {
        panels: [assetDetails,  heirarchy, properties],
    },
    TablePartition: {
        panels: [assetDetails,  heirarchy, properties],
    },
    MaterialisedView: {
        panels: [assetDetails,  heirarchy, properties],
    },
    Column: {
        panels: [assetDetails,  heirarchy, properties],
    },
}

export const InfoTabInAssetProfile: { [key: string]: AssetTab } = {
    Connection: {
        panels: [assetDetails,  properties],
    },
    Database: {
        panels: [assetDetails,  properties],
    },
    Schema: {
        panels: [assetDetails,  properties],
    },
    View: {
        panels: [assetDetails,  heirarchy, properties],
    },
    Table: {
        panels: [assetDetails,  heirarchy, properties],
    },
    TablePartition: {
        panels: [assetDetails,  heirarchy, properties],
    },
    MaterialisedView: {
        panels: [assetDetails,  heirarchy, properties],
    },
    Column: {
        panels: [assetDetails,  heirarchy, properties],
    }
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
    }
}
