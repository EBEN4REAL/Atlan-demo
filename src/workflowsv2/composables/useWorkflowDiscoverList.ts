import { computed, ref, Ref, watch } from 'vue'

import { usePackageBody } from './usePackageBody'

import useWorkflowIndexSearch from './useWorkflowIndexSearch'

interface DiscoverListParams {
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
    immediate?: boolean
}

export function useWorkflowDiscoverList({
    queryText,
    facets,
    postFacets,
    aggregations,
    preference,
    limit,
    source,
    offset = ref(0),
    immediate,
}: DiscoverListParams) {
    const defaultBody = ref({})

    const generateBody = () => {
        const dsl = usePackageBody(
            queryText?.value,
            offset?.value,
            limit?.value,
            facets?.value,
            postFacets?.value,
            preference?.value,
            aggregations?.value
        )
        defaultBody.value = {
            ...dsl,
            _source: source?.value,
        }
    }

    generateBody()

    const { data, refresh, isLoading, isValidating, cancelRequest, error } =
        useWorkflowIndexSearch(defaultBody, immediate)

    const list = ref([])

    watch(data, () => {
        if (offset?.value > 0) {
            data.value?.hits.hits.forEach((item) => {
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
    })

    const packageList = computed(() => {
        const temp = {}
        data.value?.aggregations?.by_package?.by_package?.buckets?.forEach(
            (element) => {
                temp[element.key] = element.doc_count
            }
        )
        return temp
    })

    const workflowMapByPackage = computed(() => {
        let temp = {}
        data.value?.aggregations?.by_package?.by_package?.buckets?.forEach(
            (element) => {
                const list = element?.by_package_hits?.hits?.hits?.map(
                    (i) => i._source.name
                )
                temp[element.key] = list
                // temp = temp.concat(element?.by_package?.buckets)
            }
        )
        return temp
    })

    const workflowDistinctList = computed(() => {
        let temp = []
        data.value?.aggregations?.by_package?.by_package?.buckets?.forEach(
            (element) => {
                temp = temp.concat(
                    element?.by_package_hits?.hits?.hits?.map(
                        (i) => i._source.name
                    )
                )
                // temp = temp.concat(element?.by_package?.buckets)
            }
        )
        return temp
    })

    const quickChange = () => {
        generateBody()
        cancelRequest()
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
        cancelRequest,
        error,
        quickChange,
        refresh,
        packageList,
        workflowDistinctList,
        workflowMapByPackage,
    }
}
