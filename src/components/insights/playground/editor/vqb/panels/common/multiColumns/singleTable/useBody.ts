import bodybuilder from 'bodybuilder'
import { connectorsWidgetInterface } from '~/types/insights/connectorWidget.interface'

interface useBodyProps {
    from?: number
    limit?: number
    tableQualfiedName?: string | undefined
    viewQualifiedName?: string[] | undefined
    tableQualifiedNames?: string[] | undefined
    searchText?: string | undefined
    context: connectorsWidgetInterface
}
export default function useBody({
    from = 0,
    limit = 100,
    tableQualfiedName,
    viewQualifiedName,
    tableQualifiedNames,
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

    if (tableQualfiedName) {
        base.filter('term', 'tableQualifiedName', tableQualfiedName)
        base.filter('term', '__typeName.keyword', 'Column')
    } else if (viewQualifiedName) {
        base.filter('term', 'viewQualifiedName', viewQualifiedName)
        base.filter('term', '__typeName.keyword', 'Column')
    }

    if (Array.isArray(tableQualifiedNames) && tableQualifiedNames?.length > 1) {
        base.filter('terms', 'qualifiedName', tableQualifiedNames)
    }

    if (!tableQualfiedName && !viewQualifiedName) {
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
