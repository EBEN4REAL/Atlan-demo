/* eslint-disable import/prefer-default-export */
import { watch, ref, computed } from 'vue'
import { Workflows } from '~/services/argo/api/workflow'

export function useWorkflowTemplateSearchList(
    tenant,
    immediate: boolean = true
) {
    const { data, error, isLoading, mutate } = Workflows.getWorkflowTemplates(
        tenant,
        { immediate, options: {} }
    )

    const workflowList = ref([])
    watch(data, () => {
        console.log('useWorkflowTemplateSearchList', data.value.items)
        workflowList.value = data.value?.items
    })

    const filterList = (text) =>
        workflowList.value.filter((wf) => wf.metadata.name.includes(text))

    return { workflowList, error, isLoading, filterList, mutate }
}

export function useArchivedWorkflowList(
    labelSelector,
    immediate: boolean = true
) {
    const param = computed(() => ({
        'listOptions.labelSelector': labelSelector.value,
        'listOptions.limit': 100,
    }))

    const { data, error, isLoading, mutate } =
        Workflows.getArchivedWorkflowList(param, { immediate, options: {} })

    const workflowList = ref([])
    watch(data, () => {
        console.log('useArchivedWorkflowList', data.value.items)
        workflowList.value = data.value?.items
    })

    const filterList = (text) =>
        workflowList.value.filter((wf) => wf.metadata.name.includes(text))

    return { workflowList, error, isLoading, filterList, mutate }
}

export function useClusterWorkflowTemplates(
    immediate: boolean = true
) {
    const { data, error, isLoading, mutate } =
        Workflows.getClusterWorkflowTemplates({ immediate, options: {} })

    const workflowList = ref([])
    watch(data, () => {
        console.log('useClusterWorkflowTemplates', data.value.items)
        workflowList.value = data.value?.items
    })

    const filterList = (text) =>
        workflowList.value.filter((wf) => wf.metadata.name.includes(text))

    return { workflowList, error, isLoading, filterList, mutate }
}

export function useArchivedWorkflowRun(guid, immediate: boolean = true) {
    const { data, error, isLoading, mutate } = Workflows.getArchivedWorkflowRun(
        guid,
        { immediate, options: {} }
    )

    const runDeets = ref([])

    watch(data, () => {
        runDeets.value = data.value
    })

    return { runDeets, error, isLoading, mutate }
}

export function useWorkflowTemplate(tenant, name, immediate: boolean = true) {
    const { data, error, isLoading, mutate } =
        Workflows.getWorkflowTemplateByName(tenant, name, {
            immediate,
            options: {},
        })

    return {
        workflow: data,
        error,
        isLoading,
        mutate,
    }
}
