/* eslint-disable import/prefer-default-export */
import { isRef, Ref } from 'vue'

import { AxiosResponse, AxiosRequestConfig, Method } from 'axios'
import { axiosClient } from '~/modules/_axios'
import { getURLWithParams } from './common'

interface baseAPIRequest {
    params?: Record<string, any> | URLSearchParams
    body?: Ref<Record<string, any>> | Record<string, any>
    options?: Ref<AxiosRequestConfig> | AxiosRequestConfig
}

const fetcher = <T>(url, params, options): Promise<AxiosResponse<T>['data']> =>
    axiosClient.get(url, { params, ...options })

const fetcherPost = <T>(
    url,
    body,
    options
): Promise<AxiosResponse<T>['data']> => axiosClient.post(url, body, options)

const updater = <T>(url, body, options): Promise<AxiosResponse<T>['data']> =>
    axiosClient.put(url, body, options)

const deleter = <T>(url, options): Promise<AxiosResponse<T>['data']> =>
    axiosClient.delete(url, options)

export function useAPIPromise<T>(
    url: string,
    method: Method,
    { params, body, options }: baseAPIRequest
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
                getURLWithParams(url, params),
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
