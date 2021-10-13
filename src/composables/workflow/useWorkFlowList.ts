/* eslint-disable import/prefer-default-export */
import { watch, ref, computed } from 'vue'
import { Workflows } from '~/services/argo/api/workflow'

export function useWorkflowSearchList(
    immediate: boolean = true
) {
    const params = ref({ limit: 10, offset: 0 })
    const { data, error, isLoading, mutate } = Workflows.getWorkflows(
        { immediate, options: {}, params }
    )

    const workflowList = ref([])
    const totalCount = ref()
    watch(data, () => {
        if (!data?.value?.records) return;
        console.log('useWorkflowSearchList', data.value.records)
        totalCount.value = data.value.total_record
        workflowList.value.push(...data.value.records)
    })

    const loadMore = () => {
        params.value.offset += params.value.limit
        if (params.value.offset > totalCount.value)
            params.value.offset = totalCount.value
        mutate()
    }

    const filterList = (text) =>
        workflowList.value.filter((wf) => wf.name.includes(text))

    return { workflowList, error, totalCount, isLoading, loadMore, filterList, mutate }
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

export function useWorkflowTemplates(
    immediate: boolean = true
) {
    const params = ref({ limit: 10, offset: 0 })
    const { data, error, isLoading, mutate } =
        Workflows.getWorkflowTemplates({ immediate, options: {}, params })

    const workflowList = ref([])
    const totalCount = ref()
    watch(data, () => {
        if (!data?.value?.records) return;
        console.log('useWorkflowTemplates', data.value.records)
        totalCount.value = data.value.total_record
        workflowList.value.push(...data.value.records)
    })

    const loadMore = () => {
        params.value.offset += params.value.limit
        if (params.value.offset > totalCount.value)
            params.value.offset = totalCount.value
        mutate()
    }



    const filterList = (text) =>
        workflowList.value.filter((wf) => wf.name.includes(text))

    return { workflowList, loadMore, totalCount, error, isLoading, filterList, mutate }
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

export function useWorkflowByName(name, immediate: boolean = true) {
    const { data, error, isLoading, mutate } =
        Workflows.getWorkflowByName(name, {
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

export function getWorkflowConfigMap(label, immediate: boolean = true) {
    const pathVariable = computed(() => ({
        'name': `${label}` // `com.atlan.orchestration/workflow-template-name=${label}`
    }))
    const { data, error, isLoading, mutate } = Workflows.getWorkflowConfigMap(pathVariable, { immediate, options: {} })

    return { data, error, isLoading, mutate }
}