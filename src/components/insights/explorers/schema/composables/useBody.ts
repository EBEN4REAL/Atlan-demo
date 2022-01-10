/* eslint-disable default-case */
import bodybuilder from 'bodybuilder'

function addQueryTextFilter(base: any, queryText) {
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
    // base.orQuery('match', 'description', {
    //     query: queryText,
    // })
    // base.orQuery('match', 'userDescription', {
    //     query: queryText,
    // })
    base.orQuery('match', 'name.stemmed', { query: queryText })
    base.queryMinimumShouldMatch(1)
}
export function useBody(
    sort: any,
    appliedFilters: any,
    typeName: any,
    queryText?: string,
    offset?: any,
    limit?: any,
    facets?: object,
    sortOrderTable?: string,
    sortOrderColumn?:string
    // searchResultType?: string
) {
    const base = bodybuilder()

    appliedFilters.forEach((filter, i) => {
        if (i == 0) {
            const ob = Object.keys(filter.term)
            base.filter('term', ob[0], filter.term[ob[0]])
        }
        if (i == 1) {
            if (Array.isArray(typeName)) {
                base.filter('terms', '__typeName.keyword', typeName)
                addQueryTextFilter(base, queryText)
            }
            else {
                if (queryText && typeName==='Database')
                    addQueryTextFilter(base, queryText)
                base.filter('term', '__typeName.keyword', typeName)
            }
        }

        console.log('filters: ', appliedFilters)
    })

    base.from(offset || 0)
    base.size(limit || 0)

    if(typeName==='Column') {
        
        if(sortOrderColumn && sortOrderColumn.length) {
            let sortData = sortOrderColumn.split('-')
            base.sort(`${sortData[0]}`, { order: sortData[1] })
        } else {
            base.sort('order', { order: sort })

        }
    } else {
        if((typeName==='Table' || Array.isArray(typeName)) && sortOrderTable && sortOrderTable.length) {
            
            if(queryText?.length) {

            } else {
                let sortData = sortOrderTable.split('-')
                base.sort(`${sortData[0]}`, { order: sortData[1] })
            }
        } else {
            if(queryText?.length) {

            } else {
                base.sort('name.keyword', { order: sort })
            }
        }
    }

    const existsValue = 'NONE'
      //facet filters
    if((typeName==='Table' || Array.isArray(typeName))) {
        Object.keys(facets ?? {}).forEach((mkey) => {
            let filterObject = facets[mkey]
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

                            // replace null
                            let filter = [...filterObject]

                            for(var i=0;i<filter.length;i++) {
                                if (filter[i] == null) {
                                    filter[i] = "NONE";
                                  }
                            }

                            const index = filter.indexOf(existsValue)
                            if (index > -1) {
                                const temp = []
                                filter.forEach((element) => {
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
                                    filter
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
                case 'column':
                case 'table':
                case 'properties': {
                    if (filterObject) {
                        console.log(filterObject)
                        Object.keys(filterObject).forEach((key) => {
                            filterObject[key].forEach((element) => {
                                if (element.value) {
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
                                    if (element.operator === 'isNull') {
                                        base.notFilter('exists', element.operand)
                                    }
                                    if (element.operator === 'isNotNull') {
                                        base.filter('exists', element.operand)
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
                                        base.filter(
                                            'term',
                                            element.operand,
                                            element.value
                                        )
                                    }
                                }
                            })
                        })
                    }
                    break
                }
            }
        })
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
