import { ref, Ref, watch, computed } from 'vue'

import { useRunBody } from './useRunBody'

import useRunIndexSearch from './useRunIndexSearch'

interface DiscoverListParams {
    isCache?: boolean | false
    dependentKey?: Ref<any>
    queryText?: Ref<any>
    facets?: Ref<any>
    postFacets?: Ref<any>
    aggregations?: Ref<string[]>
    limit?: Ref<Number>
    offset?: Ref<Number>
    preference?: Ref<any>
    source?: Ref<any>
    refreshInterval?: number | 0
}

export function useRunDiscoverList({
    isCache,
    dependentKey,
    queryText,
    facets,
    postFacets,
    aggregations,
    preference,
    limit,
    source,
    offset = ref(0),
    refreshInterval = 0,
}: DiscoverListParams) {
    const defaultBody = ref({})

    const generateBody = () => {
        const dsl = useRunBody(
            queryText?.value,
            offset?.value,
            limit?.value,
            facets?.value,
            postFacets?.value,
            aggregations?.value,
            preference?.value
        )
        defaultBody.value = {
            ...dsl,
            _source: source?.value,
        }
    }

    const localKey = ref(dependentKey?.value)

    generateBody()

    const { data, refresh, isLoading, isValidating, cancelRequest, error } =
        useRunIndexSearch(
            defaultBody,
            localKey,
            isCache,
            false,
            1,
            refreshInterval
        )
    const list = ref([])

    watch(data, () => {
        console.log('changed data')
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
        console.log(list.value)
    })

    const quickChange = () => {
        generateBody()

        if (!localKey.value) {
            localKey.value = `dirty_${Date.now().toString()}`
        } else {
            refresh()
        }
    }

    const killRefresh = () => {
        cancelRequest()
        localKey.value = null
    }

    const fetch = () => {
        generateBody()
        refresh()
    }

    return {
        queryText,
        limit,
        offset,
        postFacets,

        isValidating,
        isLoading,
        list,

        data,
        fetch,
        quickChange,
        cancelRequest,

        killRefresh,
        refresh,
        error,
    }
}
