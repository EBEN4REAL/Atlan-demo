import { CustomVaribaleInterface } from './customVariable.interface'
import { connectorsWidgetInterface } from '~/types/insights/connectorWidget.interface'

export interface activeInlineTabInterface {
    key: string
    label: String
    isSaved: boolean
    queryId: string | undefined
    status: string // draft | verified etc.
    explorer: {
        schema: {
            connectors: connectorsWidgetInterface
        }
        queries: {
            connectors: {
                connector: string | undefined
            }
        }
    }
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
            variables: CustomVaribaleInterface[]
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
