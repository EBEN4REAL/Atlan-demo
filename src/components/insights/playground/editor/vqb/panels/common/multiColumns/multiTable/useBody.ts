import bodybuilder from 'bodybuilder'
import { connectorsWidgetInterface } from '~/types/insights/connectorWidget.interface'

interface useBodyProps {
    from?: number
    limit?: number
    schemaQualifiedName?: string | undefined
    tableQualifiedName?: string | undefined
    tableQualifiedNames?: string[] | undefined
    viewQualifiedName?: string[] | undefined
    searchText?: string | undefined
    context: connectorsWidgetInterface
}
export default function useBody({
    from = 0,
    limit = 100,
    schemaQualifiedName,
    tableQualifiedName,
    tableQualifiedNames,
    viewQualifiedName,
    searchText,
    context,
}: useBodyProps) {
    const base = bodybuilder()
    base.filter('term', '__state', 'ACTIVE')

    base.from(from || 0)
    base.size(limit || 100)

    if (searchText)
        base.query('wildcard', 'name.keyword', {
            value: `*${searchText}*`,
        })

    if (tableQualifiedName) {
        base.filter('term', 'tableQualifiedName', tableQualifiedName)
        base.filter('term', '__typeName.keyword', 'Column')
    }
    if (Array.isArray(tableQualifiedNames) && tableQualifiedNames?.length > 1) {
        // debugger
        base.filter('terms', 'qualifiedName', tableQualifiedNames)
    }
    if (viewQualifiedName) {
        base.filter('term', 'viewQualifiedName', viewQualifiedName)
        base.filter('term', '__typeName.keyword', 'Column')
    }

    if (!tableQualifiedName && !viewQualifiedName) {
        switch (context?.attributeName) {
            case 'connectionQualifiedName': {
                base.filter(
                    'term',
                    context.attributeName,
                    context.attributeValue
                )
                base.filter('terms', '__typeName.keyword', ['Table', 'View'])
                base.sort([
                    {
                        'name.keyword': {
                            order: 'asc',
                        },
                    },
                ])
                break
            }
            case 'databaseQualifiedName': {
                base.filter(
                    'term',
                    context.attributeName,
                    context.attributeValue
                )
                base.filter('terms', '__typeName.keyword', ['Table', 'View'])
                base.sort([
                    {
                        'name.keyword': {
                            order: 'asc',
                        },
                    },
                ])
                break
            }
            case 'schemaQualifiedName': {
                base.filter(
                    'term',
                    'schemaQualifiedName',
                    context.attributeValue
                )
                base.filter('terms', '__typeName.keyword', ['Table', 'View'])
                base.sort([
                    {
                        'name.keyword': {
                            order: 'asc',
                        },
                    },
                ])
            }
        }
    }
    base.aggregation('terms', '__typeName.keyword')

    const tempQuery = base.build()
    const query = {
        ...tempQuery,
        query: {
            function_score: {
                query: tempQuery.query,
                functions: [
                    {
                        filter: {
                            match: {
                                isPrimary: true,
                            },
                        },
                        weight: 5,
                    },
                    {
                        filter: {
                            match: {
                                isForeign: true,
                            },
                        },
                        weight: 4,
                    },
                    {
                        filter: {
                            match: {
                                isPartition: true,
                            },
                        },
                        weight: 3,
                    },
                ],
                boost_mode: 'sum',
                score_mode: 'sum',
            },
        },
    }

    return query
}
