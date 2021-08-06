type previewFactesType = {
    id: string
    label: string
    component: string
}
export const List: previewFactesType[] = [
    {
        id: 'assetDetails',
        label: 'Details',
        component: 'assetDetails',
    },
    {
        id: 'linkedAsset',
        label: 'Governance',
        component: 'linkedAsset',
    },
    {
        id: 'heirarchy',
        label: 'Heirarchy',
        component: 'heirarchy',
    },
    {
        id: 'properties',
        label: 'Properties',
        component: 'properties',
    },
]
