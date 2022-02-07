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
import useAddEvent from '~/composables/eventTracking/useAddEvent'
import { message } from 'ant-design-vue'
import { useError } from './UseError'
import { canQueryAbort } from '~/components/insights/common/composables/getDialectInfo'

import { useTimer } from '~/components/insights/playground/resultsPane/result/timer/useTimer'

export default function useRunQuery() {
    const {
        getParsedQuery,
        resetErrorDecorations,
        resetLineDecorations,
        setErrorDecorations,
        getParsedQueryCursor,
    } = useEditor()

    const {
        getSchemaWithDataSourceName,
        getConnectionQualifiedName,
        getConnectorName,
    } = useConnector()
    const { modifyActiveInlineTab } = useInlineTab()

    const setColumns = (columnList: Ref<any>, columns: any) => {
        // console.log('columns: ', columns)
        if (columns.length > 0) {
            columnList.value = []
            columns.map((col: any, index) => {
                columnList.value.push({
                    title: col.columnName,
                    dataIndex: col.columnName + index,
                    key: index + 1,
                    data_type: col.type.name,
                })
            })
        }
    }

    let keys = ref(0)

    const setRows = (dataList: Ref<any>, columnList: Ref<any>, rows: any) => {
        rows.map((result: any, index1) => {
            dataList.value.push(result)
        })
    }

    const queryRun = (
        activeInlineTab: Ref<activeInlineTabInterface>,
        getData: (
            activeInlineTab,
            rows: any[],
            columns: any[],
            executionTime: number
        ) => void,
        limitRows?: Ref<{ checked: boolean; rowsCount: number }>,
        onCompletion?: Function,
        onQueryIdGeneration?: Function,
        selectedText?: string,
        editorInstance: Ref<any>,
        monacoInstance: Ref<any>,
        showVQB: Ref<Boolean> = ref(false)
    ) => {
        if (
            activeInlineTab.value.playground.resultsPane.result
                .isQueryRunning === 'loading'
        ) {
            message.info('A query is in progress in current tab')
            return
        }
        let startTime = new Date()

        // setStartTime(new Date())

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

        const { start, reset } = useTimer(activeInlineTab)

        // resetErrorDecorations(activeInlineTab, toRaw(editorInstance.value))
        if (editorInstance?.value) {
            resetErrorDecorations(activeInlineTab, toRaw(editorInstance.value))
            resetLineDecorations(editorInstance.value)
        }
        // console.log('inside run query: ', activeInlineTab.value)
        activeInlineTab.value.playground.resultsPane.result.isQueryRunning =
            'loading'
        activeInlineTab.value.playground.resultsPane.result.isQueryAborted =
            false
        const attributeValue =
            activeInlineTab.value?.playground?.editor?.context?.attributeValue
        let queryText
        /* Setting it undefined for new run */
        if (activeInlineTab.value.playground.resultsPane.result.runQueryId) {
            activeInlineTab.value.playground.resultsPane.result.runQueryId =
                undefined
        }

        let semiColonMatchs = toRaw(editorInstance.value)
            ?.getModel()
            ?.findMatches(';')

        if (semiColonMatchs?.length === 0) {
            console.log('no semi colon')
            if (showVQB.value) {
                queryText = selectedText
                activeInlineTab.value.playground.editor.text = getParsedQuery(
                    activeInlineTab.value.playground.editor.variables,
                    queryText
                )
            } else {
                if (selectedText && selectedText !== '') {
                    queryText = getParsedQuery(
                        activeInlineTab.value.playground.editor.variables,
                        selectedText
                    )
                } else {
                    queryText = getParsedQuery(
                        activeInlineTab.value.playground.editor.variables,
                        activeInlineTab.value.playground.editor.text
                    )
                }
            }
        } else if (selectedText && selectedText !== '') {
            if (showVQB.value) {
                queryText = selectedText
            } else {
                queryText = getParsedQuery(
                    activeInlineTab.value.playground.editor.variables,
                    selectedText
                )
                var count = 0
                let text = queryText

                // console.log('selected query text1: ', { queryText })

                while (text.startsWith('\n')) {
                    text = text.slice(1)
                    // console.log('selected query text: ', { text })
                    count++
                }

                let selection = toRaw(editorInstance.value)?.getSelection()
                // console.log('selected query text3: ', selection)

                for (
                    var i = 0;
                    i < count + selection?.startLineNumber - 1;
                    i++
                ) {
                    queryText = '\n' + queryText
                }
            }
        } else if (activeInlineTab.value.playground.editor.text !== '') {
            let queryData = getParsedQueryCursor(
                activeInlineTab.value.playground.editor.variables,
                activeInlineTab.value.playground.editor.text,
                'auto',
                editorInstance.value,
                monacoInstance.value
            )

            let selectedQuery = queryData.rawQuery.replace(/^\s+|\s+$/g, '')
            let newLines = '\n'.repeat(queryData.range.startLineNumber - 1)
            selectedQuery = newLines + selectedQuery

            // console.log('selected query: ', selectedQuery)

            if (selectedQuery && selectedQuery.length) {
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
        } else {
            queryText = ''
        }
        // console.log('selected query: ', queryText)

        dataList.value = []

        let query = queryText

        try {
            // query = encodeURIComponent(btoa(queryText))
        } catch (error) {
            // console.log('query error: ', error)
            if (error) {
                activeInlineTab.value.playground.resultsPane.result.isQueryRunning =
                    ''
                message.error('Query format not supported')
            }
            return
        }

        const params = {
            length: 10,
        }
        const sqlBody = {
            sql: query,
            dataSourceName: getConnectionQualifiedName(
                attributeValue
            ) as string,
        }
        /* This means it is a saved query */
        if (getSchemaWithDataSourceName(attributeValue)) {
            sqlBody.defaultSchema = getSchemaWithDataSourceName(attributeValue)
        }
        /* This means it is a saved query */
        if (activeInlineTab.value?.queryId) {
            params.savedQueryId = activeInlineTab.value?.queryId
        }
        /* Adding a limit param if limit rows is checked and limit is passed*/
        if (limitRows?.value && limitRows?.value?.checked) {
            params['limit'] = limitRows.value.rowsCount
        }

        useAddEvent('insights', 'query', 'run', {
            saved_query: !!params.savedQueryId,
            visual_query: activeInlineTab.value.playground.isVQB,
            limit_100: !!params.limit,
        })

        let search_prms = generateQueryStringParamsFromObj(params)

        const pathVariables = {
            params: search_prms,
        }

        keys.value = 0

        // start timer
        start()

        activeInlineTab.value.playground.resultsPane.result.abortQueryFn = reset

        const {
            eventSource,
            data: sse,
            error,
            isLoading,
        } = useSSE({
            path: map.insights.RUN_QUERY,
            includeAuthHeader: true,
            pathVariables,
            body: sqlBody,
        })
        activeInlineTab.value.playground.resultsPane.result.eventSourceInstance =
            eventSource.value

        watch([isLoading, error], () => {
            try {
                if (!isLoading.value && error.value === undefined) {
                    // if query aborted then don't show the midway fetched data
                    if (
                        activeInlineTab.value.playground.resultsPane.result
                            .isQueryAborted
                    )
                        return

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
                                    activeInlineTab,
                                    message?.queryId
                                )
                        }
                        // debugger

                        /* ---------------------------------- */
                        if (message?.columns)
                            setColumns(columnList, message.columns)
                        if (message?.rows)
                            setRows(dataList, columnList, message.rows)
                        if (message?.details.status === 'completed') {
                            getData(
                                activeInlineTab,
                                toRaw(dataList.value),
                                toRaw(columnList.value),
                                message?.details.executionTime
                            )
                            if (eventSource.value?.close) {
                                eventSource.value.close()
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

                            let endTime = new Date()
                            activeInlineTab.value.playground.resultsPane.result.executionTime =
                                endTime - startTime

                            if (onCompletion) {
                                onCompletion(activeInlineTab, 'success')
                            }
                            //IMP: connection need to be closed here
                            if (eventSource.value?.close) {
                                eventSource.value.close()
                            }
                            reset()

                            /* ------------------- */
                        }
                        if (message?.details?.status === 'error') {
                            const { setHekaErrorInActiveInlineTab } = useError()
                            setHekaErrorInActiveInlineTab(
                                activeInlineTab,
                                eventSource,
                                message
                            )
                            /* Callback will be called when request completed */
                            if (onCompletion) {
                                onCompletion(activeInlineTab, 'error')
                            }
                            //IMP: connection need to be closed here
                            if (eventSource.value?.close) {
                                eventSource.value.close()
                            }
                            reset()
                        }
                    })
                } else if (
                    !isLoading.value &&
                    error.value !== undefined &&
                    !activeInlineTab.value.playground.resultsPane.result
                        .isQueryAborted
                ) {
                    const { setStreamErrorInActiveInlineTab } = useError()
                    setStreamErrorInActiveInlineTab(activeInlineTab, error)
                    /* Callback will be called when request completed */
                    if (onCompletion) onCompletion(activeInlineTab, 'error')
                    //IMP: connection need to be closed here
                    if (eventSource.value?.close) {
                        eventSource.value.close()
                    }
                    reset()
                }
            } catch (e) {
                if (onCompletion) onCompletion(activeInlineTab, 'error')
                if (eventSource.value?.close) {
                    eventSource.value.close()
                }
                reset()
            }
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
        if (
            activeInlineTab.value.playground.resultsPane.result
                .eventSourceInstance?.close
        ) {
            activeInlineTab.value.playground.resultsPane.result.eventSourceInstance?.close()
            // debugger
        }

        // stop timer

        if (activeInlineTab.value.playground.resultsPane.result.abortQueryFn) {
            activeInlineTab.value.playground.resultsPane.result.abortQueryFn()
            console.log('clock running abort timer stop 1')
        }

        if (
            canQueryAbort(
                getConnectorName(
                    activeInlineTab.value.playground.editor.context
                        .attributeValue
                ) as string
            ) &&
            activeInlineTab.value.playground.resultsPane.result.runQueryId
        ) {
            // stop timer

            /* Abort Query logic */
            activeInlineTab.value.playground.resultsPane.result.buttonDisable =
                true
            const body = {
                queryId:
                    activeInlineTab.value.playground.resultsPane.result
                        .runQueryId,
                dataSourceName: getConnectionQualifiedName(
                    activeInlineTab.value.explorer.schema.connectors
                        .attributeValue
                ),
            }

            /* Change loading state */
            Insights.AbortQuery(body)
                .then(() => {
                    activeInlineTab.value.playground.resultsPane.result.isQueryRunning =
                        ''
                    activeInlineTab.value.playground.resultsPane.result.isQueryAborted =
                        true

                    activeInlineTab.value.playground.resultsPane.result.eventSourceInstance =
                        undefined

                    activeInlineTab.value.playground.resultsPane.result.buttonDisable =
                        false
                    activeInlineTab.value.playground.resultsPane.result.runQueryId =
                        undefined
                })
                .catch((error) => {
                    /* Query related data */
                    /* 
        If errorCode -  exist error from backend 
        If errorCode - not exist, req did not reached server

        */
                    let errorCode = error?.response?.status
                    let errorMessage
                    if (errorCode) {
                        // backed error message
                        errorMessage =
                            error?.response?.data?.error?.message ??
                            'Query Abort Failed!'
                    } else {
                        errorCode = '000'
                        errorMessage = error?.message
                        // capitalizeFirstLetter
                        errorMessage =
                            errorMessage.charAt(0).toUpperCase() +
                            errorMessage.slice(1)
                    }

                    activeInlineTab.value.playground.resultsPane.result.queryErrorObj =
                        activeInlineTab.value.playground.resultsPane.result.queryErrorObj =
                            {
                                requestId:
                                    activeInlineTab.value.playground.resultsPane
                                        .result.runQueryId,
                                errorName: errorMessage,
                                errorMessage: errorMessage,
                                errorCode: errorCode,
                                developerMessage: error.value?.statusText,
                                errorDescription: '',
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
        } else {
            // cancel stream query
            // if (
            //     activeInlineTab.value.playground.resultsPane.result.abortQueryFn
            // ) {
            //     activeInlineTab.value.playground.resultsPane.result.abortQueryFn()
            //     console.log('clock running abort timer stop 2')
            // }
            // FIXME: code repetetion
            activeInlineTab.value.playground.resultsPane.result.isQueryRunning =
                ''
            activeInlineTab.value.playground.resultsPane.result.isQueryAborted =
                true

            activeInlineTab.value.playground.resultsPane.result.eventSourceInstance =
                undefined

            activeInlineTab.value.playground.resultsPane.result.buttonDisable =
                false
            activeInlineTab.value.playground.resultsPane.result.runQueryId =
                undefined
        }
    }

    return {
        onRunCompletion,
        abortQuery,
        // queryErrorObj,
        // queryExecutionTime,
        // isQueryRunning,
        queryRun,
        // dataList,
        // columnList,
    }
}
