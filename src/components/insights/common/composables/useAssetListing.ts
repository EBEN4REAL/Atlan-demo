import { assetInterface } from '~/types/assets/asset.interface'
import { computed, Ref, ref, watch } from 'vue'
import { assetTypeList as AssetTypeList } from '~/constant/assetType'
import useIndexSearch from './useIndexSearch'

export function useAssetListing(
    typeName?: string,
    immediate: boolean = true,
    params: Object = {}
) {
    const list: Ref<assetInterface[]> = ref([])
    const { replaceBody, body, isReady, error, data } = useIndexSearch(
        {},
        '',
        immediate,
        params
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
        error,
        data,
        list,
        isLoading,
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
    const {
        replaceBody,
        data,
        isLoading: isAggregateLoading,
    } = useIndexSearch({}, '', immediate)

    const assetTypeMap = computed(() => {
        return data.value?.aggregations?.typename?.buckets.reduce(
            (acc, bct: { key: string; doc_count: number }) => {
                let typeName =
                    bct.key.charAt(0).toUpperCase() + bct.key.slice(1)
                acc[typeName] = bct.doc_count
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

    function refreshAggregation(query: any) {
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
