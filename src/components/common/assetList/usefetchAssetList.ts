import { ref, computed, watch } from 'vue'
import { useBody } from '~/composables/discovery/useBody'
import useIndexSearch from '~/composables/discovery/useIndexSearch'
import { assetInterface } from '~/types/assets/asset.interface'
import { assetTypeList } from '~/constant/assetType'

const assetTypeAggregationName = 'group_by_typeName'

export default function useFetchAssetList({
    queryText,
    offset,
    limit,
    facets,
    postFacets,
    aggregations,
    preference,
    isCache,
    dependentKey,
    attributes,
    suppressLogs,
}) {
    const defaultBody = ref({})
    const generateBody = () => {
        const dsl = useBody(
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
            attributes: attributes?.value,
            suppressLogs,
        }
    }
    generateBody()
    const localKey = ref(dependentKey?.value)

    const {
        data,
        refresh,
        aggregationMap,
        approximateCount,
        cancelRequest,
        error,
        isValidating,
        isLoading,
    } = useIndexSearch<assetInterface>(
        defaultBody,
        localKey,
        isCache?.value,
        false,
        1
    )

    const list = ref<assetInterface[]>([])
    watch(data, () => {
        if (offset?.value > 0) {
            if (data.value?.entities) {
                list.value.push(...data.value?.entities)
            }
        } else if (data.value?.entities) {
            list.value = [...data?.value?.entities]
        } else {
            list.value = []
        }
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
    const updateList = (asset) => {
        const index = list.value.findIndex((i) => i.guid === asset.guid)
        if (index > -1) {
            list.value[index] = asset
        }
    }

    const getAggregationList = (
        aggregationKey: string,
        labelList?: any,
        includeWithoutLabel?: Boolean
    ) => {
        const temp = []

        if (labelList.length === 0) {
            // use aggregations fetched from IndexSearch as is
            aggregationMap(aggregationKey).forEach((element) => {
                temp.push({
                    id: element.key,
                    label: element.key,
                    count: element.doc_count,
                })
            })
            return temp
        }
        // Use label-list provided for rendering labels, create a new list with labels from label-list provided and count from response
        const listMap = aggregationMap(aggregationKey).map((i) =>
            i.key.toLowerCase()
        ) // list of aggregated typenames from response

        const defaultListMap = labelList.map((i) => i.id.toLowerCase()) // list of aggregated typenames from label-list

        const diff = defaultListMap.filter((d) => listMap.includes(d) === false)
        const overlap = defaultListMap.filter((d) => listMap.includes(d))

        // Update count
        overlap.forEach((item) => {
            const found = labelList.find(
                (t) => t.id.toLowerCase() === item.toLowerCase()
            )
            if (found) {
                temp.push({
                    ...found,
                    count:
                        aggregationMap(aggregationKey).find(
                            (i) => i.key.toLowerCase() === item.toLowerCase()
                        )?.doc_count ?? 0,
                })
            }
        })
        // 👇 This probably adds count as undefined for types that have 0 count
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
        // sort by count
        temp.sort((a, b) => {
            if (a.count > b.count) {
                return -1
            }
            if (a.count < b.count) {
                return 1
            }
            return 0
        })
        // return list
        return temp
    }
    const assetTypeAggregationList = computed(() =>
        getAggregationList(assetTypeAggregationName, assetTypeList, false)
    )

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

    return {
        list,
        error,
        updateList,
        quickChange,
        isLoadMore,
        isValidating,
        isLoading,
        assetTypeAggregationList,
    }
}
