import { until } from '@vueuse/core'
import { ref, Ref } from 'vue'

import { useSSE, useSSEReturnObj } from '~/modules/useSSE'
import { map } from '~/services/service/workflows/key'
import { generateQueryStringParamsFromObj } from '~/utils/queryString'

export default function useWorkflowLogsStream() {
    const eventSource: Ref<useSSEReturnObj | undefined> = ref(undefined)
    const logArray: Ref<{ id: number; text: string }[]> = ref([])
    const status = ref('')
    const error = ref()

    const resetState = () => {
        eventSource.value = undefined
        logArray.value = []
        status.value = ''
        error.value = undefined
    }

    const disconnect = () => {
        eventSource.value?.unsubscribe?.('')
        eventSource.value?.close?.()
        eventSource.value = undefined
    }

    const connect = async (id: string, podName: string) => {
        // resetState()
        status.value = 'CONNECTING'

        const search_prms = generateQueryStringParamsFromObj({
            podName,
        })

        const {
            data: sse,
            error: err,
            isLoading,
        } = useSSE({
            path: map.ARCHIVED_WORKFLOW_RUN_LOGS,
            pathVariables: {
                id,
                params: search_prms,
            },
            includeAuthHeader: true,
            method: 'GET',
            body: {},
        })

        eventSource.value = sse.value

        await until(isLoading).toBe(false)

        if (err.value) {
            error.value = err.value
        }

        status.value = 'CONNECTED'

        sse.value.subscribe?.('', (msg, event) => {
            console.log('msg', msg, 'event', event)
            if (event.lastEventId === '-1') {
                status.value = 'COMPLETED'
                disconnect()
            } else {
                logArray.value.push({
                    id: Date.now(),
                    text: msg?.result?.content,
                })
            }
        })

        setTimeout(() => {
            if (eventSource.value && !logArray.value.length) {
                disconnect()
                status.value = 'TIMEDOUT'
            }
        }, 7 * 1000)
    }

    return {
        connect,
        logArray,
        status,
        error,
        disconnect,
        resetState,
    }
}
