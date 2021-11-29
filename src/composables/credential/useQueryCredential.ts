import { Ref, ref } from 'vue'

import axios from 'axios'

import { Credential } from '~/services/service/credentials'
import { useOptions } from '~/services/api/common'

export function useQueryCredential(
    body: Record<string, any> | Ref<Record<string, any>>
) {
    const options: useOptions = {}
    let cancel = axios.CancelToken.source()
    options.options = ref({
        cancelToken: cancel.token,
    })

    options.asyncOptions = ref({
        immediate: false,
    })

    const { data, mutate, error, isLoading, isValidating, isReady } =
        Credential.Query(body, options)

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
