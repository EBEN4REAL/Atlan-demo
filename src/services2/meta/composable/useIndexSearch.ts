import { Ref, ref } from 'vue'

import LocalStorageCache from 'swrv/dist/cache/adapters/localStorage'

// import { Search } from '~/api2/search'
import { Discovery } from '~/services2/meta/discovery'
import { useOptions } from '~/services2/api/common'

export default function useIndexSearch(
    body?: any | {},
    dependentKey?: Ref<any>,
    token?: any,
    isCache?: boolean
) {
    const options: useOptions = {}

    if (token) {
        options.options = ref({
            cancelToken: token.value,
        })
    }

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

    return {
        data,
        mutate,
        error,
        isLoading,
        isValidating,
    }
}
