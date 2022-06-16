import axios from 'axios'
import { ref, watch } from 'vue'
import { useOptions } from '~/services/api/common'

import { Runs } from '~/services/service/runs'

export default function useRunItem(path, immediate) {
    let cancel = axios.CancelToken.source()

    const options = {
        asyncOptions: ref({
            immediate,
            resetOnExecute: false,
        }),
        options: ref({
            cancelToken: cancel.token,
        }),
    }

    const { data, error, isLoading, mutate, isValidating } = Runs.getLiveRun(
        path,
        options
    )

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
        error,
        isLoading,
        isValidating,
        mutate: refresh,
    }
}
