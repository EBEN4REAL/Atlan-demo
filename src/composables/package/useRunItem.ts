import { ref, watch } from 'vue'
import { useOptions } from '~/services/api/common'

import { Runs } from '~/services/service/runs'

export default function useRunItem(path, immediate) {
    const item = ref({})

    const options: useOptions = {}
    options.asyncOptions = ref({
        immediate,
        resetOnExecute: false,
    })

    const { data, error, isLoading, mutate, isValidating } = Runs.getLiveRun(
        path,
        options
    )

    return {
        data,
        error,
        isLoading,
        isValidating,
        mutate,
    }
}
