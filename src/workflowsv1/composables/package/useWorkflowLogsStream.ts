import { ref, inject, toRaw, Ref, watch, isRef, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import { EventSourcePolyfill } from 'event-source-polyfill'
import { resolveUrl, useSSE } from '~/modules/useSSE'
import { APIFn } from '~/services/api/common'
import { map } from '~/services/service/workflows/key'
import { generateQueryStringParamsFromObj } from '~/utils/queryString'

export function resolveUrl(
    path: APIFn,
    pathVariables?: Ref<Record<string, any>> | Record<string, any>
) {
    return path({
        ...(isRef(pathVariables) ? pathVariables.value : pathVariables),
    })
}

export default function useWorkflowLogsStream() {
    const app = getCurrentInstance()

    const keycloak = app?.appContext.config.globalProperties.$keycloak
    const { token } = keycloak
    const sse = app?.appContext.config.globalProperties.$sse

    // const params = { podName: podId }

    const eventClient = ref(null)

    const heartbeatTimeout = 10 * 60 * 1000

    const logArray = ref([])

    const status = ref('')
    const error = ref()

    const initClient = (id, podName) => {
        const search_prms = generateQueryStringParamsFromObj({
            podName,
        })
        const URL: any = resolveUrl(map.ARCHIVED_WORKFLOW_RUN_LOGS, {
            id,
            params: search_prms,
        })

        eventClient.value = sse.create({
            url: URL,
            format: 'json',
            withCredentials: true,
            polyfill: true,
            forcePolyfill: true,
            polyfillOptions: {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                method: 'GET',
                heartbeatTimeout,
            },
        })
    }

    const handleMessage = (message, lastEventId) => {
        if (lastEventId === '-1') {
            status.value = 'COMPLETED'
            eventClient?.value?.disconnect()
            eventClient.value = null
        } else {
            logArray.value.push({
                id: Date.now().toString(),
                text: message?.result?.content,
            })
        }
    }

    const disconnect = () => {
        if (eventClient.value) {
            eventClient.value.disconnect()
            eventClient.value = null
        }
    }

    const connect = () => {
        status.value = 'CONNECTING'
        if (eventClient.value) {
            eventClient.value.disconnect()
        }
        eventClient.value.on('error', (e) => {
            console.log('error')
            error.value = e
            status.value = 'DISCONNECTED'
            // If this error is due to an unexpected disconnection, EventSource will
            // automatically attempt to reconnect indefinitely. You will _not_ need to
            // re-add your handlers.
        })

        eventClient.value.on('message', handleMessage)

        eventClient.value
            .connect()
            .then((sse) => {
                status.value = 'CONNECTED'
                // Disconect if no logs fetched after 7 seconds
                setTimeout(() => {
                    if (sse && !logArray.value.length) {
                        sse.off('message', handleMessage)
                        sse.disconnect()
                        status.value = 'TIMEDOUT'
                    }
                }, 7 * 1000)
            })
            .catch((err) => {
                console.log('error')
                eventClient?.value?.disconnect()
                // When this error is caught, it means the initial connection to the
                // events server failed.  No automatic attempts to reconnect will be made.
                console.error('Failed to connect to server', err)
            })
    }

    // let reqHeaders: { [index: string]: string } = {}

    // reqHeaders = {
    //     Authorization: `Bearer ${token}`,
    // }

    // const params = { podName: podId }
    // const search_prms = generateQueryStringParamsFromObj(params)

    // const pathVariables = {
    //     params: search_prms,
    //     id: runId,
    // }
    // const URL: any = resolveUrl(map.ARCHIVED_WORKFLOW_RUN_LOGS, pathVariables)

    // const eventSource = ref()
    // eventSource.value = new EventSourcePolyfill(URL, {
    //     headers: reqHeaders,
    //     method: 'GET',
    //     withCredentials: true,
    //     heartbeatTimeout,
    // })

    // const error = ref()

    // eventSource.value.onerror = (e) => {
    //     eventSource.value.close()
    //     error.value = e
    // }

    // eventSource.value.onmessage = (e) => {
    //     console.log(e)
    // }

    // // subscribe(event: any, handler) {

    // // },

    // // // Catch any errors (ie. lost connections, etc.)
    // // sseClient.on('error', (e) => {
    // //     console.error('lost connection or failed to parse!', e)

    // //     // If this error is due to an unexpected disconnection, EventSource will
    // //     // automatically attempt to reconnect indefinitely. You will _not_ need to
    // //     // re-add your handlers.
    // // })

    return {
        initClient,
        connect,
        handleMessage,
        logArray,
        status,
        error,
        disconnect,
    }
}
