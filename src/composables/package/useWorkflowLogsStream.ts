import { ref, inject, toRaw, Ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useSSE } from '~/modules/useSSE'
import { map } from '~/services/service/workflows/key'
import { generateQueryStringParamsFromObj } from '~/utils/queryString'

export default function useWorkflowLogsStream(id) {
    const status = ref('')

    const params = { podName: `nityatest-kj9p7-2376691305` }

    const search_prms = generateQueryStringParamsFromObj(params)

    const pathVariables = {
        params: search_prms,
        id,
    }

    const getLiveLogs = (newId) => {
        pathVariables.id = 'nityatest-kj9p7'
        status.value = 'loading'

        console.log(map.ARCHIVED_WORKFLOW_RUN_LOGS)

        const {
            data: sse,
            error,
            isLoading,
        } = useSSE({
            path: map.ARCHIVED_WORKFLOW_RUN_LOGS,
            includeAuthHeader: true,
            pathVariables,
            method: 'GET',
        })

        watch([isLoading, error], () => {
            if (!isLoading.value && error.value === undefined) {
                const { subscribe, error } = sse.value
                console.log(error)
                subscribe('', (message: any) => {
                    console.log(message)
                })
            }
            console.log('changed', isLoading, error)
        })

        // watch(isLoading, () => {
        //     if (!isLoading.value && error.value == undefined) {
        //         const { onError, subscribe, close } = sse.value
        //         subscribe('', (message: any) => {
        //             console.log('in subscribe')
        //             console.log(message)
        //             // if (message.columns) setColumns(columnList, message.columns);
        //             // if (message.results) setRows(dataList, columnList, message.results);
        //         })
        //         onError((e: any) => {
        //             if (e.error) {
        //                 console.error('lost connection; giving up!', e)
        //             }
        //             close()
        //         })
        //         status.value = 'success'
        //     } else {
        //         console.error('Failed to connect to server', error.value)
        //         status.value = 'error'
        //     }
        // })
    }

    return {
        getLiveLogs,
        status,
    }
}
