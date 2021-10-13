import { Ref, ref, watch } from 'vue'
import axios, { AxiosRequestConfig, CancelTokenSource } from 'axios'
import { IConfig } from 'swrv'
import LocalStorageCache from 'swrv/dist/cache/adapters/localStorage'

// import { Search } from '~/api2/search'
import { Discovery } from '~/services/atlas/discovery'

export default function useIndexSearch(
    queryDSL: any,
    cacheSuffx?: string | '',
    isLocalStorage?: boolean,
    cancelTokenSource?: Ref<CancelTokenSource>,
    quickChange?: boolean
) {
    const asyncOptions: IConfig & AxiosRequestConfig = {
        dedupingInterval: 0,
        shouldRetryOnError: false,
        revalidateOnFocus: false,
        revalidateDebounce: 0,
    }
    if (isLocalStorage) {
        asyncOptions.cache = new LocalStorageCache()
    }
    if (cancelTokenSource) {
        asyncOptions.cancelToken = cancelTokenSource.value.token
    }
    const cachekey = ref(`index_search${cacheSuffx}`)

    const { data, mutate, error, isLoading, isValidating } =
        Discovery.IndexSearch(
            {
                body: {
                    query: JSON.stringify(queryDSL),
                },
                options: asyncOptions,
            },
            cachekey
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
        if (quickChange) {
            cachekey.value = `${cacheSuffx}_${Date.now().toString()}`
        } else {
            mutate()
        }
    }
    const asyncRefresh = () => {
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
        asyncRefresh,
    }
}
