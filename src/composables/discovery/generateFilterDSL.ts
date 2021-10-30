/* eslint-disable default-case */
import bodybuilder from 'bodybuilder'

export function generateFilterDSL(facet: Record<string, any>) {
    const query = bodybuilder()
    Object.keys(facet ?? {}).forEach((mkey) => {
        const filterObject = facet[mkey]
        switch (mkey) {
            case 'connector': {
                if (filterObject) {
                    query.filter('term', 'connectorName', filterObject)
                }
                break
            }
            case 'connection': {
                if (filterObject) {
                    query.filter(
                        'term',
                        'connectionQualifiedName',
                        filterObject
                    )
                }
                break
            }
            case 'certificate': {
                if (filterObject) {
                    if (filterObject.length > 0)
                        query.filter('terms', 'certificateStatus', filterObject)
                }
                break
            }
            case 'typeName': {
                if (filterObject) {
                    if (filterObject !== '__all') {
                        query.filter('term', '__typeName.keyword', filterObject)
                    }
                }
                break
            }
            case 'tableQualifiedName': {
                if (filterObject) {
                    query.filter('term', 'tableQualifiedName', filterObject)
                }
                break
            }
            case 'viewQualifiedName': {
                if (filterObject) {
                    query.filter('term', 'viewQualifiedName', filterObject)
                }
                break
            }
        }
    })

    // Global TypeName Filters
    query.orFilter('terms', '__superTypeNames.keyword', ['SQL', 'BI'])
    query.orFilter('terms', '__typeName.keyword', ['Query'])

    query.filterMinimumShouldMatch(1)
    return query.build()
}
