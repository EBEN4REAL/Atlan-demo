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
    base.orQuery('match', 'description', {
        query: queryText,
    })
    base.orQuery('match', 'userDescription', {
        query: queryText,
    })
    base.orQuery('match', 'name.stemmed', { query: queryText })
    base.queryMinimumShouldMatch(1)
}
export function useBody(
    sort: any,
    appliedFilters: any,
    typeName: any,
    queryText?: string,
    offset?: any,
    limit?: any
) {
    const base = bodybuilder()

    appliedFilters.forEach((filter, i) => {
        if (i == 0) {
            const ob = Object.keys(filter.term)
            base.filter('term', ob[0], filter.term[ob[0]])
        }
        if (i == 1) {
            if (Array.isArray(typeName))
                // base.filter('terms', '__typeName.keyword', [
                //     'Database',
                //     'Schema',
                //     'Table',
                //     'Column',
                // ])
                base.filter('terms', '__typeName.keyword', typeName)
            else {
                /* Only use queryText when searching for database/ topmost parent, children won't be filtered using query text */
                if (typeName === 'Database' && queryText)
                    addQueryTextFilter(base, queryText)
                base.filter('term', '__typeName.keyword', typeName)
            }
        }
    })

    base.from(offset || 0)
    base.size(limit || 0)

    base.sort('name.keyword', { order: sort })

    base.filterMinimumShouldMatch(1)

    return base.build()
}
