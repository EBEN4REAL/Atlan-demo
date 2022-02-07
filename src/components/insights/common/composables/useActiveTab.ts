import { Ref } from 'vue'
import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
import { generateUUID } from '~/utils/helper/generator'

export function useActiveTab() {
    function generateNewActiveTab({
        activeInlineTab,
        label,
        editorText,
        isVQB,
        vqb,
        context,
        schemaConnectors,
        queryConnectors,
    }: {
        activeInlineTab: Ref<activeInlineTabInterface>
        label: string
        editorText: string
        vqb?: any
        isVQB?: boolean
        context?: object
        schemaConnectors?: object
        queryConnectors?: object
    }): activeInlineTabInterface {
        let vqbData = {
            panels: [
                {
                    order: 1,
                    id: 'columns',
                    hide: true,
                    subpanels: [
                        {
                            id: '1',
                            tableQualifiedName: undefined,
                            columns: ['all'],
                            tableData: {
                                certificateStatus: undefined,
                                assetType: undefined,
                                item: {},
                            },
                            columnsData: [],
                        },
                    ],
                    expand: true,
                },
            ],
        }
        if (vqb) {
            vqbData = vqb
        }

        let contextData = activeInlineTab.value.playground.editor.context
        if (context) {
            contextData = context as any
        }
        let schemaConnectorsData =
            activeInlineTab.value.explorer.schema.connectors
        if (context) {
            schemaConnectorsData = schemaConnectors as any
        }

        let queryConnectorsData =
            activeInlineTab.value.explorer.queries.connectors
        if (context) {
            queryConnectorsData = queryConnectors as any
        }

        const key = generateUUID()
        const activeInlineTabCopy: activeInlineTabInterface = JSON.parse(
            JSON.stringify(activeInlineTab.value)
        )

        // `Copy ${activeInlineTabCopy.label} preview`
        const inlineTabData: activeInlineTabInterface = {
            label: label,
            key,
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
            explorer: {
                schema: {
                    connectors: schemaConnectorsData,
                },
                queries: {
                    connectors: queryConnectorsData,
                    collection: {
                        // copy from last tab
                        guid: activeInlineTabCopy.explorer?.queries?.collection
                            ?.guid,
                        qualifiedName:
                            activeInlineTabCopy.explorer?.queries?.collection
                                ?.qualifiedName,
                        parentQualifiedName:
                            activeInlineTabCopy.explorer?.queries?.collection
                                ?.guid,
                    },
                },
            },
            playground: {
                isVQB: isVQB ? true : false,
                vqb: vqbData,
                editor: {
                    context: contextData,
                    text: editorText ?? '',
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
                    activeTab:
                        activeInlineTabCopy.playground?.resultsPane
                            ?.activeTab ?? 0,
                    result: {
                        title: `${key} Result`,
                        runQueryId: undefined,
                        isQueryRunning: '',
                        queryErrorObj: {},
                        totalRowsCount: -1,
                        executionTime: -1,
                        errorDecorations: [],
                        abortQueryFn: undefined,
                        eventSourceInstance: undefined,
                        buttonDisable: false,
                        isQueryAborted: false,
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
            assetSidebar: {
                // for taking the previous state from active tab
                openingPos: undefined,
                isVisible: false,
                assetInfo: {},
                title: activeInlineTabCopy.assetSidebar.title ?? '',
                id: activeInlineTabCopy.assetSidebar.id ?? '',
            },
        }
        return inlineTabData
    }
    return {
        generateNewActiveTab,
    }
}
