import bodybuilder from 'bodybuilder'

interface useBodyProps {
    from?: number
    limit?: number
    schemaQualifiedName?: string | undefined
    searchText?: string | undefined
}
export default function useBody({
    from = 0,
    limit = 100,
    schemaQualifiedName,
    searchText,
}: useBodyProps) {
    const base = bodybuilder()
    base.sort([
        {
            'name.keyword': {
                order: 'asc',
            },
        },
    ])
    base.from(from || 0)
    base.size(limit || 100)
    if (searchText)
        base.query('wildcard', 'name.keyword', {
            value: `*${searchText}*`,
        })
    if (schemaQualifiedName) {
        base.filter('term', 'schemaQualifiedName', schemaQualifiedName)
    }
    base.filter('terms', '__typeName.keyword', ['Table', 'View'])

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
