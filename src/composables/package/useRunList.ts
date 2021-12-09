import axios from 'axios'
import { Ref, ref } from 'vue'

import { useOptions } from '~/services/api/common'
import { Runs } from '~/services/service/runs'

export function useRunList(
    params: Record<string, any> | Ref<Record<string, any>>,
    dependentKey?: Ref<any>,
    refreshInterval?: Number | 0
) {
    const options: useOptions = {}

    let cancel = axios.CancelToken.source()
    options.options = ref({
        cancelToken: cancel.token,
    })
    options.cacheOptions = ref({
        dedupingInterval: 0,
        shouldRetryOnError: false,
        revalidateOnFocus: false,
        ttl: 1,
        refreshInterval,
        revalidateDebounce: 0,
    })
    options.cacheKey = dependentKey

    console.log(dependentKey)

    const { data, error, isLoading, mutate } = Runs.getLiveRuns({
        params,
        options,
    })

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
        mutate,
        refresh,
        isLoading,
        error,
    }
}
