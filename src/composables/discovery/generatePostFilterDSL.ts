/* eslint-disable default-case */
import bodybuilder from 'bodybuilder'

export function generatePostFilterDSL(facet: Record<string, any>) {
    const query = bodybuilder()
    // dsl.filter('terms', '__typeName.keyword', ['Catalog'])
    Object.keys(facet ?? {}).forEach((mkey) => {
        const filterObject = facet[mkey]
        switch (mkey) {
            case 'typeName': {
                if (filterObject) {
                    if (filterObject !== '__all') {
                        query.filter('term', '__typeName.keyword', filterObject)
                    }
                }
                break
            }
        }
    })
    return { post_filter: query.build().query }
}
