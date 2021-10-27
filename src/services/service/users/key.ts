import { getAPIPath } from '~/services/api/common'
import { BASE_PATH } from '..'

export const LIST_USERS = 'LIST_USERS'

export const map = {
    [LIST_USERS]: () => getAPIPath(BASE_PATH, '/users'),
}
