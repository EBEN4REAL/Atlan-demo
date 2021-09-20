export interface activeInlineTabInterface {
    key: string
    label: String
    isSaved: boolean
    queryId: string | undefined
    explorer: Object
    favico: string | undefined
    playground: {
        editor: {
            text: string
            dataList: Array<any>
            columnList: Array<{
                title: string
                dataIndex: string
                width: string
                key: any
            }>
        }
        resultsPane: {
            activeTab: number
            result: {
                title: string
            }
            metadata: Object
            queries: Object
            joins: Object
            filters: Object
            impersonation: Object
            downstream: Object
            sqlHelp: Object
        }
    }
    assetSidebar: {
        isVisible: boolean
        assetInfo: Object
        title: string
        id: string
    }
}
