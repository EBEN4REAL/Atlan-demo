import bodybuilder from 'bodybuilder'

interface useBodyProps {
    from?: number
    limit?: number
    schemaQualifiedName?: string | undefined
    tableQualifiedName?: string | undefined
    viewQualifiedName?: string | undefined
    searchText?: string | undefined
    tableQualifiedNamesContraint?: {
        allowed: string[]
        notAllowed: string[]
    }
}
export default function useBody({
    from = 0,
    limit = 100,
    schemaQualifiedName,
    tableQualifiedName,
    viewQualifiedName,
    searchText,
    tableQualifiedNamesContraint,
}: useBodyProps) {
    const base = bodybuilder()
    if (schemaQualifiedName) {
        base.sort([
            {
                'name.keyword': {
                    order: 'asc',
                },
            },
        ])
    }
    base.from(from || 0)
    base.size(limit || 100)
    if (searchText)
        base.query('wildcard', 'name.keyword', {
            value: `*${searchText}*`,
        })
    if (schemaQualifiedName) {
        if (
            tableQualifiedNamesContraint?.allowed?.length === 0 &&
            tableQualifiedNamesContraint?.notAllowed?.length === 0
        ) {
            base.filter('term', 'schemaQualifiedName', schemaQualifiedName)
            base.filter('terms', '__typeName.keyword', ['Table', 'View'])
        } else if (
            tableQualifiedNamesContraint?.allowed?.length > 0 &&
            tableQualifiedNamesContraint?.notAllowed?.length === 0
        ) {
            base.filter('term', 'schemaQualifiedName', schemaQualifiedName)
            base.filter('terms', '__typeName.keyword', ['Table', 'View'])
            base.filter('terms', 'qualifiedName', [
                ...tableQualifiedNamesContraint?.allowed,
            ])
        } else if (
            tableQualifiedNamesContraint?.allowed?.length === 0 &&
            tableQualifiedNamesContraint?.notAllowed?.length > 0
        ) {
            base.filter('term', 'schemaQualifiedName', schemaQualifiedName)
            base.filter('terms', '__typeName.keyword', ['Table', 'View'])
            base.notFilter(
                'terms',
                'qualifiedName',
                tableQualifiedNamesContraint?.notAllowed
            )
        }
    }
    if (tableQualifiedName) {
        base.filter('term', 'tableQualifiedName', tableQualifiedName)
        base.filter('term', '__typeName.keyword', 'Column')
    }

    if (viewQualifiedName) {
        base.filter('term', 'viewQualifiedName', tableQualifiedName)
        base.filter('term', '__typeName.keyword', 'Column')
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
