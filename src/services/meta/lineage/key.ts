import { getAPIPath, PathParams } from '~/services/api/common'

import { BASE_PATH } from '..'
export const GET_LINEAGE = 'GET_LINEAGE'

export const GET_LINEAGE_UPDATED = 'GET_LINEAGE_UPDATED'

export const map = {
    GET_LINEAGE: ({ guid, depth, direction, hideProcess }: PathParams) =>
        getAPIPath(
            'meta',
            `/lineage/${guid}?depth=${depth}&direction=${direction}&hideProcess=${hideProcess}`
        ),
    [GET_LINEAGE_UPDATED]: ({ guid }: PathParams) =>
        getAPIPath(BASE_PATH, `/lineage/${guid}`),
}
