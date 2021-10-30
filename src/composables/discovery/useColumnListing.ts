import { computed, ref, Ref } from 'vue'

import { generateFilterDSL } from './generateFilterDSL'
import { generatePostFilterDSL } from './generatePostFilterDSL'
import { generateAggregationDSL } from './generateAggregationDSL'

import axios, { CancelTokenSource } from 'axios'

import useIndexSearch from './useIndexSearch'

export function useColumnListing(
    cacheKey: Ref<any>,
    queryText: Ref<any>,
    facetMap: Ref<any>,
    limit: Ref<any>,
    offset: Ref<any>,
    totalCount: Ref<any>,
    attributes,
    relationAttributes
) {
    const body = ref({
        dsl: {
            size: limit.value,
            from: offset.value,
            ...generateFilterDSL(facetMap.value),
            ...generateAggregationDSL(facetMap.value),
            post_filter: generatePostFilterDSL(facetMap.value)?.query,
        },
        attributes,
        relationAttributes,
    })

    const { data, list, refresh, isLoading, isValidating } = useIndexSearch(
        body,
        cacheKey,
        true
    )

    const isLoadMore = computed(() => {
        if (list.value.length < totalCount.value) {
            return true
        }
        return false
    })

    const refreshList = () => {
        refresh()
    }

    return {
        queryText,
        limit,
        offset,
        facetMap,
        body,
        isValidating,
        isLoading,
        list,
        data,
        isLoadMore,
        refreshList,
    }
}
