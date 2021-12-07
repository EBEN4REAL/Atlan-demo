import { ref, Ref, watch, computed } from 'vue'

// import { generatePostFilterDSL } from './generatePostFilterDSL'
// import { generateAggregationDSL } from './generateAggregationDSL'

import useIndexSearch from './useIndexSearch'

import { Entity } from '~/services/meta/entity'

import { useAuditBody } from './useAuditBody'
import axios from 'axios'
import { useOptions } from '~/services/api/common'
import LocalStorageCache from 'swrv/dist/cache/adapters/localStorage'

const assetTypeAggregationName = 'group_by_typeName'
const glossaryAggregationName = 'group_by_glossary'

interface DiscoverListParams {
    guid: string
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

export function useAssetAuditSearch({
    guid,
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
        const dsl = useAuditBody(
            queryText?.value,
            offset?.value,
            limit?.value,
            facets?.value,
            postFacets?.value,
            aggregations?.value,
            preference?.value
        )
        defaultBody.value = {
            dsl,
        }
    }

    const localKey = ref(dependentKey?.value)

    const options: useOptions = {}

    let cancel = axios.CancelToken.source()
    options.options = ref({
        cancelToken: cancel.token,
    })

    if (!isCache) {
        if (dependentKey) {
            if (!dependentKey.value) {
                options.asyncOptions = ref({
                    immediate: false,
                })
            }
        } else {
            options.asyncOptions = ref({
                immediate: true,
            })
        }
    } else {
        options.cacheOptions = ref({
            dedupingInterval: 0,
            shouldRetryOnError: false,
            revalidateOnFocus: false,
            ttl: 1,
            revalidateDebounce: 0,
        })
        options.cacheKey = dependentKey
    }

    generateBody()
    const { data, mutate, error, isLoading, isValidating, isReady } =
        Entity.AuditSearch(guid, defaultBody, options)

    const list = ref([])
    watch(data, () => {
        console.log(data)
        // if (offset?.value > 0) {
        //     if (data.value?.entities) {
        //         list.value.push(...data.value?.entities)
        //     }
        // } else {
        //     if (data.value?.entities) {
        //         list.value = [...data?.value?.entities]
        //     } else {
        //         list.value = []
        //     }
        // }
    })

    const cancelRequest = () => {
        if (cancel) {
            cancel.cancel('operation cancelled')
        }
        cancel = axios.CancelToken.source()
        options.options.value = {
            cancelToken: cancel.token,
        }
    }

    const refresh = () => {
        cancelRequest()
        mutate()
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

    const totalCount = computed(() => {
        if (assetTypeAggregationList.value.length > 0) {
            const type = postFacets?.value.typeName || '__all'
            const typeName = assetTypeAggregationList.value.find(
                (i) => i.id === type
            )
            return typeName?.count || approximateCount.value
        }
        return approximateCount.value
    })

    const isLoadMore = computed(() => {
        if (totalCount.value > list?.value?.length) {
            return true
        }
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

    const aggregationMap = (key, isNested?) => {
        if (data?.value?.aggregations) {
            if (data?.value?.aggregations[key]) {
                if (isNested) {
                    return data?.value?.aggregations[key]?.nested_group?.buckets
                } else {
                    return data?.value?.aggregations[key].buckets
                }
            }
        }
        return []
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
        aggregationMap,
        getAggregationList,

        isValidating,
        isLoading,
        list,
        data,
        fetch,
        quickChange,
        cancelRequest,
        isLoadMore,

        error,
        refresh,
    }
}
