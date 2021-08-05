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
        label: 'Linked Asset',
        component: 'linkedAsset',
    },
    {
        id: 'metaData',
        label: 'Meta Data',
        component: 'metaData',
    },
    {
        id: 'heirarchy',
        label: 'Heirarchy',
        component: 'heirarchy',
    },
]
