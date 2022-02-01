import { Ref, ref } from 'vue'
import axios, { AxiosRequestConfig, CancelTokenSource } from 'axios'
import { useAPI } from '~/services/api/useAPI'
import { map } from '~/services/meta/search/key'
import { useOptions } from '~/services/api/common'

export default function useIndexSearch(
    initialBody?: Ref<Record<string, any>> | Record<string, any>,
    cacheSuffx?: string | '',
    immediate?: boolean,
    params: Object = {}
) {
    const cancelTokenSource: CancelTokenSource = axios.CancelToken.source()

    const body = ref(initialBody)
    // const body = ref({})
    let options: useOptions = {}
    options.options = ref({
        cancelToken: cancelTokenSource?.token,
    })
    options.asyncOptions = ref({
        immediate: immediate,
    })

    const { data, mutate, error, isLoading, isReady } = useAPI<any>(
        map.INDEX_SEARCH,
        'POST',
        { body, params },
        options
    )

    const replaceBody = (payload: any) => {
        console.log('body payload: ', payload)
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
