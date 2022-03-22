import { ref } from 'vue'
import { useOptions } from '~/services/api/common'
import { Workflows } from '~/services/service/workflows'

export default function useWorkflowUpdate(
    path,
    body,
    immediate: boolean = true
) {
    const options: useOptions = {}
    options.asyncOptions = ref({
        immediate,
    })
    const { data, error, isLoading, isReady, mutate } =
        Workflows.updateWorkflowByName(path, body, options)

    return {
        data,
        error,
        isLoading,
        isReady,
        mutate,
    }
}
