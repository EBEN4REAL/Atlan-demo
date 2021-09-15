import { AxiosRequestConfig } from 'axios'
import { Ref } from 'vue'
import { IRequestActionBody, RequestAttributes } from '~/types/atlas/requests'
import { useAPIPromise, useAPIAsyncState } from '~/api/useAPI'
import { KeyMaps } from '~/api/keyMap'

export const getRequests = (params?: any, options?: AxiosRequestConfig) => {
    const { data, error, mutate, isLoading } = useAPIAsyncState<{
        records: RequestAttributes[]
    }>(KeyMaps.auth.requests.LIST_REQUESTS, 'GET', {
        options,
        params,
    })

    return { response: data, error, mutate, isLoading }
}

export const actOnRequest = (
    id: string,
    body: IRequestActionBody | Ref<IRequestActionBody>
) => {
    return useAPIPromise(KeyMaps.auth.requests.ACT_ON_REQUEST({ id }), 'POST', {
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
