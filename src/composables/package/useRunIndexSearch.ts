import { Ref, ref, computed, watch } from 'vue'

import LocalStorageCache from 'swrv/dist/cache/adapters/localStorage'

import axios from 'axios'

import { Search } from '~/services/meta/search'
import { useOptions } from '~/services/api/common'
import { Workflows } from '~/services/service/workflows'

export default function useRunIndexSearch(
    body: Record<string, any> | Ref<Record<string, any>>,
    dependentKey?: Ref<any>,
    isCache?: boolean,
    isLocal?: boolean | true,
    ttl?: Number | 0,
    refreshInterval?: Number | 0
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
            refreshInterval,
            ttl,
            revalidateDebounce: 0,
        })
        if (isLocal) {
            options.cacheOptions.cache = new LocalStorageCache()
        }
        options.cacheKey = dependentKey
    }

    const { data, mutate, error, isLoading, isValidating, isReady } =
        Workflows.worfklowRunIndex({}, body, options)

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
        mutate,
        refresh,
        isReady,
        error,
        isLoading,
        isValidating,

        cancelRequest,
    }
}
