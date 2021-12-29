import { Method } from 'axios'
import { computed, ref, isRef } from 'vue'
import useSWRV from 'swrv'
import { useAsyncState } from '@vueuse/core'
import { useAPIPromise } from './useAPIPromise'
import { resolveUrl, useOptions, AsyncStateAPIParams, APIFn } from './common'

/* eslint-disable import/prefer-default-export */
export const useAPI = <T>(
    path: APIFn,
    method: Method,
    {
        params,
        body,
        pathVariables,
        initialState = <T>{},
    }: AsyncStateAPIParams<T>,
    { options, asyncOptions, cacheKey, cacheOptions }: useOptions
) => {
    // Make sure to specify cacheKey as well as cacheOptions if you want to use SWRV otherwise this won't make the API call
    if (cacheOptions) {
        console.log('cache',cacheKey,cacheOptions)
        const url = computed(() => resolveUrl(path, pathVariables))

        const { data, error, mutate, isValidating } = useSWRV<T>(
            () => (isRef(cacheKey) ? cacheKey.value : cacheKey),
            () =>
                useAPIPromise(url.value, method, {
                    params,
                    body,
                    options,
                }),
            isRef(cacheOptions) ? cacheOptions.value : cacheOptions
        )
        const isLoading = computed(() => !data.value && !error.value)
        return { data, error, isLoading, mutate, isValidating }
    }

    const isExecuted = ref(false)
    const url = computed(() => resolveUrl(path, pathVariables))
    const { state, execute, isReady, error } = useAsyncState<T>(
        () => {
            isExecuted.value = true
            return useAPIPromise(url.value, method, {
                params,
                body,
                options,
            })
        },
        initialState,
        isRef(asyncOptions) ? asyncOptions.value : asyncOptions
    )
    const isLoading = computed(
        () => isExecuted.value && !isReady.value && !error.value
    )
    return {
        data: state,
        mutate: execute,
        error,
        isReady,
        isLoading,
    }
}
