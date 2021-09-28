import { ref, toRaw, Ref, watch, callWithAsyncErrorHandling } from 'vue'
import { useSSE } from '~/modules/useSSE'
import { KeyMaps } from '~/api/keyMap'
import { message } from 'ant-design-vue'
import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
import { useEditor } from '~/components/insights/playground/common/composables/useEditor'

export default function useProject() {
    const { getParsedQuery } = useEditor()
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
        getData: any,
        isQueryRunning: Ref<string>
    ) => {
        const selectedDataSourceName =
            activeInlineTab.explorer.schema.connectors.selectedDataSourceName
        const selectedDefaultSchema =
            activeInlineTab.explorer.schema.connectors.selectedDefaultSchema
        let queryText = getParsedQuery(
            activeInlineTab.playground.editor.variables,
            activeInlineTab.playground.editor.text
        )

        // by default limiting query to 100 if limit is not there
        queryText = queryText.includes('limit')
            ? queryText
            : `${queryText} limit 100`

        isQueryRunning.value = 'loading'
        dataList.value = []
        console.log(queryText)
        const query = encodeURIComponent(btoa(queryText))
        const pathVariables = {
            query,
            defaultSchema: selectedDefaultSchema
                ? selectedDefaultSchema
                : 'ATLAN_TRIAL.PUBLIC',
            dataSourceName: encodeURIComponent(
                selectedDataSourceName
                    ? selectedDataSourceName
                    : 'default/snowflake/vqaqufvr-i'
            ),
            length: 10,
        }

        const {
            eventSource,
            data: sse,
            error,
            isLoading,
        } = useSSE({
            path: KeyMaps.query.RUN_QUERY,
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
                                toRaw(columnList.value)
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
                    getData([], [])
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

    return {
        isQueryRunning,
        queryRun,
        dataList,
        columnList,
    }
}
