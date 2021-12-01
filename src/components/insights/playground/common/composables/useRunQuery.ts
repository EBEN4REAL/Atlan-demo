import { ref, toRaw, Ref, watch, callWithAsyncErrorHandling } from 'vue'
import { useSSE } from '~/modules/useSSE'
import { map } from '~/services/sql/query/key'
import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
import { useEditor } from '~/components/insights/common/composables/useEditor'
import { useConnector } from '~/components/insights/common/composables/useConnector'
import { useInlineTab } from '~/components/insights/common/composables/useInlineTab'
import { generateQueryStringParamsFromObj } from '~/utils/queryString'
// import HEKA_SERVICE_API from '~/services/heka/index'
import { Insights } from '~/services/sql/query'
import { LINE_ERROR_NAMES } from '~/components/insights/common/constants'

export default function useProject() {
    const { getParsedQuery, resetErrorDecorations, setErrorDecorations, getParsedQueryCursor } =
        useEditor()
    const { getSchemaWithDataSourceName, getConnectionQualifiedName } =
        useConnector()
    const { modifyActiveInlineTab } = useInlineTab()
    const columnList: Ref<
        [
            {
                title: string
                dataIndex: string
                width: string
                key: any
            }
        ]
    > = ref([])
    const dataList = ref([])
    const isQueryRunning = ref('')
    const queryExecutionTime = ref(-1)
    const queryErrorObj = ref()

    const setColumns = (columnList: Ref<any>, columns: any) => {
        // console.log('columns: ', columns)
        if (columns.length > 0) {
            columnList.value = []
            columns.map((col: any) => {
                columnList.value.push({
                    title: col.columnName.split('_').join('_'),
                    dataIndex: col.columnName,
                    width: 'fit-content',
                    key: col.columnName,
                    type: col.type.name
                })
            })

            // columnList.value.unshift({
            //     title: 'KEY',
            //     dataIndex: 'key',
            //     width: 'fit-content',
            //     key: 'key',
            // })
        }
    }

    const setRows = (dataList: Ref<any>, columnList: Ref<any>, rows: any) => {
        const columns = toRaw(columnList.value)
        // console.log('columns: ', columns)
        // console.log('rows: ', rows)

        rows.map((result: any) => {
            // console.log(result)
            let tmp = {}
            result.map((row, rowindex) => {
                tmp = {
                    ...tmp,
                    ...{
                        // key: rowindex,
                        [columns[rowindex].dataIndex]: row,
                        // key: rowindex,
                    },
                }
            })
            dataList.value.push(tmp)
        })
        // console.log('rows: ', dataList)
    }

    const queryRun = (
        activeInlineTab: Ref<activeInlineTabInterface>,
        getData: (rows: any[], columns: any[], executionTime: number) => void,
        limitRows?: Ref<{ checked: boolean; rowsCount: number }>,
        onCompletion?: Function,
        onQueryIdGeneration?: Function,
        selectedText?: string,
        editorInstance: Ref<any>,
        monacoInstance: Ref<any>
    ) => {
        // console.log('inside run query: ', activeInlineTab.value)
        activeInlineTab.value.playground.resultsPane.result.isQueryRunning =
            'loading'
        activeInlineTab.value.playground.resultsPane.result.isQueryAborted = false
        const attributeValue =
            activeInlineTab.value?.playground?.editor?.context?.attributeValue
        let queryText
        /* Setting it undefined for new run */
        if (activeInlineTab.value.playground.resultsPane.result.runQueryId) {
            activeInlineTab.value.playground.resultsPane.result.runQueryId =
                undefined
        }

        // console.log('selected text: ', selectedText)
        /* Checking If any text is selected */
        
        if (selectedText && selectedText !== '') {
            queryText = getParsedQuery(
                activeInlineTab.value.playground.editor.variables,
                selectedText
            )
            console.log('position match selected query: ', queryText)
        } else {
            // queryText = getParsedQuery(
            //     activeInlineTab.value.playground.editor.variables,
            //     activeInlineTab.value.playground.editor.text
            // )
            // console.log('query: ', queryText)
            getParsedQueryCursor(
                activeInlineTab.value.playground.editor.variables,
                activeInlineTab.value.playground.editor.text,
                'auto',
                editorInstance.value,
                monacoInstance.value
            )
            const selectedQuery = toRaw(editorInstance.value)
                .getModel()
                .getValueInRange(
                    toRaw(editorInstance.value).getSelection()
                )
            console.log('selected query: ', selectedQuery)

            if(selectedQuery && selectedQuery.length) {
                queryText = getParsedQuery(
                    activeInlineTab.value.playground.editor.variables,
                    selectedQuery
                )
            } else {
                queryText = getParsedQuery(
                    activeInlineTab.value.playground.editor.variables,
                    activeInlineTab.value.playground.editor.text
                )
            }
            
        }
        // console.log('selected query: ', queryText)
        

        dataList.value = []
        const query = encodeURIComponent(btoa(queryText))
        /* -------- NOTE -----------
        Here defaultSchema -  'ATLAN_TRIAL.PUBLIC' instead of 'default/snowflake/vqaqufvr-i/ATLAN_TRIAL/PUBLIC'
        dataSourceName -  connectionQualifiedName
        */

        const params = {
            sql: query,
            dataSourceName: encodeURIComponent(
                getConnectionQualifiedName(attributeValue) as string
            ),
            length: 10,
        }
        /* This means it is a saved query */
        if (getSchemaWithDataSourceName(attributeValue)) {
            params.defaultSchema = getSchemaWithDataSourceName(attributeValue)
        }
        /* This means it is a saved query */
        if (activeInlineTab.value?.queryId) {
            params.savedQueryId = activeInlineTab.value?.queryId
        }
        /* Adding a limit param if limit rows is checked and limit is passed*/
        if (limitRows?.value && limitRows?.value?.checked)
            params['limit'] = limitRows.value.rowsCount

        let search_prms = generateQueryStringParamsFromObj(params)

        const pathVariables = {
            params: search_prms,
        }

        const {
            eventSource,
            data: sse,
            error,
            isLoading,
        } = useSSE({
            path: map.insights.RUN_QUERY,
            includeAuthHeader: true,
            pathVariables,
        })

        watch([isLoading, error], () => {
            console.log('heka request log: ', isLoading.value, error.value, )
            try {
                if (!isLoading.value && error.value === undefined) {
                    const { subscribe } = sse.value
                    subscribe('', (message: any) => {
                        /* Saving the queryId */
                        if (
                            message?.queryId &&
                            !activeInlineTab.value.playground.resultsPane.result
                                .runQueryId
                        ) {
                            activeInlineTab.value.playground.resultsPane.result.runQueryId =
                                message?.queryId
                            if (onQueryIdGeneration)
                                onQueryIdGeneration(
                                    message?.queryId,
                                    eventSource
                                )
                        }
                        /* ---------------------------------- */
                        // console.log(message, 'message')
                        if (message?.columns)
                            setColumns(columnList, message.columns)
                        if (message?.rows)
                            setRows(dataList, columnList, message.rows)
                        if (message?.details.status === 'completed') {
                            getData(
                                toRaw(dataList.value),
                                toRaw(columnList.value),
                                message?.details.executionTime
                            )
                            if (eventSource?.close) {
                                // for closing the connection
                                eventSource.close()
                            }
                            /* Query related data */
                            activeInlineTab.value.playground.resultsPane.result.isQueryRunning =
                                'success'
                            activeInlineTab.value.playground.resultsPane.result.executionTime =
                                message?.details.executionTime
                            activeInlineTab.value.playground.resultsPane.result.totalRowsCount =
                                message?.details.totalRowsStreamed
                            activeInlineTab.value.playground.resultsPane.result.errorDecorations =
                                []
                            activeInlineTab.value.playground.resultsPane.result.queryErrorObj =
                                {}
                            /* Setting it undefined for new run */

                            activeInlineTab.value.playground.resultsPane.result.runQueryId =
                                undefined
                            /* Callback will be called when request completed */
                            if (onCompletion) onCompletion('success')

                            /* ------------------- */
                        }
                        if (message?.details?.status === 'error') {
                            if (eventSource?.close) {
                                console.log('coonection closed')
                                eventSource.close()
                            }
                            /* Query related data */
                            activeInlineTab.value.playground.resultsPane.result.queryErrorObj =
                                message
                            activeInlineTab.value.playground.resultsPane.result.totalRowsCount =
                                -1
                            activeInlineTab.value.playground.resultsPane.result.executionTime =
                                -1
                            activeInlineTab.value.playground.resultsPane.result.isQueryRunning =
                                'error'
                            /* ------------------- */
                            /* Setting it undefined for new run */

                            activeInlineTab.value.playground.resultsPane.result.runQueryId =
                                undefined
                            /* Callback will be called when request completed */
                            if (onCompletion) onCompletion('error')
                        }
                    })
                } else if (!isLoading.value && error.value !== undefined) {
                    /* Setting it undefined for new run */

                    activeInlineTab.value.playground.resultsPane.result.runQueryId =
                        undefined
                    setColumns(columnList, [])
                    setRows(dataList, columnList, [])
                    getData([], [], -1)
                    /* Query related data */
                    /* Query related data */
                    activeInlineTab.value.playground.resultsPane.result.totalRowsCount =
                        -1
                    activeInlineTab.value.playground.resultsPane.result.executionTime =
                        -1
                    activeInlineTab.value.playground.resultsPane.result.isQueryRunning =
                        'error'
                    /* ------------------- */
                    /* USE SSE ERROR */
                    console.log('HEKA ERROR: ', error.value)
                    if (
                        error.value?.error &&
                        Array.isArray(error.value?.error?.message)
                    ) {
                        

                        activeInlineTab.value.playground.resultsPane.result.queryErrorObj =
                            {
                                requestId: '',
                                errorName: '',
                                errorMessage:
                                    error.value?.error?.message.split('.')[0] ??
                                    'Something went wrong',
                                errorCode: undefined,
                                developerMessage: '', // (optional field)enabled in case of unhandled error
                            }
                    } else {
                        /* Network req error */
                        const status = error.value?.status ?? error.value?.code
                        activeInlineTab.value.playground.resultsPane.result.queryErrorObj =
                            {
                                requestId: '',
                                errorName: '',
                                errorMessage:
                                    error.value?.message ??
                                    'Something went wrong',
                                errorCode: status,
                                developerMessage: '', // (optional field)enabled in case of unhandled error
                            }
                    }

                    /* Setting it undefined for new run */

                    activeInlineTab.value.playground.resultsPane.result.runQueryId =
                        undefined
                    /* Callback will be called when request completed */
                    if (onCompletion) onCompletion('error')
                }
            } catch (e) {}
        })
    }

    /* sucess| error */
    const onRunCompletion = (
        status: string,
        activeInlineTab: Ref<activeInlineTabInterface>,
        editorInstance: Ref<any>,
        monacoInstance: Ref<any>
    ) => {
        if (status === 'success') {
            /* Resetting the red dot from the editor if it error is not line type */
            resetErrorDecorations(activeInlineTab, toRaw(editorInstance.value))
        } else if ((status = 'error')) {
            resetErrorDecorations(activeInlineTab, toRaw(editorInstance.value))
            /* If it is a line error i,e VALIDATION_ERROR | QUERY_PARSING_ERROR */
            const errorName =
                activeInlineTab.value?.playground?.resultsPane?.result
                    ?.queryErrorObj?.errorName
            if (LINE_ERROR_NAMES.includes(errorName)) {
                setErrorDecorations(
                    activeInlineTab,
                    toRaw(editorInstance),
                    toRaw(monacoInstance)
                )
            }
        }
    }
    const abortQuery = (
        activeInlineTab: Ref<activeInlineTabInterface>,
        inlineTabs: Ref<activeInlineTabInterface[]>,
        editorInstance: Ref<any>,
        monacoInstance: Ref<any>
    ) => {
        /* Abort Query logic */
        activeInlineTab.value.playground.resultsPane.result.buttonDisable = true
        const body = {
            queryId:
                activeInlineTab.value.playground.resultsPane.result.runQueryId,
            dataSourceName: getConnectionQualifiedName(
                activeInlineTab.value.explorer.schema.connectors.attributeValue
            ),
        }
        if (
            activeInlineTab.value.playground.resultsPane.result
                .eventSourceInstance?.close
        ) {
            activeInlineTab.value.playground.resultsPane.result.eventSourceInstance?.close()
        }

        /* Change loading state */
        Insights.AbortQuery(body)
            .then(() => {
                activeInlineTab.value.playground.resultsPane.result.isQueryRunning =
                    ''
                activeInlineTab.value.playground.resultsPane.result.isQueryAborted = true

                activeInlineTab.value.playground.resultsPane.result.eventSourceInstance =
                    undefined

                activeInlineTab.value.playground.resultsPane.result.buttonDisable =
                    false
                activeInlineTab.value.playground.resultsPane.result.runQueryId =
                    undefined
                /* For syncing with local storage */
                const activeInlineTabCopy: activeInlineTabInterface =
                    Object.assign({}, activeInlineTab.value)
                modifyActiveInlineTab(
                    activeInlineTabCopy,
                    inlineTabs,
                    activeInlineTabCopy.isSaved
                )

            })
            .catch((error) => {
                /* Query related data */

                const errorCode = error?.status
                    ? `${error.status} - ${error.statusText}`
                    : undefined
                activeInlineTab.value.playground.resultsPane.result.queryErrorObj =
                    {
                        requestId: '',
                        errorName: '',
                        errorMessage:
                            error.value?.message ?? 'Something went wrong',
                        errorCode: errorCode,
                        developerMessage: '', // (optional field)enabled in case of unhandled error
                    }
                activeInlineTab.value.playground.resultsPane.result.totalRowsCount =
                    -1
                activeInlineTab.value.playground.resultsPane.result.executionTime =
                    -1
                activeInlineTab.value.playground.resultsPane.result.isQueryRunning =
                    'error'
                /* ------------------- */
                /* Setting it undefined for new run */

                activeInlineTab.value.playground.resultsPane.result.runQueryId =
                    undefined
                activeInlineTab.value.playground.resultsPane.result.buttonDisable =
                    false
                /* Callback will be called when request completed */
                if (onRunCompletion)
                    onRunCompletion(
                        'error',
                        activeInlineTab,
                        editorInstance,
                        monacoInstance
                    )
            })
    }

    return {
        onRunCompletion,
        abortQuery,
        queryErrorObj,
        queryExecutionTime,
        isQueryRunning,
        queryRun,
        dataList,
        columnList,
    }
}
