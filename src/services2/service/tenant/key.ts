import { getAPIPath } from '~/services2/api/common'
import { BASE_PATH } from '..'

export const GET_TENANT = 'GET_TENANT'

export const map = {
    [GET_TENANT]: () => getAPIPath(BASE_PATH, '/tenants/default'),
}
