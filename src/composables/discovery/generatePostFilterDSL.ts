import bodybuilder from 'bodybuilder'

export function generatePostFilterDSL() {
    const dsl = bodybuilder()
    // dsl.filter('terms', '__typeName.keyword', ['Catalog'])
    return dsl.build()
}
