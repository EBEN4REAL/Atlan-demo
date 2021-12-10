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
    base.sort([
        {
            'name.keyword': {
                order: 'asc',
            },
        },
    ])
    if (searchText)
        base.query('wildcard', 'name.keyword', {
            value: `*${searchText}*`,
        })
    if (tableQualfiedName) {
        base.filter('term', 'tableQualifiedName', tableQualfiedName)
    }
    base.filter('term', '__typeName.keyword', 'Column')

    return base.build()
}
