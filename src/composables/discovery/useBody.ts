/* eslint-disable default-case */
import { isFor } from '@babel/types'
import bodybuilder from 'bodybuilder'
import { ref } from 'vue'
import { useConnectionStore } from '~/store/connection'
import { usePersonaStore } from '~/store/persona'
import { usePurposeStore } from '~/store/purpose'

const agg_prefix = 'group_by'

const existsValue = 'NONE'

export function useBody(
    queryText?: string,
    offset?: any,
    limit?: any,
    facets?: Record<string, any>,
    postFacets?: Record<string, any>,
    aggregations?: string[],
    preference?: Record<string, any>,
    globalState?: string[]
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
        base.orQuery('wildcard', 'name', {
            value: `${queryText}*`,
        })
        base.orQuery('match', 'description', {
            query: queryText,
        })
        base.orQuery('match', 'userDescription', {
            query: queryText,
        })
        base.orQuery('match', '__meaningsText', {
            query: queryText,
            boost: 20,
        })

        base.orQuery('match', 'name.stemmed', { query: queryText })
        base.queryMinimumShouldMatch(1)
    }

    base.from(offset || 0)
    base.size(limit || 0)

    const personaStore = usePersonaStore()
    const purposeStore = usePurposeStore()
    const connectionStore = useConnectionStore()

    if (globalState?.length > 0) {
        if (globalState?.length == 2) {
            if (globalState[0] === 'persona') {
                const connectionIdList = personaStore.getConnectionList(
                    globalState[1]
                )

                const getAssetList = personaStore.getAssetList(globalState[1])

                base.filter('bool', (q) => {
                    connectionStore.list
                        .filter((i) => connectionIdList.includes(i.guid))
                        .map((i) => i.attributes.qualifiedName)
                        .forEach((i) => {
                            q.orFilter('term', 'qualifiedName', i)
                        })
                    getAssetList.forEach((i) => {
                        if (i.includes('*')) {
                            q.orFilter('wildcard', 'qualifiedName', i)
                        } else {
                            q.orFilter('wildcard', 'qualifiedName', `${i}/*`)
                            q.orFilter('term', 'qualifiedName', `${i}`)
                        }
                    })

                    return q
                })
            }
            if (globalState[0] === 'purpose') {
                console.log(globalState[1])

                const found = purposeStore.list.find(
                    (i) => i.id === globalState[1]
                )

                console.log(found)

                if (found) {
                    if (found.tags.length > 0) {
                        base.filter('terms', '__traitNames', found.tags)
                        // base.filter('bool', (q) => {
                        //     q.orFilter('terms', '__traitNames', found.tags)
                        // })
                    }
                }
                // const connectionIdList = personaStore.getConnectionList(
                //     globalState[1]
                // )
                // const getAssetList = personaStore.getAssetList(globalState[1])
                // base.filter('bool', (q) => {
                //     connectionStore.list
                //         .filter((i) => connectionIdList.includes(i.guid))
                //         .map((i) => i.attributes.qualifiedName)
                //         .forEach((i) => {
                //             q.orFilter('term', 'qualifiedName', i)
                //         })
                //     getAssetList.forEach((i) => {
                //         if (i.includes('*')) {
                //             q.orFilter('wildcard', 'qualifiedName', i)
                //         } else {
                //             q.orFilter('wildcard', 'qualifiedName', `${i}/*`)
                //             q.orFilter('term', 'qualifiedName', `${i}`)
                //         }
                //     })
                //     return q
                // })
            }
        }
    }

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
                    base.filter('bool', (q) => {
                        q.orFilter(
                            'term',
                            'connectionQualifiedName',
                            filterObject.connectionQualifiedName
                        )

                        q.orFilter(
                            'term',
                            'qualifiedName',
                            filterObject.connectionQualifiedName
                        )

                        return q
                    })
                    // base.filter(
                    //     'term',
                    //     'connectionQualifiedName',
                    //     filterObject.connectionQualifiedName
                    // )
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
                        const temp = []
                        let isExists = false
                        filterObject.forEach((element) => {
                            if (element) {
                                temp.push(element)
                            } else {
                                isExists = true
                            }
                        })
                        base.filter('bool', (q) => {
                            if (temp.length > 0) {
                                q.orFilter('terms', 'certificateStatus', temp)
                            }

                            if (isExists) {
                                q.orFilter('bool', (query) => {
                                    return query.notFilter(
                                        'exists',
                                        'certificateStatus'
                                    )
                                })
                            }

                            return q
                        })
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
                    base.filter('bool', (q) => {
                        if (filterObject.terms?.length > 0)
                            q.orFilter(
                                'terms',
                                '__meanings',
                                filterObject.terms.map(
                                    (term) => term.qualifiedName
                                )
                            )

                        if (filterObject.empty === true) {
                            q.orFilter('bool', (query) => {
                                return query.filter('bool', (query2) => {
                                    query2.notFilter('exists', '__meanings')
                                    return query2
                                })
                            })
                        }
                        return q
                    })
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
                    base.filter('bool', (q) => {
                        q.orFilter('term', '__categories', filterObject)
                        q.orFilter('term', '__parentCategory', filterObject)
                        return q
                    })
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
                            if (!element.operand) return
                            if (element.operator === 'isNull') {
                                base.notFilter('exists', element.operand)
                            }
                            if (element.operator === 'isNotNull') {
                                base.filter('exists', element.operand)
                            }
                            if (
                                element.operator === 'boolean' &&
                                element.operand === '__hasLineage'
                            ) {
                                element.value
                                    ? base.filter('exists', element.operand)
                                    : base.notFilter('exists', element.operand)
                            } else if (
                                element.value != null ||
                                element.value !== ''
                            ) {
                                if (element.operator === 'equals') {
                                    base.filter(
                                        'term',
                                        element.operand,
                                        Array.isArray(element.value)
                                            ? JSON.stringify(element.value)
                                            : element.value
                                    )
                                }
                                if (element.operator === 'notEquals') {
                                    base.notFilter(
                                        'term',
                                        element.operand,
                                        Array.isArray(element.value)
                                            ? JSON.stringify(element.value)
                                            : element.value
                                    )
                                }
                                if (element.operator === 'startsWith') {
                                    base.filter(
                                        'prefix',
                                        element.operand,
                                        Array.isArray(element.value)
                                            ? JSON.stringify(element.value)
                                            : element.value
                                    )
                                }
                                if (element.operator === 'endsWith') {
                                    base.filter(
                                        'wildcard',
                                        element.operand,
                                        `*${Array.isArray(element.value)
                                            ? JSON.stringify(element.value)
                                            : element.value
                                        }`
                                    )
                                }
                                if (element.operator === 'pattern') {
                                    base.filter(
                                        'regexp',
                                        element.operand,
                                        Array.isArray(element.value)
                                            ? JSON.stringify(element.value)
                                            : element.value
                                    )
                                }

                                if (element.operator === 'greaterThan') {
                                    base.filter('range', element.operand, {
                                        gt: Array.isArray(element.value)
                                            ? JSON.stringify(element.value)
                                            : element.value,
                                    })
                                }
                                if (element.operator === 'greaterThanEqual') {
                                    base.filter('range', element.operand, {
                                        gte: Array.isArray(element.value)
                                            ? JSON.stringify(element.value)
                                            : element.value,
                                    })
                                }
                                if (element.operator === 'lessThan') {
                                    base.filter('range', element.operand, {
                                        lt: Array.isArray(element.value)
                                            ? JSON.stringify(element.value)
                                            : element.value,
                                    })
                                }
                                if (element.operator === 'lessThanEqual') {
                                    base.filter('range', element.operand, {
                                        lte: Array.isArray(element.value)
                                            ? JSON.stringify(element.value)
                                            : element.value,
                                    })
                                }
                                if (element.operator === 'boolean') {
                                    if (element.operand === '__state') {
                                        if (element.value) {
                                            state.value = 'DELETED'
                                        } else {
                                            state.value = 'ACTIVE'
                                        }
                                    } else {
                                        base.filter(
                                            'term',
                                            element.operand,
                                            Array.isArray(element.value)
                                                ? JSON.stringify(element.value)
                                                : element.value
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
