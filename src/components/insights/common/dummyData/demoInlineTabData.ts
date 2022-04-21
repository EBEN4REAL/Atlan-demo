import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
export const inlineTabsDemoData: activeInlineTabInterface[] = [
    {
        key: '1',
        attributes: {},
        label: 'Untitled',
        isSaved: false,
        queryId: undefined,
        status: 'is_null',
        connectionId: '',
        description: '',
        qualifiedName: '',
        parentGuid: '',
        parentQualifiedName: '',
        isSQLSnippet: false,
        savedQueryParentFolderTitle: undefined,
        classifications: [],
        explorer: {
            schema: {
                connectors: {
                    attributeName: undefined,
                    attributeValue: undefined,
                },
                facetsFilters: {},
                sortOrderTable: 'name.keyword-asc',
                sortOrderColumn: 'order-asc',
                activeKey: [],
            },
            queries: {
                connectors: {
                    connector: {
                        attributeName: 'connectionQualifiedName',
                        attributeValue: '',
                    },
                },
                collection: {
                    guid: '',
                    qualifiedName: undefined,
                    parentQualifiedName: undefined,
                },
            },
        },
        playground: {
            isVQB: false,
            vqb: {
                selectedTables: [],
                panels: [
                    {
                        order: 1,
                        id: 'columns',
                        hide: true,
                        subpanels: [
                            {
                                id: '1',
                                tableQualifiedName: undefined,
                                tableData: {
                                    certificateStatus: undefined,
                                    assetType: undefined,
                                    item: {},
                                },
                                columns: ['all'],
                                columnsData: [],
                            },
                        ],
                        expand: true,
                    },
                ],
            },
            editor: {
                text: '',
                context: {
                    attributeName: undefined,
                    attributeValue: undefined,
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
                outputPaneSize: 27.9,
                result: {
                    title: `Result`,
                    runQueryId: undefined,
                    isQueryRunning: '',
                    abortQueryFn: undefined,
                    queryErrorObj: {},
                    totalRowsCount: -1,
                    executionTime: -1,
                    errorDecorations: [],
                    eventSourceInstance: undefined,
                    buttonDisable: false,
                    isQueryAborted: false,
                    tabQueryState: false,
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
