import { ref, Ref, watch, computed } from 'vue'

import { generateFilterDSL } from './generateFilterDSL'
import { generatePostFilterDSL } from './generatePostFilterDSL'
import { generateAggregationDSL } from './generateAggregationDSL'

import useIndexSearch from './useIndexSearch'
import { assetTypeList } from '~/constant/assetType'

const assetTypeAggregationName = 'group_by_typeName'

export function useDiscoverList(
    isCache?: boolean | false,
    dependentKey?: Ref<any>,
    queryText?: Ref<any>,
    facets?: Ref<any>,
    aggregations?: Ref<any>,
    postFacets?: Ref<any>,
    limit?: Ref<Number>,
    offset?: Ref<Number>,
    attributes?: Ref<string[]>,
    relationAttributes?: Ref<string[]>
) {
    const defaultBody = ref({
        dsl: {
            size: limit?.value || 20,
            from: offset?.value || 0,
            ...generateFilterDSL(facets?.value),
            ...generateAggregationDSL(),
            ...generatePostFilterDSL(postFacets?.value),
        },
        attributes,
        relationAttributes,
    })

    const {
        data,
        refresh,
        isLoading,
        isValidating,
        aggregationMap,
        approximateCount,
    } = useIndexSearch(defaultBody, dependentKey, isCache)

    const list = ref([])
    watch(data, () => {
        if (offset?.value > 0) {
            if (data.value?.entities) {
                list.value.push(...data.value?.entities)
            }
        } else {
            list.value = [...data?.value?.entities]
        }

        console.log('list', list)
    })

    const getAggregationList = (
        aggregationKey: string,
        labelList?: any,
        includeWithoutLabel?: Boolean
    ) => {
        const listMap = aggregationMap(aggregationKey).map((i) =>
            i.key.toLowerCase()
        )
        const defaultListMap = labelList.map((i) => i.id.toLowerCase())

        const diff = defaultListMap.filter((d) => !listMap.includes(d))
        const overlap = defaultListMap.filter((d) => listMap.includes(d))

        const temp = []
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

        const initialValue = 0
        const sum = temp.reduce(
            (accumulator, currentValue) => accumulator + currentValue.count,
            initialValue
        )
        temp.unshift({
            id: '__all',
            label: 'All',
            count: sum,
        })

        return temp
    }

    const assetTypeAggregationList = computed(() =>
        getAggregationList(assetTypeAggregationName, assetTypeList, false)
    )

    const totalCount = computed(() => {
        if (assetTypeAggregationList.value.length > 0) {
            const all = assetTypeAggregationList.value.find(
                (i) => i.id === '__all'
            )
            return all.count
        }
        return approximateCount
    })

    const isLoadMore = computed(() => {
        if (totalCount.value > list?.value?.length) {
            return true
        }
        return false
    })

    const fetch = () => {
        refresh()
    }

    return {
        queryText,
        limit,
        offset,
        totalCount,
        aggregationMap,
        getAggregationList,
        assetTypeAggregationList,
        isValidating,
        isLoading,
        list,
        data,
        fetch,
        isLoadMore,
    }
}
