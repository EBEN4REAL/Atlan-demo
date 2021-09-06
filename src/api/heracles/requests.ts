import { AxiosRequestConfig } from 'axios'
import { Ref, isRef } from 'vue'
import { IConfig } from 'swrv'
import { AsyncStateOptions } from '@vueuse/core'
import { IRequestActionBody, RequestAttributes } from '~/types/atlas/requests'
import { useAPI, useAPIPromise } from '~/api/useAPI'
import { LIST_REQUESTS, ACT_ON_REQUEST } from '~/api/keyMaps/heracles/request'

export const getRequests = (
    params?: any,
    options?: IConfig & AxiosRequestConfig
) => {
    const { data, error, mutate, isLoading } = useAPI<{
        records: RequestAttributes[]
    }>(LIST_REQUESTS, 'GET', {
        // TODO: Change it to a proper cache key later
        cache: 'req' + JSON.stringify(isRef(params) ? params.value : params),
        options,
        params,
    })

    return { response: data, error, mutate, isLoading }
}

export const actOnRequest = (
    id: string,
    body: IRequestActionBody | Ref<IRequestActionBody>
) => {
    return useAPIPromise(ACT_ON_REQUEST, 'POST', {
        pathVariables: { id },
        body,
    })
}

// getRequests()
// // useAPI get call with cache true,paramsObject,axios/swrv config options to get list of requests
// // returns  {data, error, isValidating, mutate}}
// actOnRequest()
// // useAPI with cache false to make this post call
// // returns {data: state,mutate,error,isReady, isLoading}

// deleteRequest()
// updateRequest()
