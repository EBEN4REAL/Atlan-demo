import { CustomVaribaleInterface } from './customVariable.interface'
import { connectorsWidgetInterface } from '~/types/insights/connectorWidget.interface'
import { assetInterface } from '~/types/assets/asset.interface'
import { Attributes } from '~/types/insights/savedQuery.interface'
import { VQBInterface } from './VQB.interface'

export interface activeInlineTabInterface {
    attributes: Attributes | null
    key: string
    label: String
    isSaved: boolean
    updateTime: number
    updatedBy: string
    queryId: string | undefined | null
    status: string // draft | verified etc.
    connectionId: string
    description: string
    qualifiedName: string
    parentGuid: string
    parentQualifiedName: string
    isSQLSnippet: boolean
    savedQueryParentFolderTitle: string | undefined
    collectionQualifiedName: string
    explorer: {
        schema: {
            connectors: connectorsWidgetInterface
            facetsFilters: Record<string, Array<any>>
            sortOrderTable: string
            sortOrderColumn: string
        }
        queries: {
            connectors: {
                connector: string | undefined
            }
            collection: {
                guid: string | undefined
                qualifiedName: string | undefined
                parentQualifiedName: string | undefined
            }
        }
    }
    favico: string | undefined
    playground: {
        isVQB: Boolean
        editor: {
            context: connectorsWidgetInterface
            text: string
            dataList: Array<any>
            columnList: Array<{
                title: string
                dataIndex: string
                width: string
                key: any
            }>
            variables: CustomVaribaleInterface[]
            savedVariables: CustomVaribaleInterface[]
            limitRows: {
                checked: boolean
                rowsCount: number
            }
        }
        vqb: VQBInterface
        resultsPane: {
            activeTab: number
            outputPaneSize: number
            result: {
                title: string
                runQueryId: undefined | string | null
                isQueryRunning: string
                totalRowsCount: number
                abortQueryFn: Function | undefined
                executionTime: number
                queryErrorObj: any
                errorDecorations: any
                abortQueryFn: Function
                eventSourceInstance: any
                buttonDisable: boolean
                isQueryAborted: boolean
                tabQueryState: boolean
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
