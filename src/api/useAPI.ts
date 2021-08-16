import { Ref, ref, watch, watchEffect } from 'vue'
import { AxiosRequestConfig } from 'axios'
import useSWRV, { IConfig } from 'swrv'

import { AsyncStateOptions, useAsyncState } from '@vueuse/core'
import { fetcher, fetcherPost, getAxiosClient, deleter, updater } from '~/api'
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

/** *
 * @param key - Used as an identifier for the cache when making requests with SWRV
 * @param method - The HTTP reqeust method to use
 * @param param - The query params to send while making a `GET` request
 * @param body - The payload to send while making a `POST` request
 * @param options - SWRV or Axios specefic configuration objects
 */
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
    const url = ref(
        keyMaps[key]({
            ...(isRef(pathVariables) ? pathVariables.value : pathVariables),
        })
    )

    watchEffect(
        () => {
            if (isRef(pathVariables))
                url.value = keyMaps[key]({ ...pathVariables?.value })
        },
        {
            flush: 'sync',
        }
    )

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
            () => {
                // Choose the fetcher function based on the method type
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
                        return deleter(
                            url.value,
                            isRef(options) ? options.value : options
                        )
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
            },
            isRef(options) ? options.value : options
        )

        const isLoading = ref(!data.value && !error.value)
        return { data, error, isLoading, mutate, isValidating }
    }
    function getRequest(): any {
        switch (method) {
            case 'POST':
                return getAxiosClient().post<T>(
                    url.value,
                    isRef(body) ? body.value : body,
                    {
                        params,
                        ...(isRef(options) ? options.value : options),
                    }
                )
            case 'DELETE':
                return getAxiosClient().delete<T>(url.value, {
                    ...(isRef(options) ? options.value : options),
                })
            case 'PUT':
                return getAxiosClient().put<T>(
                    url.value,
                    isRef(body) ? body.value : body,
                    {
                        params,
                        ...(isRef(options) ? options.value : options),
                    }
                )
            default:
                return getAxiosClient().get<T>(url.value, {
                    params,
                    ...(isRef(options) ? options.value : options),
                })
        }
    }
    const isLoading = ref(true)
    const { state, execute, isReady, error } = useAsyncState<T>(
        () => getRequest(),
        <T>{},
        {
            immediate: (isRef(options) ? options.value : options)?.immediate,
        }
    )

    watch([state, error], () => {
        if (state || error) isLoading.value = false
    })

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
