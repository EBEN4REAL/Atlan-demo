/* eslint-disable import/prefer-default-export */
import { watch, ref } from 'vue'
import { Workflows } from '~/services/argo/api/workflow'

export function useWorkflowSearchList(tenant, immediate: boolean = true) {
    const { data, error, isLoading, mutate } = Workflows.getWorkflowTemplates(tenant, { immediate, options: {} })

    const workflowList = ref('')
    watch(data, () => {
        console.log('useWorkflowSearchList', data.value.items)
        workflowList.value = data.value?.items
    })

    return { workflowList, error, isLoading, mutate }
}