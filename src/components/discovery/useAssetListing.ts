import axios from 'axios'
import useAssetSearchList from './useSearchList'
import { assetInterface } from '~/types/assets/asset.interface'
import { computed } from 'vue'
import { AssetTypeList } from '~/constant/assetType'
import { BaseAttributes, tableauAttributes } from '~/constant/projection'

export function useAssetListing(
    typeName?: string,
    initialBody?: any,
    immediate: boolean = true,
    cacheSuffx?: string | ''
) {
    const cancelTokenSource = axios.CancelToken.source()

    const { isLoading, query, replaceBody, body, list, searchScoreList } =
        useAssetSearchList(
            {
                typeName: typeName || 'Catalog',
                excludeDeletedEntities: true,
                includeClassificationAttributes: false,
                includeSubClassifications: false,
                includeSubTypes: true,
                limit: 100,
                offset: 0,
                attributes: [...BaseAttributes, ...tableauAttributes],
                entityFilters: {},
                ...initialBody,
            },
            '',
            immediate,
            cancelTokenSource
        )

    function mutateAssetInList(updatedAsset: assetInterface) {
        const idx = list.value.findIndex(
            (ast) => ast.guid === updatedAsset.guid
        )
        if (idx > -1) list.value[idx] = updatedAsset
    }

    return {
        list,
        isLoading,
        query,
        replaceBody,
        body,
        mutateAssetInList,
        searchScoreList,
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
            (accumulator, currentValue) => accumulator + currentValue.count,
            initialValue
        )
        return sum
    })

    function refreshAggregation(newBody: any) {
        const newCriterion = [...newBody.entityFilters?.criterion].filter(
            (item) => item.attributeName !== '__typeName'
        )
        replaceBody({
            ...baseQuery,
            entityFilters: {
                condition: newBody.entityFilters?.condition,
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
