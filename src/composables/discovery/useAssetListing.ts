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

    const selectedAsset = computed(() => discoveryStore.selectedAsset)

    const handleSelectedAsset = (item) => {
        discoveryStore.setSelectedAsset(item)
    }

    return {
        selectedAsset,
        handleFacetDSL,
        handlePostFacetDSL,
        handleAggregationDSL,
        handleSelectedAsset,
    }
}
