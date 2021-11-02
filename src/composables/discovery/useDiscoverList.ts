import { ref, Ref, watch, computed } from 'vue'

// import { generatePostFilterDSL } from './generatePostFilterDSL'
// import { generateAggregationDSL } from './generateAggregationDSL'

import useIndexSearch from './useIndexSearch'
import { assetTypeList } from '~/constant/assetType'
import useDiscoveryStore from '~/store/discovery'
import { useBody } from './useBody'

const assetTypeAggregationName = 'group_by_typeName'

export function useDiscoverList(
    isCache?: boolean | false,
    dependentKey?: Ref<any>,
    queryText?: Ref<any>,
    facets?: Ref<any>,
    postFacets?: Ref<any>,
    aggregations?: Ref<string[]>,
    limit?: Ref<Number>,
    offset?: Ref<Number>,
    attributes?: Ref<string[]>,
    relationAttributes?: Ref<string[]>
) {
    const defaultBody = ref({})
    console.log(facets)
    const generateBody = () => {
        const dsl = useBody(
            queryText?.value,
            offset?.value,
            limit?.value,
            facets?.value,
            postFacets?.value,
            aggregations?.value
        )
        console.log(dsl)
        defaultBody.value = {
            dsl,
            attributes: attributes?.value,
            relationAttributes: relationAttributes?.value,
        }
    }

    const localKey = ref(dependentKey?.value)

    generateBody()
    const {
        data,
        refresh,
        isLoading,
        isValidating,
        aggregationMap,
        approximateCount,
        cancelRequest,
    } = useIndexSearch(defaultBody, localKey, isCache, false, 1)

    const list = ref([])
    watch(data, () => {
        if (offset?.value > 0) {
            if (data.value?.entities) {
                list.value.push(...data.value?.entities)
            }
        } else {
            if (data.value?.entities) {
                list.value = [...data?.value?.entities]
            } else {
                list.value = []
            }
        }
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
            return all.count || approximateCount.value
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
        localKey.value = `dirty_${Date.now().toString()}`
    }

    const fetch = () => {
        generateBody()
        refresh()
    }
    const discoveryStore = useDiscoveryStore()

    const handleSelectedAsset = (item) => {
        discoveryStore.setSelectedAsset(item)
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
        quickChange,
        cancelRequest,
        isLoadMore,
        handleSelectedAsset,
    }
}
