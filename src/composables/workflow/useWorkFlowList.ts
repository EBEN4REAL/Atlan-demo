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

// export function useArchivedRunList({ filter }, immediate: boolean = true) {
//   const params = ref(new URLSearchParams())
//   const limit = ref(10)
//   const offset = ref(0)
//   if (filter) params.value.append('filter', JSON.stringify(filter))
//   params.value.append('limit', limit.value.toString())
//   params.value.append('offset', offset.value.toString())

//   const pathVariables = ref({
//     params
//   })

//   const { data, error, isLoading, mutate } = Workflows.getArchivedRunList(
//     pathVariables,
//     { immediate, options: {}, params }
//   )

//   const runList = ref([])
//   const totalCount = ref()
//   const filter_record = ref()

//   watch(data, () => {
//     if (!data?.value?.records) return
//     totalCount.value = data.value.total_record
//     filter_record.value = data.value.filter_record
//     runList.value.push(...data.value.records)
//   })

//   const loadMore = () => {
//     offset.value += limit.value
//     params.value.set('offset', offset.value.toString())
//     if (offset.value > totalCount.value) {
//       offset.value = totalCount.value
//       params.value.set('offset', offset.value.toString())
//     }
//     mutate()
//   }

//   // TODO will need to remove but for new leave cause of BWC
//   const filterList = (text) =>
//     runList.value.filter((wf) =>
//       wf.name.toLowerCase().includes(text.toLowerCase())
//     )
//   // TODO will need to remove but for new leave cause of BWC
//   const reFetch = (name) => {
//     pathVariables.value.filter = JSON.stringify({ "labels": { "$elemMatch": { "workflows.argoproj.io/workflow-template": name } } })
//     mutate()
//   }

//   const loadData = ({ filter: newFilter, }) => {
//     // TODO Add filters, sort and search here
//     if (newFilter) params.value.set('filter', JSON.stringify(newFilter))
//     mutate()
//   }

//   return { runList, error, isLoading, filterList, mutate, reFetch, loadMore, totalCount, filter_record, loadData }
// }

export function getRunList(labelSelector, immediate: boolean = true) {
    const { data, error, isLoading } = Workflows.getRunList(labelSelector, {
        immediate,
        options: { refreshInterval: 60000 },
    })

    const liveList = ref([])

    watch(data, () => {
        liveList.value = data.value
    })

    return { liveList, error, isLoading }
}

export function getArchivedRunList(filter, immediate: boolean = true) {
    const { data, error, isLoading, mutate } = Workflows.getArchivedRunList(
        filter,
        { immediate, options: {} }
    )

    const archivedList = ref([])
    watch(data, () => {
        archivedList.value = data.value
    })

    const loadMore = () => {}
    const totalCount = ref(0)
    const filter_record = ref([])

    return {
        archivedList,
        error,
        isLoading,
        loadMore,
        totalCount,
        filter_record,
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
        console.log('useWorkflowConfigMaps', data.value.records)
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

export function useWorkflowTemplateByName(name, immediate: boolean = true) {
    const params = ref({ filter: { name } })
    const { data, error, isLoading, mutate } =
        Workflows.getWorkflowTemplateByName({
            params,
            immediate,
            options: {},
        })

    const changeName = (n) => {
        params.value.filter.name = n
        mutate()
    }
    const workflowTemplate = ref()
    watch(data, () => {
        if (!data?.value?.records) return
        workflowTemplate.value = data.value.records[0]
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

export function getWorkflowConfigMapByName(name, immediate: boolean = true) {
    const params = ref({
        filter: {
            $or: [
                {
                    labels: {
                        $elemMatch: {
                            'com.atlan.orchestration/workflow-template-name':
                                name,
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
