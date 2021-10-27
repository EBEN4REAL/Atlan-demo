import { generateFilterDSL } from './generateFilterDSL'
import { generatePostFilterDSL } from './generatePostFilterDSL'
import { generateAggregationDSL } from './generateAggregationDSL'

import { assetTypeList } from '~/constant/assetType'

export function useAssetListing() {
    const handleFacetDSL = (facetMap: Record<string, any>) => {
        return generateFilterDSL(facetMap)
    }

    const handlePostFacetDSL = (facetMap: Record<string, any>) => {
        return generatePostFilterDSL(facetMap)
    }

    const handleAggregationDSL = (facetMap: Record<string, any>) => {
        return generateAggregationDSL(facetMap)
    }

    const getAssetTypeList = (
        typenameAggregation: any,
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
        return temp
    }

    return {
        handleFacetDSL,
        handlePostFacetDSL,
        handleAggregationDSL,
        getAssetTypeList,
    }
}
