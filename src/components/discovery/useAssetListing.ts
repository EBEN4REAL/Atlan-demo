import axios from 'axios'
import useAssetSearchList from './useSearchList'
import { assetInterface } from '~/types/assets/asset.interface'
import { computed, Ref, ref, watch } from 'vue'
import { AssetTypeList } from '~/constant/assetType'
import { BaseAttributes, tableauAttributes } from '~/constant/projection'
import useIndexSearch from '~/services/atlas/discovery/useIndexSearch'

export function useAssetListing(
    typeName?: string,
    immediate: boolean = true,
    cacheSuffx?: string | ''
) {
    const list: Ref<assetInterface[]> = ref([])
    const { query, replaceBody, body, isReady, error, data } = useIndexSearch(
        {},
        '',
        immediate
    )

    const isLoading = computed(() => !isReady.value && !error.value)

    function mutateAssetInList(updatedAsset: assetInterface) {
        const idx = list.value.findIndex(
            (ast) => ast.guid === updatedAsset.guid
        )
        if (idx > -1) list.value[idx] = updatedAsset
    }

    watch(data, () => {
        if (body?.value?.dsl.from > 0) {
            list.value = list.value.concat(data?.value?.entities)
        } else if (data.value?.entities) {
            list.value = data.value?.entities
        } else {
            list.value = []
        }
    })

    return {
        data,
        list,
        isLoading,
        query,
        replaceBody,
        body,
        mutateAssetInList,
        searchScoreList: [],
    }
}

export function useAssetAggregation(
    typeName?: string,
    immediate: boolean = true
) {
    const baseQuery = {
        size: 0,
        aggs: {
            typename: {
                terms: {
                    field: '__typeName.keyword',
                    size: 20,
                },
            },
        },
    }

    const {
        replaceBody,
        data,
        isLoading: isAggregateLoading,
    } = useIndexSearch({}, '', immediate)

    const assetTypeMap = computed(() => {
        return data.value?.aggregations?.typename?.buckets.reduce(
            (acc, bct: { key: string; doc_count: number }) => {
                acc[bct.key] = bct.doc_count
                return acc
            },
            {}
        )
    })

    const assetTypeList = computed(() => {
        const tempList = AssetTypeList.filter((item) => item.isDiscoverable)
        tempList.forEach((item) => {
            item.count = assetTypeMap.value[item.id]
        })
        return tempList
    })

    const assetTypeSum = computed(() => {
        const initialValue = 0
        const sum = assetTypeList.value.reduce(
            (accumulator, currentValue) =>
                accumulator + (currentValue?.count || 0),
            initialValue
        )
        return sum
    })

    function refreshAggregation(newBody: any) {
        // const newCriterion = newBody?.entityFilters?.criterion?.filter(
        //     (item) => item.attributeName !== '__typeName'
        // )
        let query = { ...newBody }
        query.dsl = { ...newBody.dsl, ...baseQuery }
        replaceBody(query)
    }

    return {
        assetTypeMap,
        assetTypeList,
        assetTypeSum,
        isAggregateLoading,
        refreshAggregation,
    }
}
