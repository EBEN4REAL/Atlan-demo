import { AxiosRequestConfig } from 'axios'
import useSWRV, { IConfig } from 'swrv'
import { fetcher, fetcherPost, getAPIPath } from '~/api'
import { IRequestActionBody } from '~/types/atlas/requests'

const serviceAlias = 'auth'

export const getRequests = (
    params?: any,
    options?: AxiosRequestConfig,
    config?: IConfig
) => {
    const { data, mutate, error, isValidating } = useSWRV(
        [getAPIPath(serviceAlias, '/requests'), params, options],
        fetcher,
        config
    )
    return {
        response: data,
        error,
        mutate,
        isValidating,
    }
}

export const actOnRequest = (
    id: string,
    body: IRequestActionBody,
    options?: AxiosRequestConfig
) =>
    fetcherPost(
        getAPIPath(serviceAlias, `/requests/${id}/action`),
        body,
        options
    )

// getRequests()
// // useAPI get call with cache true,paramsObject,axios/swrv config options to get list of requests
// // returns  {data, error, isValidating, mutate}}
// actOnRequest()
// // useAPI with cache false to make this post call
// // returns {data: state,mutate,error,isReady, isLoading}

// deleteRequest()
// updateRequest()
