import bodybuilder from 'bodybuilder'

export function useDiscoveryDSL(filters: Record<string, any>) {
    const query = bodybuilder()
    Object.keys(filters ?? {}).forEach((mkey) => {
        const fltrObj = filters[mkey]
        switch (mkey) {
            case 'connector': {
                break
            }
            case 'saved': {
                break
            }
            case 'status': {
                const statuses: string[] = fltrObj.checked
                if (statuses?.includes('is_null')) statuses.push('isNull')

                if (statuses?.length)
                    query.filter('terms', 'Asset.certificateStatus', statuses)

                break
            }
            case 'classifications': {
                // We use individual `term` filter when using AND operator
                // and `terms` filter when it is OR operator
                if (fltrObj?.noClassificationsAssigned) {
                    query.notQuery('exists', 'field', '__traitNames')
                } else if (fltrObj?.checked?.length) {
                    if (fltrObj?.operator === 'AND') {
                        fltrObj?.checked?.forEach((val) => {
                            query.filter('term', '__traitNames', val)
                        })
                    } else if (fltrObj?.operator === 'OR') {
                        query.filter('terms', '__traitNames', fltrObj?.checked)
                    }
                }
                // TODO: Add the classification addedBy filter to the payload
                break
            }
            case 'terms': {
                const terms: string[] = fltrObj
                if (terms?.length) query.filter('terms', '__meanings', terms)

                break
            }
            case 'owners': {
                break
            }
            case 'advanced': {
                break
            }
            // for BM
            default: {
            }
        }
    })
    query.queryMinimumShouldMatch(1)
    return query
}

export function generateAssetQueryDSL(
    facets: Record<string, any>,
    queryText: string,
    assetType: string
) {
    const dsl = useDiscoveryDSL(facets)
    if (queryText) {
        dsl.orQuery('match', 'Asset.name', queryText)
        dsl.orQuery('match', '__typeName', queryText)
    }
    if (assetType !== 'Catalog') {
        dsl.filter('term', '__typeName.keyword', assetType)
    }
    return dsl.build()
}

export function generateAggregationDSL(
    facets: Record<string, any>,
    queryText: string
) {
    const dsl = useDiscoveryDSL(facets)
    if (queryText) {
        dsl.orQuery('match', 'Asset.name', queryText)
        dsl.orQuery('match', '__typeName', queryText)
    }
    dsl.aggregation('terms', '__typeName.keyword', { size: 20 }, 'typename')
    dsl.size(0)
    return dsl.build()
}
