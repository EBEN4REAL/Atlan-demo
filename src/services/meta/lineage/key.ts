import { getAPIPath, PathParams } from '~/services/api/common'



export const GET_LINEAGE = 'GET_LINEAGE'

export const map = {
    GET_LINEAGE: ({ guid, depth, direction }: PathParams) =>
        getAPIPath(
            'meta',
            `/lineage/${guid}?depth=${depth}&direction=${direction}`
        ),
}
