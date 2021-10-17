import { CustomVaribaleInterface } from './customVariable.interface'
import { connectorsWidgetInterface } from '~/types/insights/connectorWidget.interface'
import { assetInterface } from '~/types/assets/asset.interface'

export interface activeInlineTabInterface {
    key: string
    label: String
    isSaved: boolean
    updateTime: number
    updatedBy: string
    queryId: string | undefined
    status: string // draft | verified etc.
    connectionId: string
    description: string
    qualifiedName: string
    isSQLSnippet: boolean
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
            limitRows: {
                checked: boolean
                rowsCount: number
            }
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
        assetInfo: assetInterface
        title: string
        id: string
    }
}
