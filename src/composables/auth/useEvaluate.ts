import LocalStorageCache from 'swrv/dist/cache/adapters/localStorage'

import { watch, Ref, ref } from 'vue'
import { Access } from '~/services/service/access'

import { useOptions } from '~/services/api/common'
import { useAuthStore } from '~/store/auth'

export default function useEvaluate(
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

    const { data, mutate, error, isLoading } = Access.Evaluate(body, options)

    const authStore = useAuthStore()
    watch(data, () => {
        authStore.setEvaluations(data.value)
    })

    return {
        data,
        mutate,
        error,
        isLoading,
    }

    // const { data, isReady } = Access.Evaluate({
    //     cacheKey: 'DEFAULT_PERMISSIONS',
    //     cache: {
    //         shouldRetryOnError: false,
    //         revalidateOnFocus: false,
    //         cache: new LocalStorageCache(),
    //         dedupingInterval: 1,
    //     },
    // })
    // const authStore = useAuthStore()

    // return {
    //     data,
    //     isReady,
    // }
}
