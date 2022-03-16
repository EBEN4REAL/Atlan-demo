import { ref } from 'vue'
import { useOptions } from '~/services/api/common'
import { Workflows } from '~/services/service/workflows'

export default function useWorkflowRunRetry(
    path,

    immediate: boolean = true
) {
    const options: useOptions = {}
    options.asyncOptions = ref({
        immediate,
    })
    const { data, error, isLoading, isReady, mutate } = Workflows.retryRun(
        path,
        options
    )

    return {
        data,
        error,
        isLoading,
        isReady,
        mutate,
    }
}
