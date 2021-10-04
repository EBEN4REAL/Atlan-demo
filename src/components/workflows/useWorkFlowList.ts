/* eslint-disable import/prefer-default-export */
import { watch, ref } from 'vue'
import { Workflows } from '~/services/argo/api/workflow'

export function useWorkflowTemplateSearchList(tenant, immediate: boolean = true) {
    const { data, error, isLoading, mutate } = Workflows.getWorkflowTemplates(tenant, { immediate, options: {} })

    const workflowList = ref([])
    watch(data, () => {
        console.log('useWorkflowTemplateSearchList', data.value.items)
        workflowList.value = data.value?.items
    })

    const filterList = (text) => workflowList.value.filter(wf => wf.metadata.name.includes(text))

    return { workflowList, error, isLoading, filterList, mutate }
}

export function useArchivedWorkflowList(labelSelector, immediate: boolean = true) {
    const label = ref(labelSelector)
    const { data, error, isLoading, mutate } = Workflows.getArchivedWorkflowList(label.value, { immediate, options: {} })

    const workflowList = ref([])
    watch(data, () => {
        console.log('useArchivedWorkflowList', data.value.items)
        workflowList.value = data.value?.items
    })

    const reFetch = (l) => {
        label.value = l;
        mutate()
    }
    const filterList = (text) => workflowList.value.filter(wf => wf.metadata.name.includes(text))

    return { workflowList, error, isLoading, filterList, mutate, reFetch }
}

export function useWorkflowTemplate(tenant, name, immediate: boolean = true) {
    const { data, error, isLoading, mutate } = Workflows.getWorkflowTemplateByName(tenant, name, { immediate, options: {} })

    return {
        workflow: data, error, isLoading, mutate
    }
}