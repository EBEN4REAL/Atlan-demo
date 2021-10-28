import { generateFilterDSL } from './generateFilterDSL'
import { generatePostFilterDSL } from './generatePostFilterDSL'
import { generateAggregationDSL } from './generateAggregationDSL'

import { computed } from 'vue'

import { assetTypeList } from '~/constant/assetType'
import useDiscoveryStore from '~/store/discovery'

export function useAssetListing() {
    const discoveryStore = useDiscoveryStore()

    const handleFacetDSL = (facetMap: Record<string, any>) =>
        generateFilterDSL(facetMap)

    const handlePostFacetDSL = (facetMap: Record<string, any>) =>
        generatePostFilterDSL(facetMap)

    const handleAggregationDSL = () => generateAggregationDSL()

    const getAssetTypeList = (
        typenameAggregation: any,
        includeAll: Boolean,
        ignoreCustom: Boolean
    ) => {
        const listMap = typenameAggregation.map((i) => i.key)
        const defaultListMap = assetTypeList.map((i) => i.id.toLowerCase())

        const diff = defaultListMap.filter((d) => !listMap.includes(d))
        const overlap = defaultListMap.filter((d) => listMap.includes(d))

        const temp = []

        overlap.forEach((item) => {
            const found = assetTypeList.find(
                (t) => t.id.toLowerCase() === item.toLowerCase()
            )
            if (found) {
                found.count = typenameAggregation.find(
                    (i) => i.key.toLowerCase() === item.toLowerCase()
                )?.doc_count
                temp.push(found)
            }
        })

        temp.sort((a, b) => {
            if (a.count > b.count) {
                return -1
            }
            if (a.count < b.count) {
                return 1
            }

            return 0
        })

        if (includeAll) {
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
        }

        return temp
    }

    const selectedAsset = computed(() => discoveryStore.selectedAsset)

    const handleSelectedAsset = (item) => {
        discoveryStore.setSelectedAsset(item)
    }

    return {
        selectedAsset,
        handleFacetDSL,
        handlePostFacetDSL,
        handleAggregationDSL,
        getAssetTypeList,
        handleSelectedAsset,
    }
}
