import bodybuilder from 'bodybuilder'

interface useBodyProps {
    from?: number
    limit?: number
    schemaQualifiedName?: string | undefined
    tableQualifiedName?: string | undefined
    tableQualifiedNames?: string[] | undefined
    viewQualifiedName?: string[] | undefined
    searchText?: string | undefined
}
export default function useBody({
    from = 0,
    limit = 100,
    schemaQualifiedName,
    tableQualifiedName,
    tableQualifiedNames,
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
    if (Array.isArray(tableQualifiedNames) && tableQualifiedNames?.length > 1) {
        // debugger
        base.filter('terms', 'qualifiedName', tableQualifiedNames)
    }
    if (viewQualifiedName) {
        base.filter('term', 'viewQualifiedName', tableQualifiedName)
        base.filter('term', '__typeName.keyword', 'Column')
    }

    return base.build()
}
