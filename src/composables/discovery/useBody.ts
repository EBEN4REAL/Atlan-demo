/* eslint-disable default-case */
import { isFor } from '@babel/types'
import bodybuilder from 'bodybuilder'
import { ref } from 'vue'

const agg_prefix = 'group_by'

const existsValue = 'NONE'

export function useBody(
    queryText?: string,
    offset?: any,
    limit?: any,
    facets?: Record<string, any>,
    postFacets?: Record<string, any>,
    aggregations?: string[],
    preference?: Record<string, any>
) {
    const base = bodybuilder()

    if (queryText) {
        base.orQuery('match', 'name', {
            query: queryText,
            boost: 40,
            analyzer: 'search_synonyms',
        })
        base.orQuery('match', 'name', {
            query: queryText,
            boost: 40,
        })

        base.orQuery('match', 'name', {
            query: queryText,
            operator: 'AND',
            boost: 40,
        })
        base.orQuery('match', 'name.keyword', {
            query: queryText,
            boost: 100,
        })
        base.orQuery('match_phrase', 'name', {
            query: queryText,
            boost: 70,
        })
        base.orQuery('wildcard', 'name.keyword', {
            value: `${queryText}*`,
        })
        base.orQuery('match', 'description', {
            query: queryText,
        })
        base.orQuery('match', 'userDescription', {
            query: queryText,
        })
        base.orQuery('match', 'name.stemmed', { query: queryText })
        base.queryMinimumShouldMatch(1)
    }

    base.from(offset || 0)
    base.size(limit || 0)

    // Only showing ACTIVE assets for a connection

    const state = ref('ACTIVE')

    //filters
    Object.keys(facets ?? {}).forEach((mkey) => {
        const filterObject = facets[mkey]
        switch (mkey) {
            case 'hierarchy': {
                if (filterObject.connectorName) {
                    base.filter(
                        'term',
                        'connectorName',
                        filterObject.connectorName
                    )
                }
                if (filterObject.connectionQualifiedName) {
                    base.filter(
                        'term',
                        'connectionQualifiedName',
                        filterObject.connectionQualifiedName
                    )
                }
                break
            }
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
            case 'certificateStatus': {
                if (filterObject) {
                    if (filterObject.length > 0) {
                        const index = filterObject.indexOf(existsValue)
                        if (index > -1) {
                            const temp = []
                            filterObject.forEach((element) => {
                                if (element !== existsValue) {
                                    temp.push(element)
                                }
                            })
                            base.filter('bool', (q) => {
                                if (temp.length > 0) {
                                    q.orFilter(
                                        'terms',
                                        'certificateStatus',
                                        temp
                                    )
                                }

                                q.orFilter('bool', (query) => {
                                    return query.notFilter(
                                        'exists',
                                        'certificateStatus'
                                    )
                                })
                                return q
                            })
                        } else {
                            base.filter(
                                'terms',
                                'certificateStatus',
                                filterObject
                            )
                        }
                    }
                }
                break
            }
            case 'owners': {
                if (filterObject) {
                    base.filter('bool', (q) => {
                        if (filterObject.ownerUsers?.length > 0)
                            q.orFilter(
                                'terms',
                                'ownerUsers',
                                filterObject.ownerUsers
                            )

                        if (filterObject.ownerGroups?.length > 0)
                            q.orFilter(
                                'terms',
                                'ownerGroups',
                                filterObject.ownerGroups
                            )
                        if (filterObject.empty === true) {
                            q.orFilter('bool', (query) => {
                                return query.filter('bool', (query2) => {
                                    query2.notFilter('exists', 'ownerUsers')
                                    query2.notFilter('exists', 'ownerGroups')
                                    return query2
                                })
                            })
                        }
                        return q
                    })
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
            case 'typeNames': {
                if (filterObject) {
                    base.filter('terms', '__typeName.keyword', filterObject)
                }
                break
            }
            case '__traitNames': {
                if (filterObject) {
                    base.filter('bool', (q) => {
                        if (filterObject.classifications?.length > 0)
                            q.orFilter(
                                'terms',
                                '__traitNames',
                                filterObject.classifications
                            )

                        if (filterObject.empty === true) {
                            q.orFilter('bool', (query) => {
                                return query.filter('bool', (query2) => {
                                    query2.notFilter('exists', '__traitNames')
                                    return query2
                                })
                            })
                        }
                        return q
                    })
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
            case 'glossary': {
                if (filterObject) {
                    base.filter('term', '__glossary', filterObject)
                }
                break
            }
            case 'category': {
                if (filterObject) {
                    base.filter('term', '__categories', filterObject)
                }
                break
            }
            case 'terms': {
                if (filterObject) {
                    base.filter('term', '__meanings', filterObject)
                }
                break
            }
            case 'isRootTerm': {
                if (filterObject) {
                    base.notFilter('exists', '__categories')
                }
                break
            }
            case 'isRootCategory': {
                if (filterObject) {
                    base.notFilter('exists', '__parentCategory')
                }
                break
            }

            case 'parentCategory': {
                if (filterObject) {
                    base.orFilter('term', '__categories', filterObject)
                    base.orFilter('term', '__parentCategory', filterObject)
                }
                break
            }
            case 'guid': {
                if (filterObject) {
                    base.filter('term', '__guid', filterObject)
                }
                break
            }
            case 'guidList': {
                if (filterObject) {
                    base.filter('terms', '__guid', filterObject)
                }
                break
            }
            case 'column':
            case 'table':
            case 'sql':
            default: {
                if (filterObject) {
                    Object.keys(filterObject).forEach((key) => {
                        filterObject[key].forEach((element) => {
                            if (element.operator === 'isNull') {
                                base.notFilter('exists', element.operand)
                            }
                            if (element.operator === 'isNotNull') {
                                base.filter('exists', element.operand)
                            } else if (element.value) {
                                if (element.operator === 'equals') {
                                    base.filter(
                                        'term',
                                        element.operand,
                                        element.value
                                    )
                                }
                                if (element.operator === 'notEquals') {
                                    base.notFilter(
                                        'term',
                                        element.operand,
                                        element.value
                                    )
                                }
                                if (element.operator === 'startsWith') {
                                    base.filter(
                                        'prefix',
                                        element.operand,
                                        element.value
                                    )
                                }
                                if (element.operator === 'endsWith') {
                                    base.filter(
                                        'wildcard',
                                        element.operand,
                                        `*${element.value}`
                                    )
                                }
                                if (element.operator === 'pattern') {
                                    base.filter(
                                        'regexp',
                                        element.operand,
                                        element.value
                                    )
                                }

                                if (element.operator === 'greaterThan') {
                                    base.filter('range', element.operand, {
                                        gt: element.value,
                                    })
                                }
                                if (element.operator === 'greaterThanEqual') {
                                    base.filter('range', element.operand, {
                                        gte: element.value,
                                    })
                                }
                                if (element.operator === 'lessThan') {
                                    base.filter('range', element.operand, {
                                        lt: element.value,
                                    })
                                }
                                if (element.operator === 'lessThanEqual') {
                                    base.filter('range', element.operand, {
                                        lte: element.value,
                                    })
                                }
                                if (element.operator === 'boolean') {
                                    if (
                                        element.operand === '__state' &&
                                        element.value
                                    ) {
                                        state.value = 'DELETED'
                                    } else {
                                        base.filter(
                                            'term',
                                            element.operand,
                                            element.value
                                        )
                                    }
                                }
                            }
                        })
                    })
                }
                break
            }
        }
    })

    base.filter('term', '__state', state.value)

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
            case 'dataType': {
                if (filterObject) {
                    if (filterObject !== '__all') {
                        postFilter.filter('term', 'dataType', filterObject)
                    }
                }
                break
            }
            case 'glossary': {
                if (filterObject) {
                    if (filterObject !== '__all') {
                        postFilter.filter('term', '__glossary', filterObject)
                    }
                }
                break
            }
        }
    })
    base.rawOption('post_filter', postFilter.build().query)

    //aggregations

    if (aggregations) {
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
                            'dataType',
                            { size: 50 },
                            `${agg_prefix}_${mkey}`
                        )
                    }
                    break
                }
                case 'glossary': {
                    if (mkey) {
                        base.aggregation(
                            'terms',
                            '__glossary',
                            { size: 50 },
                            `${agg_prefix}_${mkey}`
                        )
                    }
                    break
                }
            }
        })
    }

    //preferences
    Object.keys(preference ?? {}).forEach((mkey) => {
        const filterObject = preference[mkey]
        switch (mkey) {
            case 'sort': {
                if (filterObject !== 'default') {
                    const split = filterObject.split('-')
                    if (split.length > 1) {
                        base.sort(split[0], split[1])
                    }
                }
                break
            }
        }
    })

    if (
        !facets?.typeNames?.includes('AtlasGlossary') &&
        !facets?.typeNames?.includes('AtlasGlossaryTerm') &&
        !facets?.typeNames?.includes('AtlasGlossaryCategory') &&
        !facets?.guid
    ) {
        // Global TypeName Filters
        base.orFilter('terms', '__superTypeNames.keyword', ['SQL', 'BI'])
        base.orFilter('terms', '__typeName.keyword', [
            'Query',
            'AtlasGlossaryCategory',
            'AtlasGlossaryTerm',
            'Connection',
        ])
    }

    base.filterMinimumShouldMatch(1)

    const tempQuery = base.build()

    const query = {
        ...tempQuery,
        query: {
            function_score: {
                query: tempQuery.query,
                functions: [
                    {
                        filter: {
                            match: {
                                certificateStatus: 'VERIFIED',
                            },
                        },
                        weight: 5,
                    },
                    {
                        filter: {
                            match: {
                                certificateStatus: 'DRAFT',
                            },
                        },
                        weight: 4,
                    },
                    {
                        filter: {
                            match: {
                                __typeName: 'Table',
                            },
                        },
                        weight: 5,
                    },
                    {
                        filter: {
                            match: {
                                __typeName: 'View',
                            },
                        },
                        weight: 5,
                    },
                    {
                        filter: {
                            match: {
                                __typeName: 'Column',
                            },
                        },
                        weight: 3,
                    },
                    {
                        filter: {
                            match: {
                                __typeName: 'AtlasGlossaryTerm',
                            },
                        },
                        weight: 4,
                    },
                ],
                boost_mode: 'sum',
                score_mode: 'sum',
            },
        },
    }

    return query
}
