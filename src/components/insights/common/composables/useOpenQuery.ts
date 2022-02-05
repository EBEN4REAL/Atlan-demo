import { ref, toRaw, Ref } from 'vue'

import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
import useAssetInfo from '~/composables/discovery/useAssetInfo'
import { useConnector } from '~/components/insights/common/composables/useConnector'
import { getDialectInfo } from '~/components/insights/common/composables/getDialectInfo'
import { useInlineTab } from '~/components/insights/common/composables/useInlineTab'
import { generateUUID } from '~/utils/helper/generator'
import useRunQuery from '~/components/insights/playground/common/composables/useRunQuery'
import { useEditor } from '~/components/insights/common/composables/useEditor'

export default function useOpenQuery({
    tabs,
    activeInlineTabKey,
    activeInlineTab,
    item,
    editorInstance,
    monacoInstance,
    limitRows,
}) {
    const { title } = useAssetInfo()

    const { modifyActiveInlineTab, inlineTabAdd, modifyActiveInlineTabEditor } =
        useInlineTab()

    const { getConnectorName } = useConnector()

    const assetQuoteType = getDialectInfo(
        getConnectorName(
            activeInlineTab.value.playground.editor.context.attributeValue
        ) ?? ''
    )

    const { queryRun } = useRunQuery()
    const { focusEditor, setSelection } = useEditor()

    let query = item?.value?._source?.message?.userSqlQuery
    let metadata = item?.value?._source?.message?.queryMetadata
        ? item?.value?._source?.message?.queryMetadata[0]
        : {}

    // let { table, schema, catalog } = metadata
    let table = metadata?.table
    let schema = metadata?.schema
    let catalog = metadata?.catalog
    let connectionQualifiedName =
        item?.value?._source?.message?.connectionQualifiedName

    let limit = item?.value?._source?.message?.numberOfRows

    const handleAddNewTab = async (
        query,
        context,
        explorerContext,
        previewItem
    ) => {
        const key = generateUUID()
        const inlineTabData: activeInlineTabInterface = {
            label: `${previewItem.title} preview`,
            key,
            favico: 'https://atlan.com/favicon.ico',
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
                    connectors: {
                        ...explorerContext,
                    },
                },
                queries: {
                    connectors: {
                        connector: previewItem.connectionQualifiedName,
                    },
                    collection: {
                        // copy from last tab
                        guid: activeInlineTab.value?.explorer?.queries
                            ?.collection?.guid,
                        qualifiedName:
                            activeInlineTab.value?.explorer?.queries?.collection
                                ?.qualifiedName,
                        parentQualifiedName:
                            activeInlineTab.value?.explorer?.queries?.collection
                                ?.guid,
                    },
                },
            },
            playground: {
                vqb: {
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
                },
                editor: {
                    context: {
                        ...context,
                    },
                    text: query,
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
                        activeInlineTab.value?.playground?.resultsPane
                            ?.activeTab ?? 0,
                    result: {
                        title: `${key} Result`,
                        runQueryId: undefined,
                        isQueryRunning: '',
                        queryErrorObj: {},
                        totalRowsCount: -1,
                        executionTime: -1,
                        errorDecorations: [],
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
                title: activeInlineTab.value?.assetSidebar.title ?? '',
                id: activeInlineTab.value?.assetSidebar.id ?? '',
            },
        }
        inlineTabAdd(inlineTabData, tabs, activeInlineTabKey)
    }

    const selectionObject: Ref<any> = ref({
        startLineNumber: 1,
        startColumnNumber: 1,
        endLineNumber: 1,
        endColumnNumber: 1,
    })

    const getData = (activeInlineTab, dataList, columnList) => {
        if (activeInlineTab && tabs?.value) {
            const activeInlineTabCopy: activeInlineTabInterface = JSON.parse(
                JSON.stringify(toRaw(activeInlineTab.value))
            )
            activeInlineTabCopy.playground.editor.dataList = dataList

            activeInlineTabCopy.playground.editor.columnList = columnList
            const saveQueryDataInLocalStorage = false
            modifyActiveInlineTabEditor(
                activeInlineTabCopy,
                tabs,
                saveQueryDataInLocalStorage
            )
            setSelection(
                toRaw(editorInstance.value),
                toRaw(monacoInstance.value),
                selectionObject.value
            )
            focusEditor(toRaw(editorInstance.value))
        }
    }

    const previewQuery = (runQuery = false) => {
        console.log('preview query: ', {
            item,
            connectionQualifiedName,
            schema,
            catalog,
        })
        // const activeInlineTabCopy: activeInlineTabInterface = Object.assign(
        //     {},
        //     activeInlineTab.value
        // )

        // console.log('activeInlineTab: ', Object.keys(activeInlineTabCopy))

        let newQuery = query

        let queryConnectionQualifiedName = connectionQualifiedName
        let queryDatabaseQualifiedName = connectionQualifiedName + '/' + catalog
        let querySchemaQualifiedName = queryDatabaseQualifiedName + '/' + schema

        handleAddNewTab(
            newQuery,
            {
                attributeName: 'schemaQualifiedName',
                attributeValue: querySchemaQualifiedName,
            },
            {
                attributeName: 'schemaQualifiedName',
                attributeValue: querySchemaQualifiedName,
            },
            {
                title: 'title',
                connectionQualifiedName: connectionQualifiedName,
            }
        )

        if (runQuery) {
            let activeInlineTabCopy: activeInlineTabInterface = Object.assign(
                {},
                activeInlineTab.value
            )
            playQuery(newQuery, newQuery, activeInlineTabCopy)
        }
    }

    const playQuery = (newQuery, newText, activeInlineTabCopy) => {
        activeInlineTabCopy.playground.editor.text = newText
        modifyActiveInlineTab(
            activeInlineTabCopy,
            tabs,
            activeInlineTabCopy.isSaved
        )

        queryRun(
            activeInlineTab,
            getData,
            limit,
            null,
            null,
            newText,
            editorInstance,
            monacoInstance
        )
    }

    return {
        previewQuery,
    }
}
