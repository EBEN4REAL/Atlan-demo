import { getAPIPath } from '~/services/api/common'
import { BASE_PATH } from '..'

export const LIST_GROUPS = 'LIST_GROUPS'

export const map = {
    [LIST_GROUPS]: () => getAPIPath(BASE_PATH, '/groups'),
}
