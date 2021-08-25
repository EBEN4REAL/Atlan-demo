import { ref, Ref, watch } from 'vue'
import axios from 'axios'
import useSearchList from './useSearchList'
import { assetInterface } from '~/types/assets/asset.interface'

export default function useAssetList(
    dependentKey?: Ref<any>,
    typeName?: string,
    initialBody?: any,
    cacheSuffx?: string | '',
    isAggregation?: boolean
) {
    const cancelTokenSource = ref(axios.CancelToken.source())
    const list: Ref<assetInterface[]> = ref([])
    const {
        data,
        state,
        STATES,
        isLoading,
        isValidating,
        query,
        replaceFilters,
        replaceBody,
        refresh,
        body,
        assetTypeMap: selfAssetTypeMap,
    } = useSearchList(
        typeName || 'Catalog',
        list,
        [],
        dependentKey,
        initialBody,
        cacheSuffx,
        false,
        cancelTokenSource,
        true
    )

    const aggregationList: Ref<any> = ref([])
    const aggregationBody = {
        limit: 1,
        query: body.value.query,
        excludeDeletedEntities: true,
        aggregationAttributes: ['__typeName.keyword'],
        typeName,
    }
    const {
        assetTypeList,
        searchScoreList,
        assetTypeMap,
        assetTypeSum,
        replaceBody: refreshAggregation,
    } = useSearchList(
        'Catalog',
        aggregationList,
        [],
        data,
        aggregationBody,
        cacheSuffx,
        false,
        cancelTokenSource,
        true
    )

    const isAggregate = ref(false)

    if (isAggregation) {
        isAggregate.value = isAggregation
    }

    watch(data, () => {
        if (isAggregate.value) {
            const newCriterion = [...body.value.entityFilters?.criterion]
            const index = newCriterion.findIndex(
                (item) => item.attributeName === '__typeName'
            )
            if (index > -1) {
                newCriterion.splice(index, 1)
            }
            refreshAggregation({
                limit: 1,
                query: body.value.query,
                excludeDeletedEntities: body.value.excludeDeletedEntities,
                aggregationAttributes: ['__typeName.keyword'],
                typeName,
                entityFilters: {
                    condition: body.value.entityFilters?.condition,
                    criterion: newCriterion,
                },
            })
        }
    })

    function mutateAssetInList(updatedAsset: assetInterface) {
        const idx = list.value.findIndex(
            (ast) => ast.guid === updatedAsset.guid
        )
        if (idx > -1) list.value[idx] = updatedAsset
    }

    return {
        data,
        list,
        state,
        STATES,
        isLoading,
        isValidating,
        query,
        searchScoreList,
        replaceFilters,
        replaceBody,
        refresh,
        body,
        assetTypeList,
        assetTypeSum,
        assetTypeMap,
        selfAssetTypeMap,
        isAggregate,
        mutateAssetInList,
    }
}
