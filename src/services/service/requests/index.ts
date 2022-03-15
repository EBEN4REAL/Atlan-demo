import { AxiosRequestConfig } from 'axios'
import { Ref } from 'vue'
import { IRequestActionBody, RequestAttributes } from '~/types/atlas/requests'
import { useAPI } from '~/services/api/useAPI'
import { useAPIPromise } from '~/services/api/useAPIPromise'
import { map } from './key'

export const getRequests = (params?: any, options?: any) =>
    useAPI(map.LIST_REQUESTS, 'GET', { params }, options || {})

export const actOnRequest = (
    id: string,
    body: IRequestActionBody | Ref<IRequestActionBody>
) => {
    return useAPIPromise(map.ACT_ON_REQUEST({ id }), 'POST', {
        body,
    })
}
export const createBulkRequest = (body?: any, options?: any) =>
    useAPI(map.CREATE_REQUESTS_BULK, 'POST', { body }, options || {})
// getRequests()
// // useAPI get call with cache true,paramsObject,axios/swrv config options to get list of requests
// // returns  {data, error, isValidating, mutate}}
// actOnRequest()
// // useAPI with cache false to make this post call
// // returns {data: state,mutate,error,isReady, isLoading}

// deleteRequest()
// updateRequest()
