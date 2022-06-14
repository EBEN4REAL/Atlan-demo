import { ref, Ref, watch, computed } from 'vue'

// import { generatePostFilterDSL } from './generatePostFilterDSL'
// import { generateAggregationDSL } from './generateAggregationDSL'
import { assetInterface } from '~/types/assets/asset.interface'

import useIndexSearch from './useIndexSearch'

import { useSimilarBody } from './useSimilarBody'
import useAssetInfo from '~/composables/discovery/useAssetInfo'

interface SimilarListParams {
    facets?: Ref<any>
    aggregations?: Ref<string[]>
    limit?: Ref<Number>
    offset?: Ref<Number>
}

export function useSimilarList({
    facets,
    aggregations,
    limit,
    offset = ref(0),
}: SimilarListParams) {
    const defaultBody = ref({})
    const generateBody = () => {
        const dsl = useSimilarBody(
            offset?.value,
            limit?.value,
            facets.value,
            aggregations?.value
        )
        defaultBody.value = {
            dsl,
            attributes: [],
            relationAttributes: [],
            suppressLogs: true,
        }
    }

    const localKey = ref(null)

    generateBody()
    const {
        data,
        refresh,
        mutate,
        isLoading,
        isReady,
        isValidating,
        aggregationMap,
        approximateCount,
        cancelRequest,
        error,
    } = useIndexSearch<assetInterface>(defaultBody, localKey, false, false, 0)

    const list = ref<assetInterface[]>([])

    watch(data, () => {
        if (offset?.value > 0) {
            if (aggregationMap(`group_by_name`)) {
                list.value.push(...aggregationMap(`group_by_name`))
            }
        } else if (aggregationMap(`group_by_name`)) {
            list.value.push(...aggregationMap(`group_by_name`))
        } else {
            list.value = []
        }
    })

    const totalCount = computed(() => approximateCount.value)

    const isLoadMore = computed(() => {
        if (totalCount.value > list?.value?.length) {
            return true
        }
        return false
    })

    const similarList = (key) => aggregationMap(`group_by_${key}`)

    const descriptionSimilarList = () => {
        let list = aggregationMap(`group_by_userDescription`)
            .map((i) => {
                if (i.group_by_userDescription?.hits?.hits?.length > 0) {
                    return {
                        key: i.group_by_userDescription?.hits?.hits[0]._source
                            .userDescription,
                        doc_count: i.doc_count,
                    }
                }
                return {
                    key: i.key,
                    doc_count: i.doc_count,
                }
            })
            .concat(
                aggregationMap(`group_by_description`).map((i) => {
                    if (i.group_by_description?.hits?.hits?.length > 0) {
                        return {
                            key: i.group_by_description?.hits?.hits[0]._source
                                .description,
                            doc_count: i.doc_count,
                        }
                    }
                    return {
                        key: i.key,
                        doc_count: i.doc_count,
                    }
                })
            )

        return list.filter((i) => i.key !== '')
    }

    const { title } = useAssetInfo()

    const similarListByName = (asset) => {
        const suggestion = list.value.find(
            (item) => title(asset)?.toLowerCase() === item?.key
        )

        if (
            suggestion?.group_by_description?.buckets ||
            suggestion?.group_by_userDescription?.buckets
        ) {
            const descriptionList =
                suggestion?.group_by_userDescription?.buckets
                    .map((i) => {
                        if (
                            i?.group_by_userDescription?.hits?.hits?.length > 0
                        ) {
                            return {
                                key: i?.group_by_userDescription?.hits?.hits[0]
                                    ._source?.userDescription,
                                doc_count: i?.doc_count,
                            }
                        }
                        return {
                            key: i?.key,
                            doc_count: i?.doc_count,
                        }
                    })
                    .concat(
                        suggestion?.group_by_description?.buckets.map((i) => {
                            if (
                                i?.group_by_description?.hits?.hits?.length > 0
                            ) {
                                return {
                                    key: i?.group_by_description?.hits?.hits[0]
                                        ._source?.description,
                                    doc_count: i?.doc_count,
                                }
                            }
                            return {
                                key: i?.key,
                                doc_count: i?.doc_count,
                            }
                        })
                    )

            return descriptionList?.filter((i) => i?.key !== '')
        }

        return []
    }
    // aggregationMap(`group_by_userDescription`).concat(
    //     aggregationMap('group_by_description')
    // )

    const quickChange = () => {
        generateBody()
        cancelRequest()

        mutate()
    }

    const fetch = () => {
        generateBody()
        refresh()
    }

    return {
        limit,
        offset,
        totalCount,
        aggregationMap,
        isValidating,
        isLoading,
        list,
        data,
        isReady,
        fetch,
        quickChange,
        cancelRequest,
        isLoadMore,
        similarList,
        descriptionSimilarList,
        error,
        similarListByName,
    }
}
