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
        if (body?.value?.offset > 0) {
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
    const aggregationCancelTokenSource = axios.CancelToken.source()
    const baseQuery = {
        limit: 1,
        offset: 0,
        excludeDeletedEntities: true,
        aggregationAttributes: ['__typeName.keyword'],
        typeName,
    }

    const {
        isLoading: isAggregateLoading,
        replaceBody,
        data,
    } = useAssetSearchList(
        baseQuery,
        '',
        immediate,
        aggregationCancelTokenSource
    )

    const assetTypeMap = computed(() => {
        if (data.value?.aggregations) {
            return data.value?.aggregations['__typeName.keyword']
        }
        return {}
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
        const newCriterion = newBody?.entityFilters?.criterion?.filter(
            (item) => item.attributeName !== '__typeName'
        )
        replaceBody({
            ...baseQuery,
            query: newBody.query,
            typeName: newBody.typeName,
            termName: newBody.termName,
            entityFilters: {
                condition: newBody?.entityFilters?.condition,
                criterion: newCriterion,
            },
        })
    }

    return {
        assetTypeMap,
        assetTypeList,
        assetTypeSum,
        isAggregateLoading,
        refreshAggregation,
    }
}
