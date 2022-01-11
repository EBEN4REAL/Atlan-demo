import { computed, ref, Ref, watch } from 'vue'

import { usePackageBody } from './usePackageBody'

import usePackageIndexSearch from './usePackageIndexSearch'
import { packageType } from '~/constant/packageType'

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
            preference?.value,
            aggregations?.value
        )
        defaultBody.value = {
            ...dsl,
            _source: source?.value,
        }
    }

    const localKey = ref(dependentKey?.value)
    generateBody()

    const {
        data,
        refresh,
        isLoading,
        isValidating,
        cancelRequest,
        error,
        aggregationMap,
    } = usePackageIndexSearch(defaultBody, localKey, isCache, false, 1)

    const list = ref([])

    const hits = computed(() => {
        return data.value?.hits
    })

    watch(
        hits,
        () => {
            console.log('new data', data)
            if (offset?.value > 0) {
                if (data.value?.hits?.hits) {
                    data.value?.hits?.hits.forEach((item) => {
                        list.value.push(item._source)
                    })
                }
            } else {
                if (data.value?.hits?.hits) {
                    const temp = []
                    data.value?.hits?.hits.forEach((item) => {
                        temp.push(item._source)
                    })
                    list.value = temp
                } else {
                    list.value = []
                }
            }
        },
        { deep: true }
    )

    const quickChange = () => {
        generateBody()
        cancelRequest()
        if (localKey.value) {
            localKey.value = `dirty_${Date.now().toString()}`
        } else {
            if (!localKey.value) {
                localKey.value = `dirty_${Date.now().toString()}`
            }
            refresh()
        }
    }

    const getAggregationList = (
        aggregationKey: string,
        labelList?: any,
        includeWithoutLabel?: Boolean
    ) => {
        const temp = []
        if (labelList.length === 0) {
            aggregationMap(aggregationKey).forEach((element) => {
                temp.push({
                    id: element.key,
                    label: element.key,
                    count: element.doc_count,
                })
            })
            return temp
        }

        const listMap = aggregationMap(aggregationKey).map((i) =>
            i.key.toLowerCase()
        )

        const defaultListMap = labelList.map((i) => i.id.toLowerCase())

        const diff = defaultListMap.filter((d) => listMap.includes(d) === false)
        const overlap = defaultListMap.filter((d) => listMap.includes(d))

        overlap.forEach((item) => {
            const found = labelList.find(
                (t) => t.id.toLowerCase() === item.toLowerCase()
            )

            if (found) {
                found.count = aggregationMap(aggregationKey).find(
                    (i) => i.key.toLowerCase() === item.toLowerCase()
                )?.doc_count
                temp.push(found)
            }
        })
        if (includeWithoutLabel) {
            if (diff)
                diff.forEach((item) => {
                    temp.push({
                        id: item,
                        label: item,
                        count: aggregationMap(aggregationKey).find(
                            (i) => i.key.toLowerCase() === item.toLowerCase()
                        )?.doc_count,
                    })
                })
        }
        temp.sort((a, b) => {
            if (a.count > b.count) {
                return -1
            }
            if (a.count < b.count) {
                return 1
            }
            return 0
        })
        return temp
    }

    const getAggregationByType = computed(() => {
        return getAggregationList('by_type', packageType, false)
    })

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
        getAggregationList,
        getAggregationByType,
        hits,
    }
}
