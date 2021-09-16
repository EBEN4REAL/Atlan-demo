import { ref, toRaw, Ref, watch } from 'vue'
import { useSSE } from '~/modules/useSSE'
import { KeyMaps } from '~/api/keyMap'

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
        console.log(columns, 'columns')
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
            console.log(tmp)
            dataList.value.push(tmp)
        })
    }

    const queryRun = () => {
        isQueryRunning.value = 'loading'
        dataList.value = []
        const query = encodeURIComponent(
            btoa('select * from WEB_SALES limit 100')
        )
        const pathVariables = {
            query,
            defaultSchema: 'SNOWFLAKE_SAMPLE_DATA.TPCDS_SF10TCL',
            dataSourceName: encodeURIComponent('default/snowflake/bvscezvng'),
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
                    close()
                })
                subscribe('', (message: any) => {
                    if (message?.columns)
                        setColumns(columnList, message.columns)
                    if (message?.rows)
                        setRows(dataList, columnList, message.rows)
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
