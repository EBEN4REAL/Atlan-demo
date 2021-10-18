import bodybuilder from 'bodybuilder'

export default function useDiscoveryDSL(filters: Record<string, any>) {
    const query = bodybuilder()
    debugger
    Object.keys(filters ?? {}).forEach((mkey) => {
        const fltrObj = filters[mkey]
        switch (mkey) {
            case 'connector': {
                break
            }
            case 'saved': {
                break
            }
            case 'status': {
                const statuses: string[] = fltrObj.checked
                if (statuses?.includes('is_null')) statuses.push('isNull')

                query.filter('terms', 'Asset.certificateStatus', statuses)
                break
            }
            case 'classifications': {
                break
            }
            case 'owners': {
                break
            }
            case 'advanced': {
                break
            }
            // for BM
            default: {
            }
        }
    })
    return query.build()
}
