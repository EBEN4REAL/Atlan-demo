/* eslint-disable default-case */
import { isFor } from '@babel/types'
import bodybuilder from 'bodybuilder'
import { ref } from 'vue'
import { useUtils } from '~/components/governance/personas/assets/useUtils'
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
        let tempQuery = queryText
        if (
            (queryText[0] === "'" && queryText[queryText.length - 1] === "'") ||
            (queryText[0] === '"' && queryText[queryText.length - 1] === '"')
        ) {
            base.query('query_string', {
                fields: [
                    'name.*',
                    'description',
                    'userDescription',
                    '__meaningsText',
                    '__guid',
                ],
                query: queryText,
            })
        } else {
            if (queryText.includes('.')) {
                const split = queryText.split('.')
                if (split.length === 2) {
                    base.filter('term', 'schemaName.keyword', split[0])
                    tempQuery = split[1]
                }
            }

            // Synonym
            base.orQuery('match', 'name', {
                query: tempQuery.toLowerCase(),
                boost: 40,
                analyzer: 'search_synonyms',
            })

            base.orQuery('match', 'name', {
                query: tempQuery,
                boost: 40,
            })

            base.orQuery('match', 'name', {
                query: tempQuery,
                operator: 'AND',
                boost: 40,
            })

            base.orQuery('match', 'name.keyword', {
                query: tempQuery,
                boost: 120,
            })

            base.orQuery('match_phrase', 'name', {
                query: tempQuery,
                boost: 70,
            })
            base.orQuery('wildcard', 'name', {
                value: `${tempQuery.toLowerCase()}*`,
            })
            base.orQuery('match', 'description', {
                query: tempQuery,
            })
            base.orQuery('match', 'userDescription', {
                query: tempQuery,
            })
            base.orQuery('match', 'sql', {
                query: tempQuery,
                boost: 40,
            })
            base.orQuery('match', '__meaningsText', {
                query: tempQuery,
                boost: 20,
            })

            base.orQuery('match', 'name.stemmed', {
                query: tempQuery.toLowerCase(),
            })
            base.queryMinimumShouldMatch(1)
        }
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
                        /*  base.filter('terms', '__traitNames', found.tags) */

                        base.filter('bool', (q) => {
                            q.orFilter('terms', '__traitNames', found.tags)
                            q.orFilter(
                                'terms',
                                '__propagatedTraitNames',
                                found.tags
                            )

                            return q
                        })
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

    let connectorName = ''

    //filters
    Object.keys(facets ?? {})?.forEach((mkey) => {
        const filterObject = facets[mkey]

        switch (mkey) {
            case 'hierarchy': {
                // compatibility fix
                // if (filterObject.connectorName) {
                //     base.filter(
                //         'term',
                //         'connectorName',
                //         filterObject.connectorName
                //     )
                //     connectorName = filterObject.connectorName
                // }
                if (filterObject && filterObject.connectionQualifiedName) {
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

                    if (
                        filterObject &&
                        filterObject.attributeName &&
                        filterObject.attributeValue
                    ) {
                        base.filter('bool', (q) => {
                            q.orFilter(
                                'term',
                                filterObject.attributeName,
                                filterObject.attributeValue
                            )

                            q.orFilter(
                                'term',
                                'qualifiedName',
                                filterObject.attributeValue
                            )

                            return q
                        })
                    }
                    // base.filter(
                    //     'term',
                    //     'connectionQualifiedName',
                    //     filterObject.connectionQualifiedName
                    // )
                }
                break
            }
            case 'connector': {
                if (filterObject && filterObject === '__glossary') {
                    base.filter('terms', '__typeName.keyword', [
                        'AtlasGlossaryTerm',
                        'AtlasGlossaryCategory',
                    ])
                } else if (filterObject && filterObject !== '__glossary') {
                    base.filter('term', 'connectorName', filterObject)
                    connectorName = filterObject.connectorName
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
                        if (filterObject.ownerUsers?.length > 0) {
                            q.orFilter(
                                'terms',
                                'ownerUsers',
                                filterObject.ownerUsers
                            )
                            q.orFilter(
                                'terms',
                                'adminUsers',
                                filterObject.ownerUsers
                            )
                        }

                        if (filterObject.ownerGroups?.length > 0) {
                            q.orFilter(
                                'terms',
                                'ownerGroups',
                                filterObject.ownerGroups
                            )
                            q.orFilter(
                                'terms',
                                'adminGroups',
                                filterObject.ownerGroups
                            )
                        }

                        if (filterObject.empty === true) {
                            q.orFilter('bool', (query) =>
                                query.filter('bool', (query2) => {
                                    query2.notFilter('exists', 'ownerUsers')
                                    query2.notFilter('exists', 'ownerGroups')
                                    query2.notFilter('exists', 'adminUsers')
                                    query2.notFilter('exists', 'adminGroups')
                                    return query2
                                })
                            )
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
                        if (filterObject.classifications?.length > 0) {
                            q.orFilter(
                                'terms',
                                '__traitNames',
                                filterObject.classifications
                            )
                            q.orFilter(
                                'terms',
                                '__propagatedTraitNames',
                                filterObject.classifications
                            )
                        }

                        if (filterObject && filterObject.empty === true) {
                            q.orFilter('bool', (query) =>
                                query.filter('bool', (query2) => {
                                    query2.notFilter('exists', '__traitNames')
                                    query2.notFilter(
                                        'exists',
                                        '__propagatedTraitNames'
                                    )
                                    return query2
                                })
                            )
                        }
                        return q
                    })
                }

                break
            }
            case 'qualifiedName': {
                if (filterObject) {
                    base.filter('term', 'qualifiedName', filterObject)
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
            case 'objectQualifiedName': {
                if (filterObject) {
                    base.filter('term', 'objectQualifiedName', filterObject)
                }
                break
            }
            case 'collectionQualifiedName': {
                if (filterObject) {
                    base.filter('term', 'collectionQualifiedName', filterObject)
                }
                break
            }
            case 's3BucketQualifiedName': {
                if (filterObject) {
                    base.filter('term', 's3BucketQualifiedName', filterObject)
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
            case 'excludeGtc': {
                if (filterObject) {
                    base.notFilter('terms', '__typeName.keyword', [
                        'AtlasGlossary',
                        'AtlasGlossaryCategory',
                        'AtlasGlossaryTerm',
                    ])
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
            case 'connectorName': {
                if (filterObject) {
                    base.filter('terms', '__guid', filterObject)
                }
                break
            }
            case 'stateList': {
                // if (filterObject) {
                //     base.filter('terms', '__state', filterObject)
                // }
                state.value = null
                break
            }
            case 'column':
            case 'table':
            case 'sql':
            default: {
                if (filterObject) {
                    Object.keys(filterObject)?.forEach((key) => {
                        filterObject[key]?.forEach((element) => {
                            if (!element.operand) return
                            if (element.operator === 'isNull') {
                                if (
                                    element.operand === 'description.keyword' ||
                                    element.operand ===
                                        'userDescription.keyword'
                                ) {
                                    base.notFilter(
                                        'exists',
                                        'description.keyword'
                                    )
                                    base.notFilter(
                                        'exists',
                                        'userDescription.keyword'
                                    )
                                } else {
                                    base.notFilter('exists', element.operand)
                                }
                            }
                            if (element.operator === 'isNotNull') {
                                if (
                                    element.operand === 'description.keyword' ||
                                    element.operand ===
                                        'userDescription.keyword'
                                ) {
                                    base.filter('bool', (q) => {
                                        q.orFilter(
                                            'exists',
                                            'description.keyword'
                                        )
                                        q.orFilter(
                                            'exists',
                                            'userDescription.keyword'
                                        )
                                        return q
                                    })
                                } else {
                                    base.filter('exists', element.operand)
                                }
                            }
                            if (
                                element.operator === 'boolean' &&
                                element.operand === '__hasLineage'
                            ) {
                                // eslint-disable-next-line no-unused-expressions
                                element.value
                                    ? base.filter(
                                          'term',
                                          '__hasLineage',
                                          Array.isArray(element.value)
                                              ? JSON.stringify(element.value)
                                              : element.value
                                      )
                                    : (base.orFilter(
                                          'term',
                                          '__hasLineage',
                                          Array.isArray(element.value)
                                              ? JSON.stringify(element.value)
                                              : element.value
                                      ),
                                      base.orFilter('bool', (q) => {
                                          q.notFilter('exists', element.operand)
                                          return q
                                      }))
                            } else if (
                                element.value != null &&
                                element.value !== ''
                            ) {
                                if (element.operator === 'equals') {
                                    if (
                                        element.operand ===
                                            'description.keyword' ||
                                        element.operand ===
                                            'userDescription.keyword'
                                    ) {
                                        base.filter('bool', (q) => {
                                            q.orFilter(
                                                'term',
                                                'description.keyword',
                                                Array.isArray(element.value)
                                                    ? JSON.stringify(
                                                          element.value
                                                      )
                                                    : element.value
                                            )
                                            q.orFilter(
                                                'term',
                                                'userDescription.keyword',
                                                Array.isArray(element.value)
                                                    ? JSON.stringify(
                                                          element.value
                                                      )
                                                    : element.value
                                            )
                                            return q
                                        })
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
                                if (element.operator === 'notEquals') {
                                    if (
                                        element.operand ===
                                            'description.keyword' ||
                                        element.operand ===
                                            'userDescription.keyword'
                                    ) {
                                        base.notFilter(
                                            'term',
                                            'description.keyword',
                                            Array.isArray(element.value)
                                                ? JSON.stringify(element.value)
                                                : element.value
                                        )
                                        base.notFilter(
                                            'term',
                                            'userDescription.keyword',
                                            Array.isArray(element.value)
                                                ? JSON.stringify(element.value)
                                                : element.value
                                        )
                                    } else {
                                        base.notFilter(
                                            'term',
                                            element.operand,
                                            Array.isArray(element.value)
                                                ? JSON.stringify(element.value)
                                                : element.value
                                        )
                                    }
                                }
                                if (element.operator === 'startsWith') {
                                    if (
                                        element.operand ===
                                            'description.keyword' ||
                                        element.operand ===
                                            'userDescription.keyword'
                                    ) {
                                        base.filter('bool', (q) => {
                                            q.orFilter(
                                                'wildcard',
                                                'description.keyword',
                                                {
                                                    value: `${
                                                        Array.isArray(
                                                            element.value
                                                        )
                                                            ? JSON.stringify(
                                                                  element.value
                                                              )
                                                            : element.value
                                                    }*`,
                                                }
                                            )
                                            q.orFilter(
                                                'wildcard',
                                                'userDescription.keyword',
                                                {
                                                    value: `${
                                                        Array.isArray(
                                                            element.value
                                                        )
                                                            ? JSON.stringify(
                                                                  element.value
                                                              )
                                                            : element.value
                                                    }*`,
                                                }
                                            )
                                            return q
                                        })
                                    } else {
                                        base.filter(
                                            'wildcard',
                                            element.operand,
                                            {
                                                value: `${
                                                    Array.isArray(element.value)
                                                        ? JSON.stringify(
                                                              element.value
                                                          )
                                                        : element.value
                                                }*`,
                                            }
                                        )
                                    }
                                }
                                if (element.operator === 'endsWith') {
                                    if (
                                        element.operand ===
                                            'description.keyword' ||
                                        element.operand ===
                                            'userDescription.keyword'
                                    ) {
                                        base.filter('bool', (q) => {
                                            q.orFilter(
                                                'wildcard',
                                                'description.keyword',
                                                {
                                                    value: `*${
                                                        Array.isArray(
                                                            element.value
                                                        )
                                                            ? JSON.stringify(
                                                                  element.value
                                                              )
                                                            : element.value
                                                    }`,
                                                }
                                            )
                                            q.orFilter(
                                                'wildcard',
                                                'userDescription.keyword',
                                                {
                                                    value: `*${
                                                        Array.isArray(
                                                            element.value
                                                        )
                                                            ? JSON.stringify(
                                                                  element.value
                                                              )
                                                            : element.value
                                                    }`,
                                                }
                                            )
                                            return q
                                        })
                                    } else {
                                        base.filter(
                                            'wildcard',
                                            element.operand,
                                            {
                                                value: `*${
                                                    Array.isArray(element.value)
                                                        ? JSON.stringify(
                                                              element.value
                                                          )
                                                        : element.value
                                                }`,
                                            }
                                        )
                                    }
                                }
                                if (element.operator === 'contains') {
                                    if (
                                        element.operand ===
                                            'description.keyword' ||
                                        element.operand ===
                                            'userDescription.keyword'
                                    ) {
                                        base.filter('bool', (q) => {
                                            q.orFilter(
                                                'wildcard',
                                                'description.keyword',
                                                {
                                                    value: `*${
                                                        Array.isArray(
                                                            element.value
                                                        )
                                                            ? JSON.stringify(
                                                                  element.value
                                                              )
                                                            : element.value
                                                    }*`,
                                                }
                                            )
                                            q.orFilter(
                                                'wildcard',
                                                'userDescription.keyword',
                                                {
                                                    value: `*${
                                                        Array.isArray(
                                                            element.value
                                                        )
                                                            ? JSON.stringify(
                                                                  element.value
                                                              )
                                                            : element.value
                                                    }*`,
                                                }
                                            )
                                            return q
                                        })
                                    } else {
                                        base.filter(
                                            'wildcard',
                                            element.operand,
                                            {
                                                value: `*${
                                                    Array.isArray(element.value)
                                                        ? JSON.stringify(
                                                              element.value
                                                          )
                                                        : element.value
                                                }*`,
                                            }
                                        )
                                    }
                                }

                                if (element.operator === 'pattern') {
                                    if (
                                        element.operand ===
                                            'description.keyword' ||
                                        element.operand ===
                                            'userDescription.keyword'
                                    ) {
                                        base.filter('bool', (q) => {
                                            q.orFilter(
                                                'regexp',
                                                'description.keyword',
                                                Array.isArray(element.value)
                                                    ? JSON.stringify(
                                                          element.value
                                                      )
                                                    : element.value
                                            )
                                            q.orFilter(
                                                'regexp',
                                                'userDescription.keyword',
                                                Array.isArray(element.value)
                                                    ? JSON.stringify(
                                                          element.value
                                                      )
                                                    : element.value
                                            )
                                            return q
                                        })
                                    }
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

    // don't apply state filter
    if (state.value) base.filter('term', '__state', state.value)

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
                case 'fieldDataType': {
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
                case 'connection': {
                    if (mkey) {
                        base.aggregation(
                            'terms',
                            'connectionQualifiedName',
                            { size: 100 },
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
                        if (queryText) {
                            base.sort('_score', 'desc')
                        }

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
        !facets?.typeNames?.includes('Link') &&
        !facets?.guid &&
        !facets?.guidList
    ) {
        // Global TypeName Filters
        base.orFilter('terms', '__superTypeNames.keyword', [
            'SQL',
            'BI',
            'SaaS',
            'ObjectStore',
        ])
        base.orFilter('terms', '__typeName.keyword', [
            'Query',
            'Collection',
            'AtlasGlossaryCategory',
            'AtlasGlossaryTerm',
            'Connection',
            'Process',
        ])
    }

    base.filterMinimumShouldMatch(1)

    const tempQuery = base.build()

    const functionArray = [
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
    ]

    if (connectorName?.toLowerCase() === 'looker') {
        functionArray.push({
            filter: {
                match: {
                    __typeName: 'LookerDashboard',
                },
            },
            weight: 3,
        })
        functionArray.push({
            filter: {
                match: {
                    __typeName: 'LookerExplore',
                },
            },
            weight: 3,
        })
        functionArray.push({
            filter: {
                match: {
                    __typeName: 'LookerModel',
                },
            },
            weight: 3,
        })
    }

    if (connectorName?.toLowerCase() === 'powerbi') {
        functionArray.push({
            filter: {
                match: {
                    __typeName: 'PowerBIDashboard',
                },
            },
            weight: 3,
        })
        functionArray.push({
            filter: {
                match: {
                    __typeName: 'PowerBIReport',
                },
            },
            weight: 3,
        })
    }

    if (connectorName?.toLowerCase() === 'salesforce') {
        functionArray.push({
            filter: {
                match: {
                    __typeName: 'SalesforceDashboard',
                },
            },
            weight: 3,
        })
        functionArray.push({
            filter: {
                match: {
                    __typeName: 'SalesforceReport',
                },
            },
            weight: 3,
        })
    }

    const query = {
        ...tempQuery,
        query: {
            function_score: {
                query: tempQuery.query,
                functions: functionArray,
                boost_mode: 'sum',
                score_mode: 'sum',
            },
        },
    }

    return query
}
