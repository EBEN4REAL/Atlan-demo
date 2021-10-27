import { Ref, ref, computed } from 'vue'

import LocalStorageCache from 'swrv/dist/cache/adapters/localStorage'

// import { Search } from '~/api2/search'
import { Discovery } from '~/services/meta/discovery'
import { useOptions } from '~/services/api/common'

export default function useIndexSearch(
    body: Record<string, any> | Ref<Record<string, any>>,
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

    const list = computed(() => {
        if (data?.value.entities) {
            return data?.value.entities
        }
        return []
    })

    const aggregationMap = (key) => {
        if (data?.value.aggregations[key]) {
            return data?.value.aggregations[key].buckets
        }
        return {}
    }

    const typenameAggregation = computed(() => {
        return aggregationMap('typename')
    })

    const refresh = () => {
        mutate()
    }

    return {
        data,
        list,
        aggregationMap,
        mutate,
        refresh,
        error,
        isLoading,
        isValidating,
        typenameAggregation,
    }
}
