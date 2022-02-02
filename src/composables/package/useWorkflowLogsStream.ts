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

    const eventSource = ref(null)

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
        })

        eventSource.value = new EventSourcePolyfill(URL, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            method: 'GET',
            withCredentials: true,
            heartbeatTimeout,
        })

        eventSource.value.addEventListener(
            'message',
            (e) => {
                console.log('message', e.data, e.id)
            },
            false
        )

        eventSource.value.addEventListener(
            'open',
            (e) => {
                console.log('open', error)
                // Connection was opened.
            },
            false
        )

        eventSource.value.addEventListener(
            'error',
            (e) => {
                console.log(e)
                if (e.readyState === EventSource.CLOSED) {
                    // Connection was closed.
                }
            },
            false
        )
    }

    const handleMessage = (message, lastEventId) => {
        if (!message) {
            console.log('empty message')
        }
        console.log('new message')
        console.log(message)
        // logArray.value.push(message?.result?.content)
    }

    const connect = () => {
        // status.value = 'CONNECTING'
        // if (sseClient.value) {
        //     sseClient.value.disconnect()
        // }
        // sseClient.value.on('error', (e) => {
        //     error.value = e
        //     console.error('lost connection or failed to parse!', e)
        //     status.value = 'DISCONNECTED'
        //     // If this error is due to an unexpected disconnection, EventSource will
        //     // automatically attempt to reconnect indefinitely. You will _not_ need to
        //     // re-add your handlers.
        // })
        // sseClient.value.on('message', (m) => {
        //     console.log(m)
        // })
        // sseClient.value
        //     .connect()
        //     .then((sse) => {
        //         status.value = 'CONNECTED'
        //         console.log("We're connected!")
        //         // sseClient.value.disconnect()
        //         // Unsubscribes from event-less messages after 7 seconds
        //         setTimeout(() => {
        //             sseClient.value.off('message', handleMessage)
        //             sseClient.value.disconnect()
        //             status.value = 'DISCONNECTED'
        //             console.log('Stopped listening to event-less messages!')
        //         }, 7000)
        //     })
        //     .catch((err) => {
        //         sseClient.value.disconnect()
        //         // When this error is caught, it means the initial connection to the
        //         // events server failed.  No automatic attempts to reconnect will be made.
        //         console.error('Failed to connect to server', err)
        //     })
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
    }
}
