export interface activeInlineTabInterface {
    tabId: string
    tabTitle: String
    isActive: boolean
    explorer: Object
    playground: Object
    assetSidebar: {
        isVisible: boolean
        assetInfo: Object
    }
}
