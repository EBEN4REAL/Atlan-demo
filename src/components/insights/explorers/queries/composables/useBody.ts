import bodybuilder from 'bodybuilder'

interface useBodyProps {
    from?: number
    limit?: number
    searchText?: string | undefined
}
export default function useBody({
    from = 0,
    limit = 100,
    searchText = '',
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
    base.filter('term', '__typeName.keyword', 'QueryCollection')
    base.hasFilter

    return base.build()
}
