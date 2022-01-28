import { isRef, Ref, ref, computed } from 'vue'
import { EventSourcePolyfill } from 'event-source-polyfill'
import { useAsyncState } from '@vueuse/core'
import { UserModule } from '~/types'
import { APIFn } from '~/services/api/common'

// it should run atleast 10mins
const heartbeatTimeout = 10 * 60 * 1000

interface useSSEParams {
    path: APIFn
    includeAuthHeader: boolean
    pathVariables?: Record<string, any>
    headers?: { [index: string]: string }
    config?: {
        withCredentials?: boolean
        format?: string
        [index: string]: any
    }
    body: Object
}

interface useSSEReturnObj {
    getSource: Function | null
    close: Function | null
    onError: ((handler: (e?: any) => void) => any) | null
    subscribe:
        | ((event: any, handler: (message?: any, e?: any) => void) => any)
        | null
    unsubscribe: ((event: any) => void) | null
}

interface eventSrcObj {
    close: Function
    url: any
    withCredentials: boolean
    readyState: number
    onopen: (handler: () => void) => void
    onmessage: ((handler: (e?: any) => void) => void) | null
    onerror: ((handler: (e?: any) => void) => void) | null
    addEventListener: (event: any, listener: (e?: any) => void) => void
    removeEventListener: (event: any, listener: (e?: any) => void) => void
}

let appInstance: any

export const install: UserModule = ({ app }) => {
    appInstance = app
}

const FORMATS = {
    PLAIN: 'PLAIN',
    JSON: 'JSON',
}

export function resolveUrl(
    path: APIFn,
    pathVariables?: Ref<Record<string, any>> | Record<string, any>
) {
    return path({
        ...(isRef(pathVariables) ? pathVariables.value : pathVariables),
    })
}

function formatters(formatKey: string, e: any) {
    switch (formatKey) {
        case FORMATS.PLAIN: {
            return e.data
        }
        case FORMATS.JSON: {
            return JSON.parse(e.data)
        }
    }
}

/** *
 * @param path - Path fxn from keyMaps
 * @param includeAuthHeader - Boolean to include the authroization header or not
 * @param config - config object
 * @param headers - Standard req headers to send while making a request
 * @param pathVariables - The path variables used in URL while making a `GET` request
 */

export function useSSE({
    path,
    includeAuthHeader,
    config,
    headers = {},
    pathVariables = {},
    body = {},
}: useSSEParams): any {
    const keycloack = appInstance.config.globalProperties.$keycloak
    const { token } = keycloack
    const intialState = {
        getSource: null,
        onError: null,
        subscribe: null,
        unsubscribe: null,
        close: null,
    }
    const eventSource: Ref<eventSrcObj> = ref()
    const error = ref()

    // supports only standard headers like Authorization etc.
    let reqHeaders: { [index: string]: string } = {
        ...headers,
    }

    const cfg = {
        withCredentials: false,
        format: 'JSON',
        ...config,
    }

    if (includeAuthHeader) {
        reqHeaders = {
            ...headers,
            Authorization: `Bearer ${token}`,
        }
    }

    // setTimeout(() => {
    //     // eventSource.value.close()
    //     console.log('closed', eventSource)
    // }, heartbeatTimeout)

    const URL: any = resolveUrl(path, pathVariables)

    const promise = new Promise<useSSEReturnObj>((resolve, reject) => {
        eventSource.value = new EventSourcePolyfill(URL, {
            headers: reqHeaders,
            method: 'POST',
            withCredentials: cfg.withCredentials,
            heartbeatTimeout: heartbeatTimeout,
            body,
        })
        // setInterval(() => {

        // }, 4000)

        eventSource.value.onerror = (e) => {
            eventSource.value.close()
            console.log(e)
            error.value = e
            reject(e)
        }
        eventSource.value.onopen = () => {
            const subscribers: {
                [index: string]: Array<(e?: any) => any>
            } = {}
            resolve({
                getSource(): eventSrcObj {
                    return eventSource
                },

                onError(handler) {
                    eventSource.value.close()
                    eventSource.value.onerror = handler
                    return this
                },

                subscribe(event: any, handler) {
                    const listener = (e: any) => {
                        let data
                        try {
                            if (cfg.format) data = formatters(cfg.format, e)
                        } catch (err) {
                            if (
                                typeof eventSource.value.onerror === 'function'
                            ) {
                                console.log('subscribe error')
                            }
                        }
                        handler(data, e)
                    }

                    if (!subscribers[event]) {
                        subscribers[event] = []
                    }
                    subscribers[event].push(listener)

                    if (event === '') {
                        // Catches messages without any event specified
                        eventSource.value.onmessage = listener
                    } else {
                        eventSource.value.addEventListener(event, listener)
                    }
                    return this
                },

                unsubscribe(event) {
                    if (event === '') {
                        eventSource.value.onmessage = null
                        return this
                    }
                    // Check if there are any subscribers for this event
                    if (!subscribers[event]) {
                        return this
                    }
                    subscribers[event].forEach((listener) => {
                        eventSource.value.removeEventListener(event, listener)
                    })
                    subscribers[event] = []
                    return this
                },

                close() {
                    eventSource.value.close()
                    // Make sure listeners are cleared (nobody likes mem leaks, right?)
                    Object.keys(subscribers).forEach((event) => {
                        subscribers[event] = []
                    })
                },
            })
        }
    })
    // Variable to check if the promise has been executed atleast once
    let isExecuted = ref(false)

    const { state, isReady } = useAsyncState(() => {
        isExecuted.value = true
        return promise
    }, intialState)
    const isLoading = computed(
        () => isExecuted.value && !isReady.value && !error.value
    )

    return {
        eventSource,
        data: state,
        isLoading: isLoading,
        error,
    }
}
