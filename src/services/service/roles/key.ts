import { getAPIPath } from '~/services/api/common'
import { BASE_PATH } from '..'

export const LIST_ROLES = 'LIST_ROLES'

export const map = {
    [LIST_ROLES]: () => getAPIPath(BASE_PATH, '/roles'),
}
