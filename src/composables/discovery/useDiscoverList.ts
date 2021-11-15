import { ref, Ref, watch, computed } from 'vue'

// import { generatePostFilterDSL } from './generatePostFilterDSL'
// import { generateAggregationDSL } from './generateAggregationDSL'
import { assetInterface } from '~/types/assets/asset.interface'

import useIndexSearch from './useIndexSearch'
import { assetTypeList } from '~/constant/assetType'
import useAssetStore from '~/store/asset'
import { useBody } from './useBody'
import useGlossaryStore from '~/store/glossary'

const assetTypeAggregationName = 'group_by_typeName'
const glossaryAggregationName = 'group_by_glossary'

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

export function useDiscoverList({
    isCache,
    dependentKey,
    queryText,
    facets,
    postFacets,
    aggregations,
    preference,
    limit,
    offset = ref(0),
    attributes,
    relationAttributes,
}: DiscoverListParams) {
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
    } = useIndexSearch<assetInterface>(defaultBody, localKey, isCache, false, 1)

    const list = ref<assetInterface[]>([])
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

    const assetTypeAggregationList = computed(() =>
        getAggregationList(assetTypeAggregationName, assetTypeList, false)
    )

    const glossaryStore = useGlossaryStore()
    const glossaryAggreationList = computed(() =>
        getAggregationList(glossaryAggregationName, glossaryStore.list, false)
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

    const quickChange = () => {
        generateBody()
        cancelRequest()
        localKey.value = `dirty_${Date.now().toString()}`
    }

    const fetch = () => {
        generateBody()
        refresh()
    }
    const assetStore = useAssetStore()

    const handleSelectedAsset = (item) => {
        assetStore.setSelectedAsset(item)
    }
    const selectedAsset = computed(() => assetStore.selectedAsset)

    const handleSelectedGlossary = (item) => {
        glossaryStore.setSelectedGlossary(item)
    }
    const selectedGlossary = computed(() => glossaryStore.selectedGlossary)

    return {
        queryText,
        limit,
        offset,
        postFacets,
        totalCount,
        aggregationMap,
        getAggregationList,
        assetTypeAggregationList,
        glossaryAggreationList,
        isValidating,
        isLoading,
        list,
        data,
        fetch,
        quickChange,
        cancelRequest,
        isLoadMore,
        handleSelectedAsset,
        selectedAsset,
        handleSelectedGlossary,
        selectedGlossary,
    }
}
