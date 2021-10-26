// Vue
import { watch } from 'vue'
import { useRouter } from 'vue-router'

// Composables
import { runWorkflowByName } from '~/composables/workflow/useWorkFlowList'

export default function useControlGraph() {
    const router = useRouter()

    const run = (resourceName, isWorkflowRunning) => {
        isWorkflowRunning.value = true

        const body = {
            namespace: 'default',
            resourceKind: 'WorkflowTemplate',
            resourceName: resourceName.value,
        }

        const { data } = runWorkflowByName(body, true)

        watch(data, () => {
            setTimeout(() => {
                isWorkflowRunning.value = false
                router.push(`/workflows/${resourceName.value}/monitor`)
            }, 5000)
        })
    }

    return {
        run,
    }
}
