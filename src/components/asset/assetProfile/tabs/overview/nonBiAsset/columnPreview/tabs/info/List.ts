type collapsiblePanels = {
    id: string
    label: string
    component: string
}


export default const CollapsiblePanels: { [key: string]: collapsiblePanels } = {
    columnDetails: {
        id: 'columnDetails',
        label: 'Details',
        component: 'columnDetails',
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
    bm1: {
        id: 'businessMetadata1',
        label: 'Business Metadata 1',
        component: 'businessMetadata1',
    },
    bm2: {
        id: 'businessMetadata2',
        label: 'Business Metadata 2',
        component: 'businessMetadata2',
    },
    columnProfile: {
        id: 'columnProfile',
        label: 'Column Profile',
        component: 'columnProfile',
    },
}

