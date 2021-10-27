/* eslint-disable default-case */
import bodybuilder from 'bodybuilder'

export function generateFilterDSL(facet: Record<string, any>) {
    const query = bodybuilder()
    Object.keys(facet ?? {}).forEach((mkey) => {
        const fltrObj = facet[mkey]
        switch (mkey) {
            case 'connector': {
                if (fltrObj) {
                    query.filter('term', 'connectorName', fltrObj)
                }
                break
            }
            case 'connection': {
                if (fltrObj) {
                    query.filter('term', 'connectionQualifiedName', fltrObj)
                }
                break
            }
        }
    })

    query.orFilter('terms', '__superTypeNames.keyword', ['SQL', 'BI'])
    query.orFilter('terms', '__typeName.keyword', ['Query'])

    // query.filter('term', '__superTypes.keyword', 'Catalog')

    query.queryMinimumShouldMatch(1)
    return query.build()
}
