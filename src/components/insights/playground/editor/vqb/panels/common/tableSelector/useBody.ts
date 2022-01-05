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
    if (schemaQualifiedName) {
        base.filter('term', 'schemaQualifiedName', schemaQualifiedName)
    }
    base.filter('terms', '__typeName.keyword', ['Table', 'View'])

    return base.build()
}
