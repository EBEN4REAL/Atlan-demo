export interface activeInlineTabInterface {
    key: string
    label: String
    isSaved: boolean
    queryId: string | undefined
    explorer: Object
    favico: string | undefined
    playground: {
        editorTitle: string
        resultTitle: string
    }
    assetSidebar: {
        isVisible: boolean
        assetInfo: Object
        title: string
        id: string
    }
}
