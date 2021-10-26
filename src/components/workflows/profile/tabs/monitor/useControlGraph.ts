// Composables
import { runWorkflowByName } from '~/composables/workflow/useWorkFlowList'

export default function useControlGraph() {
    const run = () => {
        runWorkflowByName()
    }

    return {
        run,
    }
}
