import { Workflows } from '~/services/service/workflows'

export default function useWorkflowSubmit(body, immediate: boolean = true) {
    const { data, error, isLoading, mutate } = Workflows.runWorkflowByName({
        body,
        immediate,
        options: {},
    })

    return {
        data,
        error,
        isLoading,
        mutate,
    }
}
