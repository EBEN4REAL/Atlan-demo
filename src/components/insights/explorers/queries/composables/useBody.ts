import bodybuilder from 'bodybuilder'

interface useBodyProps {
    from?: number
    limit?: number
    searchText?: string | undefined
    createdBy?: string | undefined
    groups?: string[]
}
export default function useBody({
    from = 0,
    limit = 100,
    searchText = '',
    createdBy,
    groups,
}: useBodyProps) {
    const base = bodybuilder()

    base.from(from || 0)
    base.size(limit || 100)
    // base.sort([
    //     {
    //         'name.keyword': {
    //             order: 'asc',
    //         },
    //     },
    // ])
    base.filter('term', '__typeName.keyword', 'Collection')
    base.filter('term', '__state', 'ACTIVE')
    if (searchText)
        base.query('wildcard', 'name.keyword', {
            value: `*${searchText}*`,
        })
    if (createdBy) {
        base.orFilter('term', '__createdBy', createdBy)
        base.orFilter('terms', 'viewerUsers', [createdBy])
        base.orFilter('terms', 'adminUsers', [createdBy])
    }
    if (groups?.length > 0) {
        base.orFilter('terms', 'adminGroups', groups)
        base.orFilter('terms', 'viewerGroups', groups)
    }
    base.filterMinimumShouldMatch(1)

    return base.build()
}
