/* eslint-disable default-case */
import bodybuilder from 'bodybuilder'

export function generatePostFilterDSL(facet: Record<string, any>) {
    const query = bodybuilder()
    // dsl.filter('terms', '__typeName.keyword', ['Catalog'])
    Object.keys(facet ?? {}).forEach((mkey) => {
        const fltrObj = facet[mkey]
        switch (mkey) {
            case 'typeName': {
                if (fltrObj) {
                    query.filter('term', '__typeName.keyword', fltrObj)
                }
                break
            }
        }
    })
    return query.build()
}
