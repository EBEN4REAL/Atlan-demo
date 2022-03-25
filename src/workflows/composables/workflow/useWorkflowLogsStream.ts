import { ref, inject, toRaw, Ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useSSE } from '~/modules/useSSE'
import { map } from '~/services/service/workflows/key'
import { generateQueryStringParamsFromObj } from '~/utils/queryString'

export default function useWorkflowLogsStream(id) {
    // const router = useRouter();
    // const columnList: Ref<[
    //   {
    //     title: string;
    //     dataIndex: string;
    //     width: string;
    //     key: any;
    //   }
    // ]> = ref([]);
    // let dataList = ref([]);
    const status = ref('')

    // const listData = [
    //   {
    //     title: "Profit by Segment",
    //     description:
    //       'SELECT "Segment", SUM("Profit") AS "sum of Profit" FROM "superstore_sales_data_2016-present" GROUP BY "Segment"',
    //   },
    //   {
    //     title: "Sales by City",
    //     description:
    //       'SELECT "City", COUNT("Sales") AS "count of Sales" FROM "superstore_sales_data_2016-present" GROUP BY "City" ORDER BY "count of Sales" DESC  LIMIT 50',
    //   },
    //   {
    //     title: "Missing Postal Codes",
    //     description:
    //       'SELECT * FROM "superstore_sales_data_2016-present" WHERE "Postal Code" IS NULL LIMIT 50',
    //   },
    //   {
    //     title: "Orders by City",
    //     description:
    //       'SELECT "Segment", SUM("Profit") AS "sum of Profit" FROM "superstore_sales_data_2016-present" GROUP BY "Segment"',
    //   },
    // ];

    // const handleBack = () => {
    //   router.push("assets");
    // };

    // const setColumns = (columnList: Ref<any>, columns: any) => {
    //   columnList.value = [];
    //   columns.map((col: any) => {
    //     columnList.value.push({
    //       title: col.columnName.split("_").join(" "),
    //       dataIndex: col.columnName,
    //       width: "9vw",
    //       key: col.columnName,
    //     });
    //   });
    // };

    // const setRows = (dataList: Ref<any>, columnList: Ref<any>, rows: any) => {
    //   rows.map((result: any) => {
    //     const columns = toRaw(columnList.value);
    //     let tmp = {};
    //     result.map((row, rowindex) => {
    //       tmp = {
    //         ...tmp,
    //         ...{
    //           [columns[rowindex].dataIndex]: row,
    //           key: rowindex,
    //         },
    //       };
    //     });
    //     dataList.value.push(tmp);
    //   });
    // };

    const params = { podName: `generate-b6cvc-3034449222` }

    const search_prms = generateQueryStringParamsFromObj(params)

    console.log(search_prms)

    const pathVariables = {
        params: search_prms,
        id,
    }

    const getLiveLogs = (newId) => {
        console.log('IN SJNSHBHSB', newId)

        pathVariables.id = newId
        status.value = 'loading'
        // dataList.value = [];

        // let query = btoa('select * from "WEB_SALES" limit 100');
        // const url = `http://localhost:3333/api/auth/argo/tenants/default/workflows/default/atlan-init-tgx7h/log?logOptions.container=main&grep=&logOptions.follow=true`;
        const {
            data: sse,
            error,
            isLoading,
        } = useSSE({
            path: map.ARCHIVED_WORKFLOW_RUN_LOGS,
            includeAuthHeader: true,
            pathVariables,
        })

        watch(isLoading, () => {
            console.log(isLoading.value, error.value, 'request log')

            if (!isLoading.value && error.value == undefined) {
                console.log('get herrrre hbh')

                const { onError, subscribe, close } = sse.value
                subscribe('', (message: any) => {
                    console.log('in subscribe')
                    console.log(message)
                    // if (message.columns) setColumns(columnList, message.columns);
                    // if (message.results) setRows(dataList, columnList, message.results);
                })
                onError((e: any) => {
                    if (e.error) {
                        console.error('lost connection; giving up!', e)
                    }
                    console.log('came to close', e)

                    close()
                })
                status.value = 'success'
            } else {
                console.error('Failed to connect to server', error.value)
                status.value = 'error'
            }
        })
    }

    return {
        getLiveLogs,
        status,
    }
}
