import { AxiosRequestConfig } from 'axios'
import { Ref } from 'vue'
import { IRequestActionBody, RequestAttributes } from '~/types/atlas/requests'
import { useAPIPromise, useAPIAsyncState } from '~/services/api/useAPI'
import { heracles_keymap } from '../heracles_keymap'

export const getRequests = (params?: any, options?: AxiosRequestConfig) => {
    const { data, error, mutate, isLoading } = useAPIAsyncState<{
        records: RequestAttributes[]
    }>(heracles_keymap.requests.LIST_REQUESTS, 'GET', {
        options,
        params,
    })

    return { response: data, error, mutate, isLoading }
}

export const actOnRequest = (
    id: string,
    body: IRequestActionBody | Ref<IRequestActionBody>
) => {
    return useAPIPromise(heracles_keymap.requests.ACT_ON_REQUEST({ id }), 'POST', {
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
