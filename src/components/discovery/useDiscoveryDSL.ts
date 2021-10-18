import bodybuilder from 'bodybuilder'

export default function useDiscoveryDSL(filters: Record<string, any>) {
    const query = bodybuilder()
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

                if (statuses?.length)
                    query.filter('terms', 'Asset.certificateStatus', statuses)

                break
            }
            case 'classifications': {
                // We use individual `term` filter when using AND operator
                // and `terms` filter when it is OR operator
                if (fltrObj?.noClassificationsAssigned) {
                    query.notQuery('exists', 'field', '__traitNames')
                } else if (fltrObj?.checked?.length) {
                    if (fltrObj?.operator === 'AND') {
                        fltrObj?.checked?.forEach((val) => {
                            query.filter('term', '__traitNames', val)
                        })
                    } else if (fltrObj?.operator === 'OR') {
                        query.filter('terms', '__traitNames', fltrObj?.checked)
                    }
                }
                // TODO: Add the classification addedBy filter to the payload
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
