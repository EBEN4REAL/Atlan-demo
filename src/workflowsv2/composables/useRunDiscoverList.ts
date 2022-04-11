import { ref, Ref, watch } from 'vue'

import { LiveRun } from '~/types/workflow/runs.interface'
import { useRunBody } from './useRunBody'
import useRunIndexSearch from './useRunIndexSearch'

interface DiscoverListParams {
    queryText?: Ref<any>
    facets?: Ref<any>
    aggregations?: Ref<string[]>
    limit?: Ref<Number>
    offset?: Ref<Number>
    preference?: Ref<any>
    source?: Ref<any>
    immediate?: Boolean
}

export function useRunDiscoverList({
    queryText,
    facets,
    aggregations,
    preference,
    limit,
    source,
    offset = ref(0),
    immediate = true,
}: DiscoverListParams) {
    const defaultBody = ref({})

    const generateBody = () => {
        const dsl = useRunBody(
            queryText?.value,
            offset?.value,
            limit?.value,
            facets?.value,
            aggregations?.value,
            preference?.value
        )
        defaultBody.value = {
            ...dsl,
            _source: source?.value,
        }
    }

    generateBody()

    const { data, refresh, isLoading, isValidating, cancelRequest, error } =
        useRunIndexSearch(defaultBody, immediate)

    const list: Ref<LiveRun[]> = ref([])
    const runByWorkflowMap = ref({})

    watch(data, () => {
        if (offset?.value > 0) {
            data.value?.hits?.hits?.forEach((item) => {
                list.value.push(item._source)
            })
        } else if (data.value?.hits?.hits) {
            const temp = []
            data.value?.hits.hits.forEach((item) => {
                temp.push(item._source)
            })
            list.value = temp
        } else {
            list.value = []
        }
        data.value?.aggregations?.by_status?.by_status?.buckets?.forEach(
            (element) => {
                runByWorkflowMap.value[element.key] =
                    element.by_status?.top_hits_by_status?.hits?.hits
            }
        )
    })

    const quickChange = () => {
        generateBody()
        cancelRequest()
        refresh()
    }

    const resetState = () => {
        list.value = []
        runByWorkflowMap.value = {}
    }

    return {
        queryText,
        limit,
        offset,

        isValidating,
        isLoading,
        list,

        data,
        quickChange,
        cancelRequest,
        resetState,

        refresh,
        error,
        runByWorkflowMap,
    }
}
