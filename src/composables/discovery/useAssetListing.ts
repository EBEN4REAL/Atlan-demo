import { generateDSLFromFacet } from './generateDSLFromFacet'

export function useAssetListing() {
    const handleFacetDSL = (facetMap: Record<string, any>) => {
        return generateDSLFromFacet(facetMap)
    }

    return {
        handleFacetDSL,
    }
}
