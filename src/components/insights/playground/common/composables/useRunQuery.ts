import { ref, toRaw, Ref, watch, callWithAsyncErrorHandling } from 'vue'
import { useSSE } from '~/modules/useSSE'
import { KeyMaps } from '~/services/heka/heka_keyMaps'
import { message } from 'ant-design-vue'
import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
import { useEditor } from '~/components/insights/common/composables/useEditor'
import { useConnector } from '~/components/insights/common/composables/useConnector'
import { generateQueryStringParamsFromObj } from '~/utils/queryString'

export default function useProject() {
    const { getParsedQuery, formatter } = useEditor()
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

    const setColumns = (columnList: Ref<any>, columns: any) => {
        if (columns.length > 0) {
            columnList.value = []
            columns.map((col: any) => {
                columnList.value.push({
                    title: col.columnName.split('_').join(' '),
                    dataIndex: col.columnName,
                    width: '9vw',
                    key: col.columnName,
                })
            })
        }
    }

    const setRows = (dataList: Ref<any>, columnList: Ref<any>, rows: any) => {
        const columns = toRaw(columnList.value)
        rows.map((result: any) => {
            let tmp = {}
            result.map((row, rowindex) => {
                tmp = {
                    ...tmp,
                    ...{
                        [columns[rowindex].dataIndex]: row,
                        key: rowindex,
                    },
                }
            })
            dataList.value.push(tmp)
        })
    }

    const queryRun = (
        activeInlineTab: activeInlineTabInterface,
        getData: (rows: any[], columns: any[], executionTime: number) => void,
        isQueryRunning: Ref<string>,
        limitRows?: Ref<{ checked: boolean; rowsCount: number }>
    ) => {
        const attributeValue =
            activeInlineTab.explorer.schema.connectors.attributeValue
        let queryText = getParsedQuery(
            activeInlineTab.playground.editor.variables,
            activeInlineTab.playground.editor.text
        )

        isQueryRunning.value = 'loading'
        dataList.value = []
        const query = encodeURIComponent(btoa(queryText))
        /* -------- NOTE -----------
        Here defaultSchema -  'ATLAN_TRIAL.PUBLIC' instead of 'default/snowflake/vqaqufvr-i/ATLAN_TRIAL/PUBLIC'
        dataSourceName -  connectionQualifiedName
        */

        const params = {
            sql: query,
            defaultSchema: getSchemaWithDataSourceName(attributeValue),
            dataSourceName: encodeURIComponent(
                getConnectionQualifiedName(attributeValue) as string
            ),
            length: 10,
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
            try {
                isQueryRunning.value = !isLoading.value ? 'success' : 'loading'
                if (!isLoading.value && error.value === undefined) {
                    const { subscribe, close } = sse.value
                    subscribe('', (message: any) => {
                        if (message?.columns)
                            setColumns(columnList, message.columns)
                        if (message?.rows)
                            setRows(dataList, columnList, message.rows)
                        if (message?.status === 'completed') {
                            getData(
                                toRaw(dataList.value),
                                toRaw(columnList.value),
                                message?.executionTime
                            )
                            close()
                        }
                    })
                } else if (!isLoading.value && error.value !== undefined) {
                    console.error('Failed to connect to server', error.value)
                    if (error.value?.status && error.value?.statusText) {
                        message.error({
                            content: `${error.value.status} ${error.value.statusText}!`,
                        })
                        if (eventSource?.close) {
                            // for closing the connection in case of error
                            eventSource.close()
                        }
                    } else {
                        message.error({
                            content: `Something went wrong!`,
                        })
                        if (eventSource?.close) {
                            // for closing the connection in case of error
                            eventSource.close()
                        }
                    }
                    setColumns(columnList, [])
                    setRows(dataList, columnList, [])
                    getData([], [], -1)
                    isQueryRunning.value = 'error'
                }
            } catch (e) {
                if (eventSource?.close) {
                    // for closing the connection in case of error
                    eventSource.close()
                }
            }
        })
    }
    const modifyQueryExecutionTime = (
        queryExecutionTime: Ref<number>,
        exTime: number
    ) => {
        queryExecutionTime.value = exTime
    }

    return {
        modifyQueryExecutionTime,
        queryExecutionTime,
        isQueryRunning,
        queryRun,
        dataList,
        columnList,
    }
}
