/* eslint-disable default-case */
import bodybuilder from 'bodybuilder'

const agg_prefix = 'group_by'
export function generateAggregationDSL(aggregations: any) {
    const dsl = bodybuilder()

    aggregations.forEach((mkey) => {
        switch (mkey) {
            case 'typeName': {
                if (mkey) {
                    dsl.aggregation(
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
                    dsl.aggregation(
                        'terms',
                        'dataType.keyword',
                        { size: 50 },
                        `${agg_prefix}_${mkey}`
                    )
                }
                break
            }
        }
    })
    return dsl.build()
}
