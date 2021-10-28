import { getAPIPath } from '~/services/api/common'

import { BASE_PATH } from '..'

export const ENTITY_BULK_UPDATE = 'ENTITY_BULK_UPDATE'

export const map = {
    [ENTITY_BULK_UPDATE]: () => getAPIPath(BASE_PATH, '/entity/bulk'),
}
