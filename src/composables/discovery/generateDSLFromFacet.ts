/* eslint-disable default-case */
import bodybuilder from 'bodybuilder'

export function generateDSLFromFacet(facet: Record<string, any>) {
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
        }
    })
    query.queryMinimumShouldMatch(1)
    return query
}
