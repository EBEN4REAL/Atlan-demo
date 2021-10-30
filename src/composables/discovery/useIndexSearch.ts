import { Ref, ref, computed } from 'vue'

import LocalStorageCache from 'swrv/dist/cache/adapters/localStorage'

import axios from 'axios'

import { Discovery } from '~/services/meta/discovery'
import { useOptions } from '~/services/api/common'

export default function useIndexSearch(
    body: Record<string, any> | Ref<Record<string, any>>,
    dependentKey?: Ref<any>,
    isCache?: boolean
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
            ttl: 0,
            revalidateDebounce: 0,
            cache: new LocalStorageCache(),
        })
        options.cacheKey = dependentKey
    }

    const { data, mutate, error, isLoading, isValidating } =
        Discovery.IndexSearch(body, options)

    const approximateCount = computed(() => {
        if (data?.value.approximateCount) {
            return data.value?.approximateCount
        }
        return 0
    })

    const aggregationMap = (key) => {
        if (data?.value?.aggregations) {
            if (data?.value?.aggregations[key]) {
                return data?.value?.aggregations[key].buckets
            }
        }
        return []
    }

    const refresh = () => {
        // TODO - Cancellation doesnt work with useSWRV
        if (!isCache) {
            if (cancel) {
                cancel.cancel('operation cancelled')
            }
            cancel = axios.CancelToken.source()
            options.options.value = {
                cancelToken: cancel.token,
            }
        }
        mutate()
    }

    return {
        data,
        approximateCount,
        aggregationMap,
        mutate,
        refresh,
        error,
        isLoading,
        isValidating,
        cancel,
    }
}
