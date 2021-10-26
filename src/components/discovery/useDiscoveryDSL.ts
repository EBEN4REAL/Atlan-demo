import bodybuilder, { Bodybuilder } from 'bodybuilder'
import { ISearchOperators } from '~/constant/advancedAttributes'

function operatorToDSL(
    query: Bodybuilder,
    operator: ISearchOperators,
    attribute: string,
    value: string
) {
    if (operator === 'eq') return query.filter('term', attribute, value)
    else if (operator === 'neq') return query.notQuery('term', attribute, value)
    else if (operator === 'isNull')
        return query.notQuery('exists', 'field', value)
    else if (operator === 'notNull')
        return query.query('exists', 'field', value)
    else if (['gt', 'lt', 'gte', 'lte'].includes(operator))
        return query.query('range', attribute, { [operator]: value })
}

export function useDiscoveryDSL(filters: Record<string, any>) {
    const query = bodybuilder()
    Object.keys(filters ?? {}).forEach((mkey) => {
        const fltrObj = filters[mkey]
        switch (mkey) {
            case 'connector': {
                const conn = fltrObj
                if (conn.attributeValue)
                    query.filter(
                        'term',
                        conn.attributeName,
                        conn.attributeValue
                    )
                break
            }
            case 'saved': {
                break
            }
            case 'status': {
                const statuses: string[] = fltrObj.checked
                if (statuses?.includes('is_null')) statuses.push('isNull')

                if (statuses?.length)
                    query.filter('terms', 'certificateStatus', statuses)

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
                if (fltrObj?.checked?.length) {
                    if (fltrObj?.operator === 'AND') {
                        fltrObj?.checked?.forEach((val) => {
                            query.filter('term', '__meanings', val)
                        })
                    } else if (fltrObj?.operator === 'OR') {
                        query.filter('terms', '__meanings', fltrObj?.checked)
                    }
                }
                break
            }
            case 'owners': {
                if (fltrObj?.noOwnerAssigned) {
                    query.notQuery('exists', 'ownerUsers')
                    query.notQuery('exists', 'ownerGroups')
                }
                const users: string[] = fltrObj.userValue
                if (users?.length) query.filter('terms', 'ownerUsers', users)

                const groups: string[] = fltrObj.groupValue
                if (groups?.length) query.filter('terms', 'ownerGroups', groups)

                break
            }
            case 'advanced': {
                Object.keys(fltrObj?.applied || {})?.forEach((key) => {
                    const fl = fltrObj?.applied[key]
                    Object.keys(fl).forEach((flk) => {
                        operatorToDSL(
                            query,
                            flk as ISearchOperators,
                            key,
                            fl[flk]
                        )
                    })
                })
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
        dsl.orQuery('match', 'name', queryText)
        dsl.orQuery('match', '__typeName', queryText)
    }

    // Filter by all applicable types - based on selected category
    // Only if the current tab is not catalog (All)
    // if (assetType !== 'Catalog')
    //     dsl.filter('term', '__typeName.keyword', assetType)
    // else dsl.filter('terms', '__typeName.keyword', applicableTypes)

    return dsl.build()
}

export function generateAssetPostQueryDSL(
    facets: Record<string, any>,
    queryText: string,
    assetType: string,
    applicableTypes: string[]
) {
    const dsl = bodybuilder()

    // Filter by all applicable types - based on selected category
    // Only if the current tab is not catalog (All)
    if (assetType !== 'Catalog')
        dsl.filter('term', '__typeName.keyword', assetType)
    else dsl.filter('terms', '__typeName.keyword', applicableTypes)

    return dsl.build()
}

export function generateAggregationDSL() {
    const dsl = bodybuilder()
    dsl.aggregation('terms', '__typeName.keyword', { size: 100 }, 'typename')
    // dsl.aggregation('terms', 'certificateStatus', { size: 100 }, 'certificate')
    return dsl.build()
}
