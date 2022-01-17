import { ref, watch } from 'vue'
import { useOptions } from '~/services/api/common'

import { Runs } from '~/services/service/runs'

export default function useRunItem(path) {
    const item = ref({})

    const options: useOptions = {}
    options.asyncOptions = ref({
        immediate: false,
    })

    const { data, error, isLoading, mutate, isReady, isValidating } =
        Runs.getLiveRun(path, options)

    watch(data, () => {
        if (data.value) {
            item.value = data.value
        }
    })

    return {
        item,
        error,
        isLoading,
        mutate,
    }
}
