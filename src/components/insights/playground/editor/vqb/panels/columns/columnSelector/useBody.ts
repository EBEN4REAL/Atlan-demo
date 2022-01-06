import bodybuilder from 'bodybuilder'

interface useBodyProps {
    from?: number
    limit?: number
    tableQualfiedName?: string | undefined
    searchText?: string | undefined
}
export default function useBody({
    from = 0,
    limit = 100,
    tableQualfiedName,
    searchText,
}: useBodyProps) {
    const base = bodybuilder()

    base.from(from || 0)
    base.size(limit || 100)

    if (searchText)
        base.query('wildcard', 'name.keyword', {
            value: `*${searchText}*`,
        })
    if (tableQualfiedName) {
        base.filter('term', 'tableQualifiedName', tableQualfiedName)
    }
    base.filter('term', '__typeName.keyword', 'Column')
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
