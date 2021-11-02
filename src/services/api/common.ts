import { isRef, Ref } from 'vue'
import { AsyncStateOptions } from '@vueuse/core'
import { IConfig } from 'swrv'
import { AxiosRequestConfig } from 'axios'

export type PathParams = Record<string, string>

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

export function resolveUrl(
    path: any,
    pathVariables?: Ref<Record<string, any>> | Record<string, any>
) {
    return path({
        ...(isRef(pathVariables) ? pathVariables.value : pathVariables),
    })
}

export interface useOptions {
    options?: Ref<AxiosRequestConfig> | AxiosRequestConfig
    asyncOptions?: Ref<AsyncStateOptions> | AsyncStateOptions
    cacheKey?: Ref<any> | string
    cacheOptions?: Ref<IConfig> | IConfig
}
