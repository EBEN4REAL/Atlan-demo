import bodybuilder from 'bodybuilder'

export function generateAggregationDSL() {
    const dsl = bodybuilder()
    dsl.aggregation('terms', '__typeName.keyword', { size: 50 }, 'typename')
    return dsl.build()
}
