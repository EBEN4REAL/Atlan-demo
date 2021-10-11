import { AxiosRequestConfig } from 'axios'
import useSWRV, { IConfig } from 'swrv'
import { reactive, ref, Ref, toRef, toRefs } from 'vue'
import { Components } from './client'
import { fetcherPost, getAPIPath, getAxiosClient } from '~/api'
import { SearchParameters } from '~/types/atlas/attributes'

const serviceAlias = 'meta'

const Basic = (body?: SearchParameters, options?: AxiosRequestConfig) =>
    getAxiosClient().post(
        getAPIPath(serviceAlias, '/search/basic'),
        body,
        options
    )

const BasicSearch = (
    body?: Components.Schemas.SearchParameters,
    options?: AxiosRequestConfig,
    config?: IConfig,
    skip = true
) => {
    const { data, error, mutate, isValidating } = useSWRV(
        skip
            ? [getAPIPath(serviceAlias, '/search/basic'), body, options, skip]
            : null,
        fetcherPost,
        config
    )
    const response = data as Ref<Components.Schemas.AtlasSearchResult>
    return {
        response,
        error,
        mutate,
        isValidating,
    }
}

export const Search = {
    Basic,
    BasicSearch,
}
function useSwrvState(
    data: Ref<any>,
    error: Ref<any>,
    isValidating: Ref<boolean>
): { state: any; STATES: any } {
    throw new Error('Function not implemented.')
}
