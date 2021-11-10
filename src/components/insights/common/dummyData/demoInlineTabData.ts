import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
export const inlineTabsDemoData: activeInlineTabInterface[] = [
    {
        key: '1',
        label: 'New tab',
        isSaved: false,
        queryId: undefined,
        status: 'DRAFT',
        connectionId: '',
        description: '',
        qualifiedName: '',
        parentGuid: '',
        parentQualifiedName: '',
        isSQLSnippet: false,
        explorer: {
            schema: {
                connectors: {
                    attributeName: undefined,
                    attributeValue: undefined,
                },
            },
            queries: {
                connectors: {
                    connector: undefined,
                },
            },
        },
        playground: {
            editor: {
                context: {
                    attributeName: undefined,
                    attributeValue: undefined,
                },
                text: '',
                context: {
                    attributeName: undefined,
                    attributeValue: undefined
                },
                dataList: [],
                columnList: [],
                variables: [],
                savedVariables: [],
                limitRows: {
                    checked: false,
                    rowsCount: -1,
                },
            },
            resultsPane: {
                activeTab: 0,
                result: {
                    title: `Result`,
                    runQueryId: undefined,
                    isQueryRunning: '',
                    queryErrorObj: {},
                    totalRowsCount: -1,
                    executionTime: -1,
                    errorDecorations: [],
                    eventSourceInstance: undefined,
                    buttonDisable: false,
                },
                metadata: {},
                queries: {},
                joins: {},
                filters: {},
                impersonation: {},
                downstream: {},
                sqlHelp: {},
            },
        },
        favico: 'https://atlan.com/favicon.ico',
        assetSidebar: {
            isVisible: false,
            assetInfo: {},
            title: '',
            id: '',
        },
    },
]
