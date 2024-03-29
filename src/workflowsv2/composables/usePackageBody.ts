/* eslint-disable default-case */
import bodybuilder from 'bodybuilder'

export function usePackageBody(
    queryText?: string,
    offset?: any,
    limit?: any,
    facets?: Record<string, any>,
    postFacets?: Record<string, any>,
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
                    'metadata.annotations.orchestration.atlan.com/name',
                    {
                        value: `${queryText.toLowerCase()}*`,
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

        base.orQuery('nested', {
            path: 'metadata',
            ...bodybuilder()
                .query('wildcard', 'metadata.name', {
                    value: `*${queryText}*`,
                    boost: 40,
                })
                .build(),
        })

        base.queryMinimumShouldMatch(1, true)
    }
    base.from(offset || 0)
    base.size(limit || 0)

    try {
        Object.keys(facets ?? {}).forEach((mkey) => {
            const filterObject = facets?.[mkey]
            switch (mkey) {
                case 'name': {
                    if (filterObject) {
                        base.filter('nested', {
                            path: 'metadata',
                            ...bodybuilder()
                                .query(
                                    Array.isArray(filterObject)
                                        ? 'terms'
                                        : 'term',
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
                case 'creators': {
                    if (filterObject?.ownerUsers) {
                        base.andFilter('nested', {
                            path: 'metadata',
                            ...bodybuilder()
                                .query(
                                    'terms',
                                    'metadata.labels.workflows.argoproj.io/creator-preferred-username',
                                    filterObject.ownerUsers
                                )
                                .build(),
                        })
                    }
                    break
                }
                case 'wfType': {
                    if (filterObject?.length) {
                        base.andFilter('nested', {
                            path: 'metadata',
                            ...bodybuilder()
                                .query(
                                    'terms',
                                    'metadata.labels.orchestration.atlan.com/type.keyword',
                                    filterObject
                                )
                                .build(),
                        })
                    }
                    break
                }
                case 'schedule': {
                    if (filterObject) {
                        let nestedQuery = {}

                        if (filterObject === 'manual')
                            nestedQuery = bodybuilder()
                                .notFilter(
                                    'exists',
                                    'field',
                                    'metadata.annotations.orchestration.atlan.com/schedule'
                                )
                                .build()
                        else
                            nestedQuery = bodybuilder()
                                .filter(
                                    'exists',
                                    'field',
                                    'metadata.annotations.orchestration.atlan.com/schedule'
                                )
                                .build()

                        base.andFilter('nested', {
                            path: 'metadata',
                            ...nestedQuery,
                        })
                    }
                    break
                }
            }
        })
    } catch (e) {
        console.error(e)
    }

    // base.filterMinimumShouldMatch(1)

    Object.keys(preference ?? {}).forEach((mkey) => {
        const filterObject = preference?.[mkey]
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

    //post filters
    const postFilter = bodybuilder()
    Object.keys(postFacets ?? {}).forEach((mkey) => {
        const filterObject = postFacets?.[mkey]
        switch (mkey) {
            case 'typeName': {
                if (filterObject) {
                    if (filterObject !== '__all') {
                        postFilter.filter('nested', {
                            path: 'metadata',
                            ...bodybuilder()
                                .query(
                                    'term',
                                    'metadata.labels.orchestration.atlan.com/type.keyword',
                                    filterObject
                                )
                                .build(),
                        })
                    }
                }
                break
            }
        }
    })
    base.rawOption('post_filter', postFilter.build().query)

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
                                },
                            },
                        },
                    })
                    break
                }
                case 'by_type': {
                    base.rawOption('aggs', {
                        by_type: {
                            nested: {
                                path: 'metadata',
                            },
                            aggs: {
                                by_type: {
                                    terms: {
                                        field: 'metadata.labels.orchestration.atlan.com/type.keyword',
                                        size: 200,
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
