import { ref, toRaw, Ref, watch } from 'vue'
import { useSSE } from '~/modules/useSSE'
import { KeyMaps } from '~/api/keyMap'
import { message } from 'ant-design-vue'
import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'

export default function useProject() {
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
        let queryText = activeInlineTab.playground.editor.text
        // by default limiting query to 100 if limit is not there
        queryText = queryText.includes('limit')
            ? queryText
            : `${queryText} limit 100`
        isQueryRunning.value = 'loading'
        dataList.value = []
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
            data: sse,
            error,
            isLoading,
        } = useSSE({
            path: KeyMaps.query.RUN_QUERY,
            includeAuthHeader: true,
            pathVariables,
        })

        watch(isLoading, () => {
            if (isLoading.value && error.value == undefined) {
                const { onError, subscribe, close } = sse.value
                onError((e: any) => {
                    if (e.error) {
                        console.error('lost connection; giving up!', e)
                    }
                    isQueryRunning.value = ''
                    close()
                })
                subscribe('', (message: any) => {
                    if (message?.columns)
                        setColumns(columnList, message.columns)
                    if (message?.rows)
                        setRows(dataList, columnList, message.rows)
                    if (message?.status === 'completed') {
                    }
                    getData(dataList.value, columnList.value)
                })
                isQueryRunning.value = 'success'
            } else {
                console.error('Failed to connect to server', error.value)
                isQueryRunning.value = 'error'
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
