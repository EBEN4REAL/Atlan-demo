import { ref, toRaw, Ref, watch, callWithAsyncErrorHandling } from 'vue'
import { useSSE } from '~/modules/useSSE'
import { KeyMaps } from '~/services/heka/heka_keyMaps'
import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
import { useEditor } from '~/components/insights/common/composables/useEditor'
import { useConnector } from '~/components/insights/common/composables/useConnector'
import { generateQueryStringParamsFromObj } from '~/utils/queryString'

export default function useProject() {
    const { getParsedQuery } = useEditor()
    const { getSchemaWithDataSourceName, getConnectionQualifiedName } =
        useConnector()
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
                    title: col.columnName.split('_').join(' '),
                    dataIndex: col.columnName,
                    width: 'fit-content',
                    key: col.columnName,
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
                        [columns[rowindex].dataIndex]: row
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
        onCompletion?: Function
    ) => {
        activeInlineTab.value.playground.resultsPane.result.isQueryRunning =
            'loading'
        const attributeValue =
            activeInlineTab.value.explorer.schema.connectors.attributeValue
        let queryText

        queryText = getParsedQuery(
            activeInlineTab.value.playground.editor.variables,
            activeInlineTab.value.playground.editor.text
        )

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
            path: KeyMaps.insights.RUN_QUERY,
            includeAuthHeader: true,
            pathVariables,
        })

        watch([isLoading, error], () => {
            console.log(isLoading.value, error.value, 'request log')
            try {
                if (!isLoading.value && error.value === undefined) {
                    const { subscribe } = sse.value
                    subscribe('', (message: any) => {
                        console.log(message, 'message')
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
                            /* Callback will be called when request completed */
                            if (onCompletion) onCompletion('success')

                            /* ------------------- */
                        }
                        if (message?.details?.status === 'error') {
                            if (eventSource?.close) {
                                // for closing the connection
                                console.log('coonectio closed')
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
                            /* Callback will be called when request completed */
                            if (onCompletion) onCompletion('error')
                        }
                    })
                } else if (!isLoading.value && error.value !== undefined) {
                    console.log(
                        'Failed to connect to server',
                        error.value,
                        'error'
                    )
                    if (eventSource?.close) {
                        // for closing the connection in case of error
                        eventSource.close()
                    }
                    setColumns(columnList, [])
                    setRows(dataList, columnList, [])
                    getData([], [], -1)
                }
            } catch (e) {
                if (eventSource?.close) {
                    // for closing the connection in case of error
                    eventSource.close()
                }
            }
        })
    }

    return {
        queryErrorObj,
        queryExecutionTime,
        isQueryRunning,
        queryRun,
        dataList,
        columnList,
    }
}
