import { List as StatusList } from '~/constant/status'
import { List as AssetCategoryList } from '~/constant/assetCategory'

function getFiltersAppliedString(filterId: string, dataMap) {
    switch (filterId) {
        case 'connector': {
            let facetFiltersData = dataMap[filterId].connectorsPayload
            let str = ''
            console.log(facetFiltersData, 'applied')
            if (facetFiltersData?.connector) {
                str += facetFiltersData?.connector
            }
            return str
        }
        case 'assetCategory': {
            let facetFiltersData = dataMap[filterId].checked
            facetFiltersData = facetFiltersData.map(
                (assetCategoryId: string) =>
                    AssetCategoryList?.find(
                        (assetCategory: any) =>
                            assetCategory.id === assetCategoryId
                    ).label
            )
            if (facetFiltersData.length > 2) {
                return `${facetFiltersData.slice(0, 2).join(', ')} +${
                    facetFiltersData.length - 2
                } others`
            }

            return facetFiltersData.slice(0, 2).join(', ')
        }
        case 'status': {
            let facetFiltersData = dataMap[filterId].checked
            facetFiltersData = facetFiltersData.map(
                (statusId: string) =>
                    StatusList?.find((status: any) => status.id === statusId)
                        .label
            )
            if (facetFiltersData.length > 3) {
                return `${facetFiltersData.slice(0, 3).join(', ')} +${
                    facetFiltersData.length - 3
                } others`
            }

            return facetFiltersData.slice(0, 3).join(', ')
        }
        case 'classifications': {
            const facetFiltersData = dataMap[filterId].checked
            if (facetFiltersData.length > 3) {
                return `${facetFiltersData.slice(0, 3).join(', ')} +${
                    facetFiltersData.length - 3
                } others`
            }
            let noClassificationsAssigned = dataMap[filterId]
                .noClassificationsAssigned
                ? 'No Classifications'
                : ''

            return (
                noClassificationsAssigned +
                facetFiltersData.slice(0, 3).join(', ')
            )
        }
        case 'owners': {
            const users = dataMap[filterId].userValue
            const groups = dataMap[filterId].groupValue
            const noOwnerAssigned = dataMap[filterId].noOwnerAssigned
            let appliedOwnersString = ''
            if (users && users?.length > 0) {
                if (users?.length === 1)
                    appliedOwnersString += `${users.length} user`
                else appliedOwnersString += `${users.length} users`
            }
            if (groups && groups?.length > 0) {
                if (appliedOwnersString.length > 0) {
                    if (groups.length === 1)
                        appliedOwnersString += ` & ${groups.length} group`
                    else appliedOwnersString += ` & ${groups.length} groups`
                } else if (groups.length === 1)
                    appliedOwnersString += `${groups.length} group`
                else appliedOwnersString += `${groups.length} groups`
            }
            if (noOwnerAssigned) appliedOwnersString += 'No Owners'

            return appliedOwnersString
        }
        case 'advanced': {
            // ? default fall back to bm filter
            const totalCount = Object.values(dataMap[filterId]?.applied).length

            return totalCount ? `${totalCount} condition(s) applied` : ''
        }
        default: {
            // ? default fall back to bm filter
            const totalCount = Object.values(dataMap[filterId]?.applied).length

            return totalCount ? `${totalCount} condition(s) applied` : ''
        }
    }
}
export default getFiltersAppliedString
