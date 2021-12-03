/* eslint-disable import/prefer-default-export */
import { watch, ref, Ref } from 'vue'
import { Workflows } from '~/services/service/workflows'
import { ArchivedRuns } from '~/types/workflow/runs.interface'

export function useWorkflowSearchList(immediate: boolean = true) {
    const params = ref(new URLSearchParams())
    const filter = ref({})
    const limit = ref(10)
    const offset = ref(0)
    params.value.append('limit', limit.value.toString())
    params.value.append('offset', offset.value.toString())
    params.value.append('filter', JSON.stringify(filter.value))

    // const sample = `{ "$or":[ { "labels": { "$elemMatch":{ "workflows.argoproj.io/creator-email": "nityananda.at.atlan.comar"} } }, { "labels":{ "$elemMatch":{ "x2": "a2"} } } ] }`

    const { data, error, isLoading, mutate, isReady } = Workflows.getWorkflows({
        immediate,
        options: {},
        params,
    })

    const workflowList = ref([])
    const totalCount = ref()
    const filter_record = ref()
    const iDs = ref([])

    watch(data, () => {
        if (!data?.value?.records) return
        const filtered = data.value.records.map((el) => ({
            id: el?.metadata.labels['workflows.argoproj.io/creator'],
            email_verified: true,
        }))
        iDs.value = [...iDs.value, ...filtered]
        totalCount.value = data.value.total_record
        filter_record.value = data.value.filter_record
        workflowList.value.push(...data.value.records)
    })

    const loadMore = () => {
        offset.value +=
            offset.value > totalCount.value ? totalCount.value : limit.value
        params.value.set('offset', offset.value.toString())

        mutate()
    }

    const filterList = (AllFilters) => {
        const { filter, sort } = AllFilters
        // rest list
        workflowList.value = []
        // reset offset
        offset.value = 0
        params.value.set('offset', '0')

        // set filter name && set filter
        const temp = {
            $and: [
                {
                    metadata: {
                        $elemMatch: {
                            labels: {
                                'com.atlan.orchestration/atlan-ui': 'true',
                            },
                        },
                    },
                },
                ...(Object.keys(filter).length ? [filter] : []),
            ],
        }
        params.value.set('filter', JSON.stringify(temp).replace(/\\/g, ''))

        // set sorting
        if (sort !== 'default' && sort) params.value.set('sort', sort)
        // mutate
        mutate()
    }
    return {
        workflowList,
        error,
        totalCount,
        isLoading,
        loadMore,
        filterList,
        mutate,
        filter_record,
        isReady,
        iDs,
    }
}

export function retryRunByName(name) {
    const pathVariables = ref({ name })

    const { data, error, isLoading } = Workflows.retryRun(pathVariables)

    return { data, error, isLoading }
}

export function stopRunByName(name) {
    const pathVariables = ref({ name })

    const { data, error, isLoading } = Workflows.stopRun(pathVariables)

    return { data, error, isLoading }
}

export function getRunList(name, getRunning = true) {
    const params = ref(new URLSearchParams())

    const labelSelector = ref(
        `workflows.argoproj.io/workflow-template=${name.value}${getRunning ? ',workflows.argoproj.io/phase=Running' : ''
        }`
    )
    params.value.append('labelSelector', labelSelector.value)

    const { data, error, isLoading, mutate, isReady } = Workflows.getRunList({
        params,
    })

    const execute = (n) => {
        params.value = new URLSearchParams()
        params.value.append(
            'labelSelector',
            `workflows.argoproj.io/workflow-template=${n},workflows.argoproj.io/phase=Running`
        )
        mutate()
    }

    return { liveList: data, error, isLoading, execute, isReady }
}

export function getArchivedRunList(name) {
    const archivedList: Ref<ArchivedRuns[]> = ref([])
    const params = ref(new URLSearchParams())
    const totalCount = ref(0)
    const filter_record = ref(0)
    const offset = ref(0)
    const limit = ref(10)


    const filter = ref({ "labels": { "$elemMatch": { "workflows.argoproj.io/workflow-template": name } } })


    params.value.append('filter', JSON.stringify(filter.value))
    params.value.append('offset', offset.value.toString())
    params.value.append('limit', limit.value.toString())
    const { data, error, isLoading, mutate, isReady } =
        Workflows.getArchivedRunList({
            params,
        })

    const loadMore = () => {
        console.log({ name: name })
        const count = data?.value?.records?.length ?? 0
        offset.value += offset.value > count ? count : limit.value
        params.value.set('offset', offset.value.toString())
        mutate()
    }

    watch(data, () => {
        if (!data?.value?.records) {
            data.value = {
                total_record: 0,
                filter_record: 0,
                records: [],
            }
            return
        }
        totalCount.value = data.value.total_record
        filter_record.value = data.value.filter_record
        if (offset.value > 0)
            archivedList.value = [...archivedList.value, ...data.value.records]
        else archivedList.value = data.value.records ?? []
    })

    const execute = (n) => {
        params.value = new URLSearchParams()
        filter.value.labels.$elemMatch = {
            'workflows.argoproj.io/workflow-template': `${n}`,
        }
        params.value.append('filter', JSON.stringify(filter.value))
        offset.value = 0
        limit.value = 10
        params.value.append('offset', offset.value.toString())
        params.value.append('limit', limit.value.toString())

        mutate()
    }
    return {
        archivedList,
        error,
        isLoading,
        totalCount,
        filter_record,
        loadMore,
        isReady,
        execute,
    }
}

export function useWorkflowConfigMaps(immediate: boolean = true) {
    const params = ref(new URLSearchParams())
    const filter = ref({})
    const limit = ref(10)
    const offset = ref(0)
    params.value.append('limit', limit.value.toString())
    params.value.append('offset', offset.value.toString())
    params.value.append('filter', JSON.stringify(filter.value))

    const pathVariables = ref({})

    const { data, error, isLoading, mutate } = Workflows.getWorkflowConfigMap({
        pathVariables,
        immediate,
        options: {},
        params,
    })

    const workflowList = ref([])
    const totalCount = ref()
    const filter_record = ref()
    watch(data, () => {
        if (!data?.value?.records) return
        totalCount.value = data.value.total_record
        filter_record.value = data.value.filter_record
        workflowList.value.push(...data.value.records)
    })

    const loadMore = () => {
        params.value.offset += params.value.limit
        if (params.value.offset > totalCount.value)
            params.value.offset = totalCount.value
        mutate()
    }

    const filterList = (AllFilters) => {
        const { filter, sort } = AllFilters

        // rest list
        workflowList.value = []
        // reset offset
        offset.value = 0
        params.value.set('offset', '0')

        // set filter name && set filter
        // for reference { "$and": [{ "labels": { "$elemMatch": { "com.atlan.orchestration/verified": "true" } } }, { "$or": [{ "connector": "snowflake" }] }]}
        const temp = {
            $and: [
                {
                    metadata: {
                        $elemMatch: {
                            labels: {
                                'com.atlan.orchestration/verified': 'true',
                                'com.atlan.orchestration/type': 'package',
                            },
                        },
                    },
                },
                ...(Object.keys(filter).length ? [filter] : []),
            ],
        }

        params.value.set('filter', JSON.stringify(temp).replace(/\\/g, ''))

        // set sorting
        if (sort !== 'default' && sort) params.value.set('sort', sort)
        // mutate
        mutate()
    }

    return {
        workflowList,
        loadMore,
        filter_record,
        totalCount,
        error,
        isLoading,
        filterList,
        mutate,
    }
}

export function useWorkflowTemplates(immediate: boolean = true) {
    const params = ref(new URLSearchParams())
    const filter = ref({})
    // const sort = ref()
    const limit = ref(10)
    const offset = ref(0)
    params.value.append('limit', limit.value.toString())
    params.value.append('offset', offset.value.toString())
    params.value.append('filter', JSON.stringify(filter.value))

    const pathVariables = ref({})

    const { data, error, isLoading, mutate } = Workflows.getWorkflowTemplates({
        pathVariables,
        immediate,
        options: {},
        params,
    })

    const workflowList = ref([])
    const totalCount = ref()
    const filter_record = ref()
    watch(data, () => {
        if (!data?.value?.records) return
        totalCount.value = data.value.total_record
        filter_record.value = data.value.filter_record
        workflowList.value.push(...data.value.records)
    })

    const loadMore = () => {
        params.value.offset += params.value.limit
        if (params.value.offset > totalCount.value)
            params.value.offset = totalCount.value
        mutate()
    }

    const filterList = (AllFilters) => {
        const { filter, sort } = AllFilters

        // rest list
        workflowList.value = []
        // reset offset
        offset.value = 0
        params.value.set('offset', '0')

        // set filter name && set filter

        // set default filter
        const temp = {
            $and: [
                {
                    metadata: {
                        $elemMatch: {
                            labels: {
                                'com.atlan.orchestration/verified': 'true',
                            },
                        },
                    },
                },
                ...(Object.keys(filter).length ? [filter] : []),
            ],
        }

        params.value.set('filter', JSON.stringify(temp).replace(/\\/g, ''))

        // set sorting
        if (sort !== 'default' && sort) params.value.set('sort', sort)
        // mutate
        mutate()
    }

    return {
        workflowList,
        loadMore,
        filter_record,
        totalCount,
        error,
        isLoading,
        filterList,
        mutate,
    }
}

export function useWorkflowTemplateByName(name, immediate: boolean = true) {
    // const params = ref({ filter: { name } })
    const pathVariables = ref({ name })
    const { data, error, isLoading, mutate } =
        Workflows.getWorkflowTemplateByName({
            immediate,
            pathVariables,
            options: {},
        })

    const changeName = (n) => {
        pathVariables.value.name = n
        mutate()
    }
    const workflowTemplate = ref()
    watch(data, () => {
        if (!data?.value) return
        workflowTemplate.value = data.value
    })

    return {
        changeName,
        data,
        workflowTemplate,
        error,
        isLoading,
        mutate,
    }
}

export function useWorkflowByName(name, immediate: boolean = true) {
    const filter = ref({
        $and: [
            {
                metadata: {
                    $elemMatch: {
                        name,
                    },
                },
            },
        ],
    })
    const params = ref(new URLSearchParams())
    params.value.append('filter', JSON.stringify(filter.value))

    const { data, error, isLoading, mutate } = Workflows.getWorkflows({
        immediate,
        options: {},
        params,
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

export function getWorkflowConfigMapByName(name, immediate: boolean = true) {
    const params = ref({
        filter: {
            $or: [
                {
                    metadata: {
                        $elemMatch: {
                            labels: {
                                'com.atlan.orchestration/workflow-template-name':
                                    name,
                            },
                        },
                    },
                },
            ],
        },
    })
    const { data, error, isLoading, mutate } = Workflows.getWorkflowConfigMap({
        immediate,
        pathVariables: {},
        options: {},
        params,
    })

    const changeName = (n) => {
        params.value.filter.name = n
        mutate()
    }

    return { data, error, isLoading, mutate, changeName }
}

export function deleteWorkflowByName(name, immediate: boolean = true) {
    const pathVariables = ref({ name })
    const { data, error, isLoading, mutate } = Workflows.deleteWorkflowByName({
        pathVariables,
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

export function runWorkflowByName(body, immediate: boolean = true) {
    const { data, error, isLoading, mutate } = Workflows.runWorkflowByName({
        body,
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

export function createWorkflow(body, immediate: boolean = true) {
    const params = ref({
        submit: true,
    })

    const { data, error, isLoading, mutate } = Workflows.createWorkflow({
        body,
        immediate,
        params,
        options: {},
    })

    const execute = (now) => {
        params.value.submit = now
        mutate()
    }

    return { data, error, isLoading, execute }
}

export function useSchedule(mode, bodyParams) {
    const {
        scheduleName: name,
        scheduleNameForUpdate,
        workflowName,
        schedule,
        timezone,
        suspend,
        frequency,
        resourceVersion,
    } = bodyParams.value

    const body = {
        metadata: {
            name,
            namespace: 'default',
            labels: {
                frequency,
                'org.argopm.package.installer': 'argopm',
                'com.atlan.orchestration/workflow-name': workflowName,
            },
            resourceVersion,
        },
        spec: {
            workflowSpec: {
                arguments: {},
                workflowTemplateRef: {
                    name: workflowName,
                },
            },
            schedule,
            timezone,
            concurrencyPolicy: 'Replace',
            suspend,
            startingDeadlineSeconds: 0,
            successfulJobsHistoryLimit: 1,
            failedJobsHistoryLimit: 1,
        },
    }

    const add = () => {
        const { data, error, isLoading, isReady } = Workflows.addSchedule({
            body,
        })
        return { data, error, isLoading, isReady }
    }

    const update = () => {
        const pathVariables = ref({ name: scheduleNameForUpdate })
        const { data, error, isLoading, isReady } = Workflows.updateSchedule({
            body,
            pathVariables,
        })
        return { data, error, isLoading, isReady }
    }

    if (mode === 'add') {
        delete body.metadata.resourceVersion
        return add()
    }
    return update()
}

export function useDeleteSchedule(name) {
    const pathVariables = ref({ name })

    const { isReady, error, isLoading } = Workflows.deleteSchedule({
        pathVariables,
    })
    return { isReady, error, isLoading }
}

export function useGetSchedules(name) {
    const labelSelector = `com.atlan.orchestration/workflow-name=${name.value}`
    const params = ref(new URLSearchParams())
    params.value.append('labelSelector', labelSelector)
    const { data, error, isLoading, mutate } = Workflows.getSchedules({
        params,
    })
    return { data, error, isLoading, mutate }
}

export function useArchivedWorkflowRunLogs(
    immediate: boolean = true,
    idGraph: string,
    idPod: string
) {
    const params = ref({ podName: idPod })
    const { data, error, isLoading, mutate } = Workflows.getArchivedRunLogs(
        idGraph,
        {
            immediate,
            options: {},
            params: params.value,
        }
    )

    const getLogs = () => {
        mutate()
    }

    return {
        data,
        error,
        isLoading,
        mutate,
        getLogs,
    }
}
