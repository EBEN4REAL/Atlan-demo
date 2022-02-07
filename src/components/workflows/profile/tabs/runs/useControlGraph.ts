// Vue
import { watch } from 'vue'

// Composables
import {
    retryRunByName,
    stopRunByName,
} from '~/composables/workflow/useWorkflowList'

export default function useControlGraph() {
    const retry = (selectedRunName, isRunning) => {
        isRunning.value = true

        const { data } = retryRunByName(selectedRunName.value)
        watch(data, () => {
            isRunning.value = false
        })
    }

    const stop = (selectedRunName, isRunning) => {
        const { data } = stopRunByName(selectedRunName.value)
        watch(data, () => {
            isRunning.value = false
        })
    }

    return {
        retry,
        stop,
    }
}
