import { Ref, ref } from 'vue'
import axios from 'axios'

import { useOptions } from '~/services/api/common'
import { Workflows } from '~/services/service/workflows'

export default function useRunIndexSearch(
    body: Record<string, any> | Ref<Record<string, any>>,
    immediate = true
) {
    let cancel = axios.CancelToken.source()
    const options: useOptions = {
        options: ref({
            cancelToken: cancel.token,
        }),
        asyncOptions: ref({
            immediate,
        }),
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
