import { ref, Ref, watch, computed } from 'vue'

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
        }
    }

    const localKey = ref(dependentKey?.value)

    generateBody()

    const { data, refresh, isLoading, isValidating, cancelRequest, error } =
        usePackageIndexSearch(defaultBody, localKey, isCache, false, 1)

    const list = ref([])

    // For column widget
    const freshList = ref([])

    watch(data, () => {
        if (offset?.value > 0) {
            data.value?.hits.hits.forEach((item) => {
                list.value.push(item._source)
            })
        } else if (data.value?.hits.hits) {
            const temp = []
            data.value?.hits.hits.forEach((item) => {
                temp.push(item._source)
            })
            list.value = temp
        } else {
            list.value = []
        }
    })

    const totalCount = computed(() => {
        // if (assetTypeAggregationList.value.length > 0) {
        //     const type = postFacets?.value.typeName || '__all'
        //     const typeName = assetTypeAggregationList.value.find(
        //         (i) => i.id === type
        //     )
        //     return typeName?.count || approximateCount.value
        // }
        // return approximateCount.value
    })

    const isLoadMore = computed(() => {
        // if (totalCount.value > list?.value?.length) {
        //     return true
        // }
        return false
    })

    const quickChange = () => {
        generateBody()
        cancelRequest()

        if (localKey.value) {
            localKey.value = `dirty_${Date.now().toString()}`
        } else {
            refresh()
        }
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
        totalCount,

        isValidating,
        isLoading,
        list,
        freshList,
        data,
        fetch,
        quickChange,
        cancelRequest,
        isLoadMore,

        error,
    }
}
