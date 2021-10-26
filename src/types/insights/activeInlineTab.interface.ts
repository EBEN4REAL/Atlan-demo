import { CustomVaribaleInterface } from './customVariable.interface'
import { connectorsWidgetInterface } from '~/types/insights/connectorWidget.interface'
import { assetInterface } from '~/types/assets/asset.interface'
import { Attributes } from '~/types/insights/savedQuery.interface'

export interface activeInlineTabInterface {
    attributes: Attributes
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
                runQueryId: undefined | string
                isQueryRunning: string
                totalRowsCount: number
                executionTime: number
                queryErrorObj: any
                errorDecorations: any
                eventSourceInstance: any
                buttonDisable: boolean
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
        openingPos: string | undefined
        assetInfo: assetInterface
        title: string
        id: string
    }
}
