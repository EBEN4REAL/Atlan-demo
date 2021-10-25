/* eslint-disable import/prefer-default-export */
import { watch, ref, computed } from 'vue'
import { Workflows } from '~/services/argo/api/workflow'

export function useWorkflowSearchList(immediate: boolean = true) {
    const params = ref(new URLSearchParams())
    const filter = ref({})
    // const sort = ref()
    const limit = ref(10)
    const offset = ref(0)
    params.value.append('limit', limit.value.toString())
    params.value.append('offset', offset.value.toString())
    params.value.append('filter', JSON.stringify(filter.value))
    // params.value.append('sort', sort.value)

    // const sample = `{ "$or":[ { "labels": { "$elemMatch":{ "workflows.argoproj.io/creator-email": "nityananda.at.atlan.comar"} } }, { "labels":{ "$elemMatch":{ "x2": "a2"} } } ] }`

    const { data, error, isLoading, mutate, isReady } = Workflows.getWorkflows({
        immediate,
        options: {},
        params,
    })

    const workflowList = ref([])
    const totalCount = ref()
    const filter_record = ref()

    watch(data, () => {
        if (!data?.value?.records) return
        // console.log('useWorkflowSearchList', data.value.records)
        totalCount.value = data.value.total_record
        filter_record.value = data.value.filter_record
        workflowList.value.push(...data.value.records)
    })

    const loadMore = () => {
        offset.value += limit.value
        params.value.set('offset', offset.value.toString())
        if (offset.value > totalCount.value) {
            offset.value = totalCount.value
            params.value.set('offset', offset.value.toString())
        }
        // console.log(offset.value);
        mutate()
    }

    const filterList = (AllFilters) => {
        console.log('Tranformed: ', AllFilters)

        const { filter: theFilters, sort } = AllFilters
        // rest list
        workflowList.value = []
        // reset offset
        offset.value = 0
        params.value.set('offset', '0')

        // set filter name && set filter
        filter.value = theFilters
        params.value.set(
            'filter',
            JSON.stringify(filter.value).replace(/\\/g, '')
        )

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
    }
}

export function useArchivedRunList(filter, immediate: boolean = true) {
    const { data, error, isLoading, mutate } = Workflows.getArchivedRunList(
        filter,
        { immediate, options: {} }
    )

    const runList = ref([])
    watch(data, () => {
        console.log('useArchivedRunList', data.value)
        runList.value = data.value
    })

    const filterList = (text) =>
        runList.value.filter((wf) =>
            wf.name.toLowerCase().includes(text.toLowerCase())
        )

    const reFetch = (name) => {
        pathVariables.value.name = name
        mutate()
    }

    return { runList, error, isLoading, filterList, mutate, reFetch }
}

export function useConfigMapList(immediate: boolean = true) {
    const params = ref(new URLSearchParams())
    const filter = ref({})
    // const sort = ref()
    const limit = ref(10)
    const offset = ref(0)
    params.value.append('limit', limit.value.toString())
    params.value.append('offset', offset.value.toString())
    params.value.append('filter', JSON.stringify(filter.value))

    const { data, error, isLoading, mutate } = Workflows.listConfigmap({
        immediate,
        options: {},
        params,
    })

    const workflowList = ref([])
    const totalCount = ref()
    const filter_record = ref()
    watch(data, () => {
        console.log(data)
        if (!data?.value?.records) return
        console.log('useWorkflowTemplates', data.value.records)
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
        console.log('Tranformed: ', AllFilters)

        const { filter: theFilters, sort } = AllFilters

        // rest list
        workflowList.value = []
        // reset offset
        offset.value = 0
        params.value.set('offset', '0')

        // set filter name && set filter
        filter.value = theFilters

        //set default filter
        filter.value['$and'] = [
            {
                labels: {
                    $elemMatch: {
                        'com.atlan.orchestration/verified': 'true',
                    },
                },
            },
        ]

        params.value.set(
            'filter',
            JSON.stringify(filter.value).replace(/\\/g, '')
        )

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

    const { data, error, isLoading, mutate } = Workflows.getWorkflowTemplates({
        immediate,
        options: {},
        params,
    })

    const workflowList = ref([])
    const totalCount = ref()
    const filter_record = ref()
    watch(data, () => {
        if (!data?.value?.records) return
        console.log('useWorkflowTemplates', data.value.records)
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
        console.log('Tranformed: ', AllFilters)

        const { filter: theFilters, sort } = AllFilters

        // rest list
        workflowList.value = []
        // reset offset
        offset.value = 0
        params.value.set('offset', '0')

        // set filter name && set filter
        filter.value = theFilters

        //set default filter
        filter.value['$and'] = [
            {
                labels: {
                    $elemMatch: {
                        'com.atlan.orchestration/verified': 'true',
                    },
                },
            },
        ]

        params.value.set(
            'filter',
            JSON.stringify(filter.value).replace(/\\/g, '')
        )

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

export function useWorkflowTemplateByName(filter, immediate: boolean = true) {
    const { data, error, isLoading, mutate } =
        Workflows.getWorkflowTemplateByName(filter, {
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

export function useWorkflowByName(filter, immediate: boolean = true) {
    const { data, error, isLoading, mutate } = Workflows.getWorkflowByName(
        filter,
        {
            immediate,
            options: {},
        }
    )

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
    const params = ref({
        labelSelector: `com.atlan.orchestration/workflow-template-name=${name},com.atlan.orchestration/type=package`,
    })
    // const params = computed(() => ({
    //     'name': `${name.value}` // `com.atlan.orchestration/workflow-template-name=${label}`
    // }))
    // const params = ref({ labelSelector: "" })
    const { data, error, isLoading, mutate } = Workflows.getWorkflowConfigMap({
        immediate,
        options: {},
        params,
    })

    const changeName = (n) => {
        params.value.labelSelector = `com.atlan.orchestration/workflow-template-name=${n},com.atlan.orchestration/type=package`
        mutate()
    }

    return { data, error, isLoading, mutate, changeName }
}

export function createWorkflow(body, immediate: boolean = true) {
    const { data, error, isLoading, mutate } = Workflows.createWorkflow({
        body,
        immediate,
        options: {},
    })

    return { data, error, isLoading, mutate }
}
