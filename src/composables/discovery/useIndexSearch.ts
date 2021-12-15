import { Ref, ref, computed } from 'vue'

import LocalStorageCache from 'swrv/dist/cache/adapters/localStorage'

import axios from 'axios'

import { Search } from '~/services/meta/search'
import { useOptions } from '~/services/api/common'

export default function useIndexSearch<T>(
    body: Record<string, any> | Ref<Record<string, any>>,
    dependentKey?: Ref<any>,
    isCache?: boolean,
    isLocal?: boolean | true,
    ttl?: Number | 0
) {
    const options: useOptions = {}

    let cancel = axios.CancelToken.source()
    options.options = ref({
        cancelToken: cancel.token,
    })

    if (!isCache) {
        if (dependentKey) {
            if (!dependentKey.value) {
                options.asyncOptions = ref({
                    immediate: false,
                })
            }
        } else {
            options.asyncOptions = ref({
                immediate: true,
            })
        }
    } else {
        options.cacheOptions = ref({
            dedupingInterval: 0,
            shouldRetryOnError: false,
            revalidateOnFocus: false,
            ttl,
            revalidateDebounce: 0,
        })
        if (isLocal) {
            options.cacheOptions.cache = new LocalStorageCache()
        }

        console.log(dependentKey)
        options.cacheKey = dependentKey
    }

    const { data, mutate, error, isLoading, isValidating, isReady } =
        Search.IndexSearch<T>(body, options)

    const approximateCount = computed(() => {
        if (data?.value?.approximateCount) {
            return data.value?.approximateCount
        }
        return 0
    })

    const aggregationMap = (key, isNested?) => {
        if (data?.value?.aggregations) {
            if (data?.value?.aggregations[key]) {
                if (isNested) {
                    return data?.value?.aggregations[key]?.nested_group?.buckets
                } else {
                    return data?.value?.aggregations[key].buckets
                }
            }
        }
        return []
    }
    const getMap = (buckets) => {
        const map = {}
        buckets.forEach((bucket) => {
            map[bucket.key] = bucket.doc_count
        })
        return map
    }

    const cancelRequest = () => {
        if (cancel) {
            cancel.cancel('operation cancelled')
        }
        cancel = axios.CancelToken.source()
        options.options.value = {
            cancelToken: cancel.token,
        }
    }

    const refresh = () => {
        cancelRequest()
        mutate()
    }

    return {
        data,
        options,
        cancel,
        approximateCount,
        aggregationMap,
        mutate,
        refresh,
        isReady,
        error,
        isLoading,
        isValidating,
        getMap,
        cancelRequest,
    }
}
