import bodybuilder from 'bodybuilder'

export function useDiscoveryDSL(filters: Record<string, any>) {
    const query = bodybuilder()
    Object.keys(filters ?? {}).forEach((mkey) => {
        const fltrObj = filters[mkey]
        switch (mkey) {
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
                    query.notQuery('exists', '__traitNames')
                } else if (fltrObj?.checked?.length) {
                    // By default filter for all classifications
                    let attr = '__traitNames'
                    // Else filter only propagated classifications
                    if (fltrObj?.addedBy === 'propagation')
                        attr = '__propagatedTraitNames'

                    if (fltrObj?.operator === 'AND') {
                        fltrObj?.checked?.forEach((val) => {
                            query.filter('term', attr, val)
                        })
                    } else if (fltrObj?.operator === 'OR') {
                        query.filter('terms', attr, fltrObj?.checked)
                    }
                }
                // TODO: Add the classification addedBy filter to the payload
                break
            }
            case 'terms': {
                if (fltrObj?.operator === 'AND') {
                    fltrObj?.checked?.forEach((val) => {
                        query.filter('term', '__meanings', val)
                    })
                } else if (fltrObj?.operator === 'OR') {
                    query.filter('terms', '__meanings', fltrObj?.checked)
                }
                break
            }
            case 'owners': {
                if (fltrObj?.noOwnerAssigned) {
                    query.notQuery('exists', 'Asset.ownerUsers')
                    query.notQuery('exists', 'Asset.ownerGroups')
                }
                const users: string[] = fltrObj.userValue
                if (users?.length)
                    query.filter('terms', 'Asset.ownerUsers', users)

                const groups: string[] = fltrObj.groupValue
                if (groups?.length)
                    query.filter('terms', 'Asset.ownerGroups', groups)

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
    assetType: string,
    applicableTypes: string[]
) {
    const dsl = useDiscoveryDSL(facets)

    if (queryText) {
        dsl.orQuery('match', 'Asset.name', queryText)
        dsl.orQuery('match', '__typeName', queryText)
    }

    // Filter by all applicable types - based on selected category
    // Only if the current tab is not catalog (All)
    if (assetType !== 'Catalog')
        dsl.filter('term', '__typeName.keyword', assetType)
    else dsl.filter('terms', '__typeName.keyword', applicableTypes)

    return dsl.build()
}

export function generateAggregationDSL(
    facets: Record<string, any>,
    queryText: string,
    applicableTypes: string[]
) {
    const dsl = useDiscoveryDSL(facets)

    dsl.filter('terms', '__typeName.keyword', applicableTypes)

    if (queryText) {
        dsl.orQuery('match', 'Asset.name', queryText)
        dsl.orQuery('match', '__typeName', queryText)
    }
    dsl.aggregation('terms', '__typeName.keyword', { size: 20 }, 'typename')
    dsl.size(0)
    return dsl.build()
}
