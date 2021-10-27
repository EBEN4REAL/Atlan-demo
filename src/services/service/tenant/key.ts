import { getAPIPath } from '~/services/api/common'
import { BASE_PATH } from '..'

export const GET_TENANT = 'GET_TENANT'
export const POST_TENANT = 'POST_TENANT'

export const map = {
    [GET_TENANT]: () => getAPIPath(BASE_PATH, '/tenants/default'),
    [POST_TENANT]: () => getAPIPath(BASE_PATH, '/tenants/default'),
}
