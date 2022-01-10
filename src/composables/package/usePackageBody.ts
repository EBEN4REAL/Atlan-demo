/* eslint-disable default-case */
import { isFor } from '@babel/types'
import bodybuilder from 'bodybuilder'
import { ref } from 'vue'

const agg_prefix = 'group_by'

const existsValue = 'NONE'

export function usePackageBody(
    queryText?: string,
    offset?: any,
    limit?: any,
    facets?: Record<string, any>,
    preference?: Record<string, any>,
    aggregations?: string[]
) {
    const base = bodybuilder()

    if (queryText) {
        base.orQuery('nested', {
            path: 'metadata',
            ...bodybuilder()
                .query(
                    'match',
                    'metadata.annotations.orchestration.atlan.com/name',
                    {
                        query: queryText,
                        boost: 40,
                    }
                )
                .build(),
        })
        base.orQuery('nested', {
            path: 'metadata',
            ...bodybuilder()
                .query(
                    'match',
                    'metadata.annotations.orchestration.atlan.com/name',
                    {
                        query: queryText,
                        boost: 40,
                    }
                )
                .build(),
        })

        base.orQuery('nested', {
            path: 'metadata',
            ...bodybuilder()
                .query(
                    'match',
                    'metadata.annotations.orchestration.atlan.com/name',
                    {
                        query: queryText,
                        operator: 'AND',
                        boost: 40,
                    }
                )
                .build(),
        })
        base.orQuery('nested', {
            path: 'metadata',
            ...bodybuilder()
                .query(
                    'match',
                    'metadata.annotations.orchestration.atlan.com/name.keyword',
                    {
                        query: queryText,
                        operator: 'AND',
                        boost: 40,
                    }
                )
                .build(),
        })

        base.orQuery('nested', {
            path: 'metadata',
            ...bodybuilder()
                .query(
                    'wildcard',
                    'metadata.annotations.orchestration.atlan.com/name.keyword',
                    {
                        value: `${queryText}*`,
                    }
                )
                .build(),
        })
        base.orQuery('nested', {
            path: 'metadata',
            ...bodybuilder()
                .query(
                    'wildcard',
                    'metadata.annotations.package.argoproj.io/name',
                    {
                        value: `${queryText}*`,
                    }
                )
                .build(),
        })

        base.queryMinimumShouldMatch(1, true)
    }
    base.from(offset || 0)
    base.size(limit || 0)

    try {
        // console.log(facets)
        Object.keys(facets ?? {}).forEach((mkey) => {
            const filterObject = facets[mkey]
            switch (mkey) {
                case 'name': {
                    if (filterObject) {
                        base.filter('nested', {
                            path: 'metadata',
                            ...bodybuilder()
                                .query(
                                    'term',
                                    'metadata.name.keyword',
                                    filterObject
                                )
                                .build(),
                        })
                    }
                    break
                }
                case 'packageName': {
                    if (filterObject) {
                        base.filter('nested', {
                            path: 'metadata',
                            ...bodybuilder()
                                .query(
                                    'term',
                                    'metadata.annotations.package.argoproj.io/name.keyword',
                                    filterObject
                                )
                                .build(),
                        })
                    }
                    break
                }
                case 'packageNames': {
                    if (filterObject) {
                        base.filter('nested', {
                            path: 'metadata',
                            ...bodybuilder()
                                .query(
                                    'terms',
                                    'metadata.annotations.package.argoproj.io/name.keyword',
                                    filterObject
                                )
                                .build(),
                        })
                    }
                    break
                }
                case 'verified': {
                    if (filterObject) {
                        base.filter('nested', {
                            path: 'metadata',
                            ...bodybuilder()
                                .query(
                                    'term',
                                    'metadata.labels.orchestration.atlan.com/verified.keyword',
                                    true
                                )
                                .build(),
                        })
                    }
                    break
                }
                case 'sourceCategory': {
                    if (filterObject) {
                        if (filterObject.length > 0) {
                            base.andFilter('nested', {
                                path: 'metadata',
                                ...bodybuilder()
                                    .query(
                                        'terms',
                                        'metadata.labels.orchestration.atlan.com/sourceCategory.keyword',
                                        filterObject
                                    )
                                    .build(),
                            })
                        }
                    }
                    break
                }
                case 'ui': {
                    if (filterObject) {
                        base.filter('nested', {
                            path: 'metadata',
                            ...bodybuilder()
                                .query(
                                    'term',
                                    'metadata.labels.orchestration.atlan.com/atlan-ui.keyword',
                                    filterObject
                                )
                                .build(),
                        })
                    }
                    break
                }
            }
        })
    } catch (e) {}

    console.log('preference', preference)

    // base.filterMinimumShouldMatch(1)

    Object.keys(preference ?? {}).forEach((mkey) => {
        const filterObject = preference[mkey]
        switch (mkey) {
            case 'sort': {
                if (filterObject !== 'default') {
                    const split = filterObject.split('-')
                    if (split.length > 1) {
                        base.sort(split[0], {
                            order: split[1],
                            nested_path: 'metadata',
                        })
                    }
                }
                break
            }
        }
    })

    if (aggregations) {
        aggregations?.forEach((mkey) => {
            switch (mkey) {
                case 'package': {
                    base.rawOption('aggs', {
                        by_package: {
                            nested: {
                                path: 'metadata',
                            },
                            aggs: {
                                by_package: {
                                    terms: {
                                        field: 'metadata.annotations.package.argoproj.io/name.keyword',
                                        size: 200,
                                    },
                                    aggs: {
                                        by_package: {
                                            terms: {
                                                field: 'metadata.name.keyword',
                                                size: 200,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    })

                    break
                }
            }
        })
    }

    const tempQuery = base.build()

    const query = {
        ...tempQuery,
    }

    return query
}
