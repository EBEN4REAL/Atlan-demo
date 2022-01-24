// Vue
import { watch } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'

// Composables
import {
    runWorkflowByName,
    deleteWorkflowByName,
} from '~/composables/workflow/useWorkflowList'

export default function useControlGraph() {
    const router = useRouter()

    const run = (name, isWorkflowRunning) => {
        isWorkflowRunning.value = true

        const body = {
            namespace: 'default',
            resourceKind: 'WorkflowTemplate',
            resourceName: name.value,
        }

        const { data, error } = runWorkflowByName(body, true)

        watch([data, error], ([newX, newY]) => {
            if (newX && !newY) {
                setTimeout(() => {
                    isWorkflowRunning.value = false
                    router.push({
                        path: `/workflows/${name.value}/monitor`,
                        query: { tab: 'runs' },
                    })
                }, 3000)
            }
            if (newY) {
                isWorkflowRunning.value = false
                const msgErr = newY?.response?.data?.message || "Don't worry, something broke on our end, you can send this info to us."
                message.error({
                    content: msgErr,
                })
            }
        })
    }

    const deleteWorkflow = (name) => {
        message.loading({
            content: `Deleting ${name.value}`,
            duration: 100,
            key: `deleting${name.value}`,
        })
        const { data } = deleteWorkflowByName(name)
        watch(data, () => {
            message.success({
                content: `Deleted ${name.value}`,
                duration: 2,
                key: `deleting${name.value}`,
            })
            setTimeout(() => {
                router.push(`/workflows`)
            }, 2000)
        })
    }

    return {
        run,
        deleteWorkflow,
    }
}
