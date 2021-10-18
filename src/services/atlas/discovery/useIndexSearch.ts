import { Ref, ref } from 'vue'
import axios, { AxiosRequestConfig, CancelTokenSource } from 'axios'
import { useAPIAsyncState } from '~/services/api/useAPI'
import { KeyMaps } from '../atlas_keyMaps'

export default function useIndexSearch(
    initialBody?: Ref<Record<string, any>> | Record<string, any>,
    cacheSuffx?: string | '',
    immediate?: boolean
) {
    const axiosOpts: AxiosRequestConfig = {
        // cancelToken: axios.CancelToken.source()?.token,
    }

    // const body = ref(initialBody)
    const body = ref({})

    const { data, mutate, error, isLoading, isReady } = useAPIAsyncState<any>(
        KeyMaps.ES.INDEX_SEARCH,
        'POST',
        { body, options: axiosOpts },
        { immediate, resetOnExecute: false }
    )

    const refresh = () => {
        mutate()
    }

    const query = (queryText: string) => {}

    const replaceBody = (payload: any) => {
        body.value = payload
        mutate()
    }

    return {
        data,
        isLoading,
        error,
        query,
        refresh,
        replaceBody,
        body,
        mutate,
        isReady,
    }
}
