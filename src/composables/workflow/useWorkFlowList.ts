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
    const params = ref({ limit: 10, offset: 0, labelSelector: "com.atlan.orchestration/verified=true" })
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

export function useWorkflowTemplateByName(name, immediate: boolean = true) {
    const { data, error, isLoading, mutate } =
        Workflows.getWorkflowTemplateByName(name, {
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

export function updateWorkflowByName(name, body, immediate: boolean = true) {
    const { data, error, isLoading, isReady, mutate } =
        Workflows.updateWorkflowByName(name, body, {
            immediate,
            options: {},
        })

    return {
        workflow: data,
        error,
        isLoading,
        isReady,
        mutate,
    }
}


export function getWorkflowConfigMap(name, immediate: boolean = true) {
    const params = ref({ labelSelector: `com.atlan.orchestration/workflow-template-name=${name},com.atlan.orchestration/type=package` })
    // const params = computed(() => ({
    //     'name': `${name.value}` // `com.atlan.orchestration/workflow-template-name=${label}`
    // }))
    // const params = ref({ labelSelector: "" })
    const { data, error, isLoading, mutate } = Workflows.getWorkflowConfigMap({ immediate, options: {}, params })

    const changeName = (n) => {
        params.value.labelSelector = `com.atlan.orchestration/workflow-template-name=${n},com.atlan.orchestration/type=package`
        mutate()
    }

    return { data, error, isLoading, mutate, changeName }
}

export function createWorkflow(body, immediate: boolean = true) {

    const { data, error, isLoading, mutate } = Workflows.createWorkflow({ body, immediate, options: {} })

    return { data, error, isLoading, mutate }
}
