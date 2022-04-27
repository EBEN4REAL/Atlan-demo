/* eslint-disable default-case */
import { isFor } from '@babel/types'
import bodybuilder from 'bodybuilder'
import { ref } from 'vue'
import { useUtils } from '~/components/governance/personas/assets/useUtils'
import { useConnectionStore } from '~/store/connection'
import { usePersonaStore } from '~/store/persona'
import { usePurposeStore } from '~/store/purpose'

const agg_prefix = 'group_by'

const existsValue = 'NONE'

export function useSimilarBody(
    offset?: any,
    limit?: any,
    facets?: Record<string, any>,
    aggregations?: string[]
) {
    const base = bodybuilder()

    Object.keys(facets ?? {})?.forEach((mkey) => {
        const filterObject = facets[mkey]

        switch (mkey) {
            case 'typeNames': {
                if (filterObject) {
                    base.filter('terms', '__typeName.keyword', filterObject)
                }
                break
            }
            case 'similarity': {
                if (filterObject) {
                    base.filter('bool', (q) => {
                        q.orFilter('term', 'name.keyword', filterObject)

                        return q
                    })
                }
                break
            }
            case 'orExists': {
                if (filterObject?.length > 0) {
                    base.filter('bool', (q) => {
                        filterObject.forEach((key) => {
                            base.orFilter('exists', key)
                        })

                        return q
                    })
                }
                break
            }
        }
    })

    base.from(offset || 0)
    base.size(limit || 0)

    base.filterMinimumShouldMatch(1)

    aggregations?.forEach((mkey) => {
        switch (mkey) {
            case 'description': {
                if (mkey) {
                    base.aggregation(
                        'terms',
                        'description.keyword',
                        {},
                        `${agg_prefix}_${mkey}`
                    )
                }
                break
            }
        }
    })

    const tempQuery = base.build()

    const functionArray = [
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
    ]

    const query = {
        ...tempQuery,
        query: {
            function_score: {
                query: tempQuery.query,
                functions: functionArray,
                boost_mode: 'sum',
                score_mode: 'sum',
            },
        },
    }

    return query
}
