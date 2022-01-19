import LocalStorageCache from 'swrv/dist/cache/adapters/localStorage'

import { watch, Ref, ref } from 'vue'
import { Access } from '~/services/service/access'

import { useOptions } from '~/services/api/common'
import { useAuthStore } from '~/store/auth'
import axios from 'axios'

export default function useEvaluate(
    body: Record<string, any> | Ref<Record<string, any>>,
    immediate?: Boolean,
    secondaryEvaluation?: Boolean
) {
    const options: useOptions = {}
    let cancel = axios.CancelToken.source()
    options.options = ref({
        cancelToken: cancel.token,
    })
    options.asyncOptions = ref({
        immediate,
        resetOnExecute: false,
    })
    const { data, mutate, error, isLoading, isReady } = Access.Evaluate(
        body,
        options
    )
    const authStore = useAuthStore()

    watch(data, () => {
        if (secondaryEvaluation) {
            authStore.setSecondaryEvaluations(data.value)
        } else {
            authStore.setEvaluations(data.value)
        }
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
        error,
        refresh,
        isLoading,
    }
}
