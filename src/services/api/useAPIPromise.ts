/* eslint-disable import/prefer-default-export */
import { isRef, Ref } from 'vue'
import { Method } from 'axios'
import { getURLWithParams } from './common'

import {
    fetcher,
    fetcherPost,
    updater,
    deleter,
    baseAPIParams,
} from '~/services/api/common'

export function useAPIPromise<T>(
    url: string,
    method: Method,
    { params, body, options }: baseAPIParams
): Promise<T> {
    switch (method) {
        case 'GET':
            console.log(isRef(params))
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
