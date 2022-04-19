import { isRef, Ref } from 'vue'
import { AsyncStateOptions } from '@vueuse/core'
import { IConfig } from 'swrv'
import { AxiosRequestConfig } from 'axios'
import { AxiosResponse } from 'axios'
import { axiosClient } from '~/modules/_axios'

export interface useOptions {
    options?: Ref<AxiosRequestConfig> | AxiosRequestConfig
    asyncOptions?: Ref<AsyncStateOptions> | AsyncStateOptions
    cacheKey?: Ref<any> | string
    cacheOptions?: Ref<IConfig> | IConfig
}

export type PathParams = Record<string, string>

export type APIFn = (arg0: PathParams) => string

export type HTTPVerb = 'GET' | 'POST' | 'DELETE' | 'PUT'

export interface baseAPIParams {
    params?: Record<string, any> | URLSearchParams
    body?: Ref<Record<string, any>> | Record<string, any>
    pathVariables?: Ref<Record<string, any>> | Record<string, any>
    options?: Ref<AxiosRequestConfig> | AxiosRequestConfig
}

export interface SWRVAPIParams extends baseAPIParams {
    immediate?: boolean
    options?: Ref<IConfig & AxiosRequestConfig> | (IConfig & AxiosRequestConfig)
}

export interface AsyncStateAPIParams<T> extends baseAPIParams {
    initialState?: T
}

export const getAPIPath = (serviceName: string, path = '') =>
    `${serviceName}${path}`

export const getURLWithParams = (url, params) => {
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
export const getAxiosClient = () => axiosClient

export const fetcher = <T>(
    url,
    params,
    options
): Promise<AxiosResponse<T>['data']> =>
    // replacing params:{...params} with params
    // params won't necessarily be a destructurable object ex- URLSearchParams - getting used in ~/components/admin/users/userPreview/accessLogs.vue
    getAxiosClient()?.get(url, { params, ...options })

export const fetcherPost = <T>(
    url,
    body,
    options
): Promise<AxiosResponse<T>['data']> => {
    return getAxiosClient().post(url, body, options)
}

export const updater = <T>(
    url,
    body,
    options
): Promise<AxiosResponse<T>['data']> => getAxiosClient().put(url, body, options)

export const deleter = <T>(url, options): Promise<AxiosResponse<T>['data']> =>
    getAxiosClient().delete(url, options)

export function resolveUrl(
    path: any,
    pathVariables?: Ref<Record<string, any>> | Record<string, any>
) {
    return path({
        ...(isRef(pathVariables) ? pathVariables.value : pathVariables),
    })
}
