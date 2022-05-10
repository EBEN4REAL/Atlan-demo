import { Ref, ref, watch } from 'vue'
import axios, { AxiosRequestConfig, CancelTokenSource } from 'axios'
import { IConfig } from 'swrv'

// import { Search } from '~/api2/search'
// import { IndexSearch } from '~/services/meta/search'

import { Search } from '~/services/meta/search'

export default function useIndexSearch(
    queryDSL: Ref<any>,
    cancelTokenSource?: Ref<CancelTokenSource>
) {
    const asyncOptions: IConfig & AxiosRequestConfig = {
        dedupingInterval: 0,
        shouldRetryOnError: false,
        revalidateOnFocus: false,
        revalidateDebounce: 0,
    }

    // if (cancelTokenSource) {
    //     asyncOptions.cancelToken = cancelTokenSource.value.token
    // }

    const { data, mutate, error, isLoading, isValidating } = Search.IndexSearch(
        queryDSL,
        { asyncOptions }
    )
    const entities = ref([])

    const aggregations = ref({})

    watch(data, () => {
        if (data.value?.aggregations) {
            aggregations.value = data.value?.aggregations
        }
        if (data.value?.entities) {
            entities.value = data.value?.entities
        }
    })

    const refresh = () => {
        if (cancelTokenSource) {
            if (isValidating?.value && cancelTokenSource.value) {
                cancelTokenSource?.value.cancel('aborted')
            }
            cancelTokenSource.value = axios.CancelToken.source()
            asyncOptions.cancelToken = cancelTokenSource?.value.token
        }
        return mutate()
    }

    return {
        data,
        aggregations,
        entities,
        isLoading,
        error,
        isValidating,
        refresh,
        mutate,
    }
}
