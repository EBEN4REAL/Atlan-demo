import bodybuilder from 'bodybuilder'

interface useBodyProps {
    from?: number
    limit?: number
    tableQualfiedName?: string | undefined
    viewQualifiedName?: string | undefined
    searchText?: string | undefined
    assetType: string | undefined
}
export default function useBody({
    from = 0,
    limit = 100,
    tableQualfiedName,
    searchText,
    assetType,
    viewQualifiedName,
}: useBodyProps) {
    const base = bodybuilder()

    base.from(from || 0)
    base.size(limit || 100)

    if (searchText)
        base.query('wildcard', 'name.keyword', {
            value: `*${searchText}*`,
        })

    if (tableQualfiedName) {
        switch (assetType) {
            case 'Table': {
                base.filter('term', 'tableQualifiedName', tableQualfiedName)
                break
            }
            case 'View': {
                base.filter('term', 'viewQualifiedName', tableQualfiedName)
                break
            }
            default: {
                base.filter('term', 'tableQualifiedName', tableQualfiedName)
            }
        }
    } else if (viewQualifiedName) {
        base.filter('term', 'viewQualifiedName', viewQualifiedName)
        base.filter('term', '__typeName.keyword', 'Column')
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
