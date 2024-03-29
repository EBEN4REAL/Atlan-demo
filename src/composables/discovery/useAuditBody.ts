/* eslint-disable default-case */
import { isFor } from '@babel/types'
import bodybuilder from 'bodybuilder'
import { ref } from 'vue'

const agg_prefix = 'group_by'

const existsValue = 'NONE'

export function useAuditBody(
    queryText?: string,
    offset?: any,
    limit?: any,
    facets?: Record<string, any>,
    postFacets?: Record<string, any>,
    aggregations?: string[],
    preference?: Record<string, any>
) {
    const base = bodybuilder()
    console.log(base)
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
        console.log(filterObject)
        switch (mkey) {
            case 'entityId': {
                if (filterObject) {
                    base.filter('term', 'entityId', filterObject)
                }
                break
            }
            case 'entityQualifiedName': {
                if (filterObject) {
                    base.filter('bool', (q) => {
                        if (facets?.typeNames?.includes('AtlasGlossary')) {
                            q.orFilter(
                                'wildcard',
                                'entityQualifiedName',
                                `*@${filterObject}`
                            )
                        } else {
                            q.orFilter(
                                'wildcard',
                                'entityQualifiedName',
                                `${filterObject}/*`
                            )
                        }
                        console.log(q)
                        q.orFilter('term', 'entityQualifiedName', filterObject)
                        return q
                    })
                }
                break
            }
            case 'action': {
                if (filterObject) {
                    base.filter('term', 'action', filterObject)
                }
                break
            }
            case 'typeName': {
                console.log('typeName', filterObject)
                if (filterObject) {
                    base.filter('nested', {
                        path: 'detail',
                        ...bodybuilder()
                            .filter(
                                'term',
                                'detail.typeName.keyword',
                                filterObject
                            )
                            .build(),
                    })
                }
                break
            }
            case 'exists': {
                if (filterObject) {
                    base.filter('bool', (q) => {
                        if (filterObject.length > 0)
                            filterObject.forEach((element) => {
                                q.orFilter('nested', {
                                    path: 'detail',
                                    ...bodybuilder()
                                        .filter('exists', element)
                                        .build(),
                                })
                            })
                        return q
                    })
                    // base.filter('nested', (q) => {
                    //     q.filter('bool', (q) => {
                    //         q.orFilter(
                    //             'exists',
                    //             'detail.attributes.userDescription.keyword'
                    //         )
                    //         q.orFilter(
                    //             'exists',
                    //             'detail.attributes.userDescription.keyword'
                    //         )
                    //         return q
                    //     })
                    //     return q
                    // })
                }
                break
            }
        }
    })

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
    // if (
    //     !facets?.typeNames?.includes('AtlasGlossary') &&
    //     !facets?.typeNames?.includes('AtlasGlossaryTerm') &&
    //     !facets?.typeNames?.includes('AtlasGlossaryCategory') &&
    //     !facets?.guid
    // ) {
    //     // Global TypeName Filters
    //     base.orFilter('terms', '__superTypeNames.keyword', ['SQL', 'BI'])
    //     base.orFilter('terms', '__typeName.keyword', [
    //         'Query',
    //         'AtlasGlossaryCategory',
    //         'AtlasGlossaryTerm',
    //         'Connection',
    //     ])
    // }

    base.filterMinimumShouldMatch(1)

    const tempQuery = base.build()

    // const query = {
    //     ...tempQuery,
    //     query: {
    //         function_score: {
    //             query: tempQuery.query,
    //             functions: [
    //                 {
    //                     filter: {
    //                         match: {
    //                             certificateStatus: 'VERIFIED',
    //                         },
    //                     },
    //                     weight: 5,
    //                 },
    //                 {
    //                     filter: {
    //                         match: {
    //                             certificateStatus: 'DRAFT',
    //                         },
    //                     },
    //                     weight: 4,
    //                 },
    //                 {
    //                     filter: {
    //                         match: {
    //                             __typeName: 'Table',
    //                         },
    //                     },
    //                     weight: 5,
    //                 },
    //                 {
    //                     filter: {
    //                         match: {
    //                             __typeName: 'View',
    //                         },
    //                     },
    //                     weight: 5,
    //                 },
    //                 {
    //                     filter: {
    //                         match: {
    //                             __typeName: 'Column',
    //                         },
    //                     },
    //                     weight: 3,
    //                 },
    //                 {
    //                     filter: {
    //                         match: {
    //                             __typeName: 'AtlasGlossaryTerm',
    //                         },
    //                     },
    //                     weight: 4,
    //                 },
    //             ],
    //             boost_mode: 'sum',
    //             score_mode: 'sum',
    //         },
    //     },
    // }

    return tempQuery
}
