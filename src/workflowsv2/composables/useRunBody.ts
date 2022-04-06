/* eslint-disable default-case */
import bodybuilder from 'bodybuilder'
import { ref } from 'vue'

export function useRunBody(
    queryText?: string,
    offset?: any,
    limit?: any,
    facets?: Record<string, any>,
    aggregations?: string[],
    preference?: Record<string, any>
) {
    const base = bodybuilder()

    base.from(offset || 0)
    base.size(limit || 0)

    try {
        const state = ref('ACTIVE')
        // console.log(facets)
        Object.keys(facets ?? {}).forEach((mkey) => {
            const filterObject = facets[mkey]
            switch (mkey) {
                case 'workflowTemplate': {
                    if (filterObject) {
                        base.andFilter('nested', {
                            path: 'spec',
                            ...bodybuilder()
                                .query(
                                    'term',
                                    'spec.workflowTemplateRef.name.keyword',
                                    filterObject
                                )
                                .build(),
                        })
                    }
                    break
                }
                case 'workflowTemplates': {
                    if (filterObject) {
                        base.filter('nested', {
                            path: 'spec',
                            ...bodybuilder()
                                .query(
                                    'terms',
                                    'spec.workflowTemplateRef.name.keyword',
                                    filterObject
                                )
                                .build(),
                        })
                    }
                    break
                }
                case 'prefix': {
                    if (filterObject) {
                        base.filter('nested', {
                            path: 'spec',
                            ...bodybuilder()
                                .query(
                                    'prefix',
                                    'spec.workflowTemplateRef.name.keyword',
                                    filterObject
                                )
                                .build(),
                        })
                    }
                    break
                }
                case 'runName': {
                    if (filterObject) {
                        base.andFilter('nested', {
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
                case 'startedAt': {
                    if (filterObject) {
                        base.andFilter('nested', {
                            path: 'metadata',
                            ...bodybuilder()
                                .query('range', 'metadata.creationTimestamp', {
                                    gt: filterObject,
                                })
                                .build(),
                        })
                    }
                    break
                }
                case 'status': {
                    if (filterObject) {
                        base.andFilter('nested', {
                            path: 'metadata',
                            ...bodybuilder()
                                .query(
                                    Array.isArray(filterObject)
                                        ? 'terms'
                                        : 'term',
                                    'metadata.labels.workflows.argoproj.io/phase.keyword',
                                    filterObject
                                )
                                .build(),
                        })
                    }

                    break
                }
                case 'creators': {
                    if (filterObject?.ownerUsers?.length) {
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
                case 'dateRange': {
                    if (filterObject) {
                        base.andFilter('nested', {
                            path: 'metadata',
                            ...bodybuilder()
                                .query(
                                    'range',
                                    'metadata.creationTimestamp',
                                    filterObject
                                )
                                .build(),
                        })
                    }
                    break
                }
            }
        })
    } catch (e) {
        console.log(e)
    }

    // //aggregations
    if (Array.isArray(aggregations)) {
        aggregations?.forEach((mkey) => {
            switch (mkey) {
                case 'status': {
                    base.rawOption('aggs', {
                        by_status: {
                            nested: {
                                path: 'spec',
                            },
                            aggs: {
                                by_status: {
                                    terms: {
                                        field: 'spec.workflowTemplateRef.name.keyword',
                                        size: 200,
                                    },
                                    aggs: {
                                        by_status: {
                                            reverse_nested: {},
                                            aggs: {
                                                top_hits_by_status: {
                                                    top_hits: {
                                                        size: 5,
                                                        sort: [
                                                            {
                                                                'status.startedAt':
                                                                    {
                                                                        order: 'desc',
                                                                    },
                                                            },
                                                        ],
                                                        _source: {
                                                            includes: [
                                                                'status.phase',
                                                                'status.startedAt',
                                                                'status.finishedAt',
                                                                'status.progress',
                                                                'status.estimatedDuration',
                                                                'metadata.labels.workflows.argoproj.io/creator-preferred-username',
                                                            ],
                                                        },
                                                    },
                                                },
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

    return base.build()
}
