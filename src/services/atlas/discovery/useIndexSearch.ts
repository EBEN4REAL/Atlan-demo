import { Ref, ref } from 'vue'
import axios, { AxiosRequestConfig, CancelTokenSource } from 'axios'
import { useAPIAsyncState } from '~/services/api/useAPI'
import { KeyMaps } from '../atlas_keyMaps'

export default function useIndexSearch(
    initialBody?: Ref<Record<string, any>> | Record<string, any>,
    cacheSuffx?: string | '',
    immediate?: boolean
) {
    const cancelTokenSource: CancelTokenSource = axios.CancelToken.source()
    const axiosOpts: AxiosRequestConfig = {
        cancelToken: cancelTokenSource?.token,
    }

    // const body = ref(initialBody)
    const body = ref({})

    const { data, mutate, error, isLoading, isReady } = useAPIAsyncState<any>(
        KeyMaps.ES.INDEX_SEARCH,
        'POST',
        { body, options: axiosOpts },
        { immediate, resetOnExecute: false }
    )

    const replaceBody = (payload: any) => {
        body.value = payload
        mutate()
    }

    return {
        data,
        isLoading,
        error,
        replaceBody,
        body,
        mutate,
        isReady,
    }
}
