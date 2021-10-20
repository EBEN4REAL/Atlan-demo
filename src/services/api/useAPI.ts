import { Ref, computed, ref } from 'vue'
import { AxiosRequestConfig } from 'axios'
import useSWRV, { IConfig } from 'swrv'

import { AsyncStateOptions, useAsyncState } from '@vueuse/core'
import { fetcher, fetcherPost, deleter, updater, APIFn } from '~/api'
import keyMaps from '~/api/keyMaps/index'

interface useGetAPIParams {
    cache?: string | boolean
    params?: Record<string, any> | URLSearchParams
    body?: Ref<Record<string, any>> | Record<string, any>
    pathVariables?: Ref<Record<string, any>> | Record<string, any>
    options?:
        | Ref<IConfig & AxiosRequestConfig & AsyncStateOptions>
        | (IConfig & AxiosRequestConfig & AsyncStateOptions)
    dependantFetchingKey?: Ref
    // swrOptions?: IConfig,
    // axiosOptions?: AxiosRequestConfig
}

function useAPIPromiseOld(
    key: string,
    method: 'GET' | 'POST' | 'DELETE' | 'PUT',
    { params, body, pathVariables, options }: useGetAPIParams
) {
    const url = computed(() =>
        keyMaps[key]({
            ...(isRef(pathVariables) ? pathVariables.value : pathVariables),
        })
    )

    switch (method) {
        case 'GET':
            return fetcher(
                url.value,
                params,
                isRef(options) ? options.value : options
            )
        case 'POST':
            return fetcherPost(
                url.value,
                isRef(body) ? body.value : body,
                isRef(options) ? options.value : options
            )
        case 'DELETE':
            return deleter(url.value, isRef(options) ? options.value : options)
        case 'PUT':
            return updater(
                url.value,
                isRef(body) ? body.value : body,
                isRef(options) ? options.value : options
            )
        default:
            return fetcher(
                url.value,
                params,
                isRef(options) ? options.value : options
            )
    }
}

/** *
 * @param key - Used as an identifier for the cache when making requests with SWRV
 * @param method - The HTTP reqeust method to use
 * @param param - The query params to send while making a `GET` request
 * @param body - The payload to send while making a `POST` request
 * @param options - SWRV or Axios specefic configuration objects
 */
// eslint-disable-next-line import/prefer-default-export
export const useAPI = <T>(
    key: string,
    method: 'GET' | 'POST' | 'DELETE' | 'PUT',
    {
        cache = '',
        params,
        body,
        pathVariables,
        options,
        dependantFetchingKey,
    }: useGetAPIParams
) => {
    if (cache) {
        // If using cache, make a generic swrv request
        const getKey = () => {
            if (dependantFetchingKey) {
                return dependantFetchingKey.value ? `${key}_${cache}` : null
            }
            return `${key}_${cache}`
        }
        const { data, error, mutate, isValidating } = useSWRV<T>(
            getKey,
            () =>
                useAPIPromiseOld(key, method, {
                    params: isRef(params) ? params.value : params,
                    body,
                    pathVariables,
                    options,
                }),
            isRef(options) ? options.value : options
        )

        const isLoading = computed(() => !data.value && !error.value)
        return { data, error, isLoading, mutate, isValidating }
    }
    // else return useAsyncState wrapped request
    const { state, execute, isReady, error } = useAsyncState<T>(
        () =>
            useAPIPromiseOld(key, method, {
                params: isRef(params) ? params.value : params,
                body,
                pathVariables,
                options,
            }),
        <T>{},
        {
            immediate: (isRef(options) ? options.value : options)?.immediate,
        }
    )
    const isLoading = computed(() => !isReady.value)

    return {
        data: state,
        mutate: execute,
        error,
        isReady,
        isLoading,
    }
}

function isRef(arg: any): arg is Ref {
    return arg && arg.value && typeof arg.value === 'object'
}

// #####################################################################
// ##################     New useAPI    ################################
// #####################################################################
type HTTPVerb = 'GET' | 'POST' | 'DELETE' | 'PUT'

interface baseAPIParams {
    params?: Record<string, any> | URLSearchParams
    body?: Ref<Record<string, any>> | Record<string, any>
    pathVariables?: Ref<Record<string, any>> | Record<string, any>
    options?: Ref<AxiosRequestConfig> | AxiosRequestConfig
}

interface SWRVAPIParams extends baseAPIParams {
    immediate?: boolean
    options?: Ref<IConfig & AxiosRequestConfig> | (IConfig & AxiosRequestConfig)
}

interface AsyncStateAPIParams<T> extends baseAPIParams {
    initialState?: T
}

export function resolveUrl(
    path: APIFn,
    pathVariables?: Ref<Record<string, any>> | Record<string, any>
) {
    return path({
        ...(isRef(pathVariables) ? pathVariables.value : pathVariables),
    })
}

const getUrlWithParams = (url, params) => {
    console.log('getUrlWithParams')
    let p = isRef(params) ? params.value : params
    if (!p) return url
    const temp = {}
    Object.entries(p).forEach(([k, v]) => {
        let newv = v
        if (typeof v === 'object') {
            newv = JSON.stringify(v)
        }
        temp[k] = newv
    })
    p = new URLSearchParams(temp)
    return p.toString() ? `${url}?${p.toString()}` : url
}

export function useAPIPromise<T>(
    url: string,
    method: HTTPVerb,
    { params, body, options }: baseAPIParams
): Promise<T> {
    switch (method) {
        case 'GET':
            return fetcher<T>(
                url,
                isRef(params) ? params.value : params,
                isRef(options) ? options.value : options
            )
        case 'POST':
            return fetcherPost<T>(
                getUrlWithParams(url, params),
                isRef(body) ? body.value : body,
                isRef(options) ? options.value : options
            )
        case 'DELETE':
            return deleter<T>(url, isRef(options) ? options.value : options)
        case 'PUT':
            return updater<T>(
                url,
                isRef(body) ? body.value : body,
                isRef(options) ? options.value : options
            )
        default:
            return fetcher<T>(
                url,
                isRef(params) ? params.value : params,
                isRef(options) ? options.value : options
            )
    }
}

export const useAPISWRV = <T>(
    path: APIFn,
    method: HTTPVerb,
    cacheKey: Ref<string> | string,
    { params, body, pathVariables, options, immediate = true }: SWRVAPIParams
) => {
    const url = computed(() => resolveUrl(path, pathVariables))

    const getKey = computed(() =>
        immediate ? (isRef(cacheKey) ? cacheKey.value : cacheKey) : null
    )

    const { data, error, mutate, isValidating } = useSWRV<T>(
        getKey.value,
        () =>
            useAPIPromise(url.value, method, {
                params,
                body,
                options,
            }),
        isRef(options) ? options.value : options
    )

    const isLoading = computed(() => !data.value && !error.value)
    return { data, error, isLoading, mutate, isValidating }
}

export const useAPIAsyncState = <T>(
    path: APIFn,
    method: HTTPVerb,
    {
        params,
        body,
        pathVariables,
        options,
        initialState = <T>{},
    }: AsyncStateAPIParams<T>,
    asyncOpts?: AsyncStateOptions
) => {
    // Variable to check if the promise has been executed atleast once
    let isExecuted = ref(false)

    const url = computed(() => resolveUrl(path, pathVariables))

    const { state, execute, isReady, error } = useAsyncState<T>(
        () => {
            isExecuted.value = true
            return useAPIPromise(url.value, method, {
                params,
                body,
                options,
            })
        },
        initialState,
        asyncOpts
    )

    const isLoading = computed(
        () => isExecuted.value && !isReady.value && !error.value
    )

    return {
        data: state,
        mutate: execute,
        error,
        isReady,
        isLoading,
    }
}
