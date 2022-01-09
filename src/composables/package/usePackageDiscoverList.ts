import { ref, Ref, watch } from 'vue'

import { usePackageBody } from './usePackageBody'

import usePackageIndexSearch from './usePackageIndexSearch'

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
    attributes?: Ref<string[]>
    relationAttributes?: Ref<string[]>
}

export function usePackageDiscoverList({
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
}: DiscoverListParams) {
    const defaultBody = ref({})

    const generateBody = () => {
        const dsl = usePackageBody(
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
        usePackageIndexSearch(defaultBody, localKey, isCache, false, 1)

    const list = ref([])

    watch(data, () => {
        if (offset?.value > 0) {
            data.value?.hits?.hits.forEach((item) => {
                list.value.push(item._source)
            })
        } else if (data.value?.hits?.hits) {
            const temp = []
            data.value?.hits?.hits.forEach((item) => {
                temp.push(item._source)
            })
            list.value = temp
        } else {
            list.value = []
        }
    })

    const quickChange = () => {
        generateBody()
        refresh()
        // cancelRequest()
        // if (localKey.value) {
        //     localKey.value = `dirty_${Date.now().toString()}`
        // } else {
        //     refresh()
        // }
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
        cancelRequest,
        error,
        quickChange,
        refresh,
    }
}
