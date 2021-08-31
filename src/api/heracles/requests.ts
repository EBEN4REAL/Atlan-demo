import { AxiosRequestConfig } from 'axios'
import { IConfig } from 'swrv'
import { IRequestActionBody } from '~/types/atlas/requests'
import { useAPI } from '~/api/useAPI'
import { LIST_REQUESTS, ACT_ON_REQUEST } from '~/api/keyMaps/heracles/request'

export const getRequests = (
    params?: any,
    options?: IConfig & AxiosRequestConfig
) => {
    const { data, error, isLoading, mutate, isValidating } = useAPI(
        LIST_REQUESTS,
        'GET',
        {
            // TODO: Change it to a proper cache key later
            cache: false,
            options,
            params,
        }
    )
    return { response: data, error, isLoading, mutate, isValidating }
}

export const actOnRequest = (
    id: string,
    body: IRequestActionBody,
    options?: IConfig & AxiosRequestConfig
) => {
    const { data, error, isLoading, mutate } = useAPI(ACT_ON_REQUEST, 'POST', {
        cache: false,
        pathVariables: { id },
        options,
        body,
    })
    return { response: data, error, isLoading, mutate }
}

// getRequests()
// // useAPI get call with cache true,paramsObject,axios/swrv config options to get list of requests
// // returns  {data, error, isValidating, mutate}}
// actOnRequest()
// // useAPI with cache false to make this post call
// // returns {data: state,mutate,error,isReady, isLoading}

// deleteRequest()
// updateRequest()
