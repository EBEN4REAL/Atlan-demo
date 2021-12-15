import bodybuilder from 'bodybuilder'

interface useBodyProps {
    from?: number
    limit?: number
    schemaQualifiedName?: string | undefined
    tableQualifiedName? : string | undefined
    searchText?: string | undefined
}
export default function useBody({
    from = 0,
    limit = 100,
    schemaQualifiedName,
    tableQualifiedName,
    viewQualifiedName,
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
        base.filter('terms', '__typeName.keyword', ['Table', 'View'])
    }
    if (tableQualifiedName) {
        base.filter('term', 'tableQualifiedName', tableQualifiedName)
        base.filter('term', '__typeName.keyword', 'Column')
    }
    if (viewQualifiedName) {
        base.filter('term', 'viewQualifiedName', tableQualifiedName)
        base.filter('term', '__typeName.keyword', 'Column')
    }

    return base.build()
}