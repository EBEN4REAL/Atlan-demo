import bodybuilder from 'bodybuilder'

interface useBodyProps {
    from?: number
    limit?: number
    tableQualfiedName?: string | undefined
    schemaQualifiedName?: string | undefined
    viewQualifiedName?: string[] | undefined
    tableQualifiedNames?: string[] | undefined
    searchText?: string | undefined
}
export default function useBody({
    from = 0,
    limit = 100,
    tableQualfiedName,
    schemaQualifiedName,
    viewQualifiedName,
    tableQualifiedNames,
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
    if (tableQualfiedName) {
        base.filter('term', 'tableQualifiedName', tableQualfiedName)
        base.filter('term', '__typeName.keyword', 'Column')
    }
    if (Array.isArray(tableQualifiedNames) && tableQualifiedNames?.length > 1) {
        // debugger
        base.filter('terms', 'qualifiedName', tableQualifiedNames)
    }
    if (viewQualifiedName) {
        base.filter('term', 'viewQualifiedName', tableQualfiedName)
        base.filter('term', '__typeName.keyword', 'Column')
    }

    return base.build()
}
