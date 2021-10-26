import { KeyMaps } from '~/api/keyMap'
import workflow from '~/mixins/workflow'
import { useAPIAsyncState } from '~/services/api/useAPI'

const getWorkflowLiveRun = (workflowTemplate, { immediate, options }) =>
    useAPIAsyncState(
        KeyMaps.workflow.LIVE_WORKFLOW_RUN,
        'GET',
        {
            options,
            pathVariables: {
                workflowTemplate,
            },
        },
        { immediate }
    )

function useWorkflowLiveRun(workflowTemplate, immediate: boolean = true) {
    const { data, error, isLoading, mutate } = getWorkflowLiveRun(
        workflowTemplate,
        {
            immediate,
            options: {},
        }
    )

    return {
        data,
        error,
        isLoading,
        mutate,
    }
}

export default useWorkflowLiveRun
