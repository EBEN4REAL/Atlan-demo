/* eslint-disable default-case */
import bodybuilder from 'bodybuilder'

const agg_prefix = 'group_by'

export function useBody(
    queryText?: string,
    offset?: any,
    limit?: any,
    facets?: Record<string, any>,
    postFacets?: Record<string, any>,
    aggregations?: string[]
) {
    const base = bodybuilder()

    if (queryText) {
        base.orQuery('match', 'name', { query: queryText })
        base.orQuery('match', 'name', {
            query: queryText,
            operator: 'AND',
        })
        base.orQuery('match_phrase', 'name', {
            query: queryText,
            boost: 2,
        })
        base.queryMinimumShouldMatch(1)
    }

    base.from(offset || 0)
    base.size(limit || 0)

    //filters
    Object.keys(facets ?? {}).forEach((mkey) => {
        const filterObject = facets[mkey]
        switch (mkey) {
            case 'connector': {
                if (filterObject) {
                    base.filter('term', 'connectorName', filterObject)
                }
                break
            }
            case 'connection': {
                if (filterObject) {
                    base.filter('term', 'connectionQualifiedName', filterObject)
                }
                break
            }
            case 'certificate': {
                if (filterObject) {
                    if (filterObject.length > 0)
                        base.filter('terms', 'certificateStatus', filterObject)
                }
                break
            }
            case 'typeName': {
                if (filterObject) {
                    if (filterObject !== '__all') {
                        base.filter('term', '__typeName.keyword', filterObject)
                    }
                }
                break
            }
            case 'tableQualifiedName': {
                if (filterObject) {
                    base.filter('term', 'tableQualifiedName', filterObject)
                }
                break
            }
            case 'viewQualifiedName': {
                if (filterObject) {
                    base.filter('term', 'viewQualifiedName', filterObject)
                }
                break
            }
        }
    })

    //post filters
    const postFilter = bodybuilder()
    Object.keys(postFacets ?? {}).forEach((mkey) => {
        const filterObject = postFacets[mkey]
        switch (mkey) {
            case 'typeName': {
                if (filterObject) {
                    if (filterObject !== '__all') {
                        postFilter.filter(
                            'term',
                            '__typeName.keyword',
                            filterObject
                        )
                    }
                }
                break
            }
        }
    })
    base.rawOption('post_filter', postFilter.build().query)

    //aggregations

    if (aggregations) {
        console.log(aggregations)
        aggregations?.forEach((mkey) => {
            switch (mkey) {
                case 'typeName': {
                    if (mkey) {
                        base.aggregation(
                            'terms',
                            '__typeName.keyword',
                            { size: 50 },
                            `${agg_prefix}_${mkey}`
                        )
                    }
                    break
                }
                case 'dataType': {
                    if (mkey) {
                        base.aggregation(
                            'terms',
                            'dataType.keyword',
                            { size: 50 },
                            `${agg_prefix}_${mkey}`
                        )
                    }
                    break
                }
            }
        })
    }

    // Global TypeName Filters
    base.orFilter('terms', '__superTypeNames.keyword', ['SQL', 'BI'])
    base.orFilter('terms', '__typeName.keyword', ['Query'])

    base.filterMinimumShouldMatch(1)

    return base.build()
}
