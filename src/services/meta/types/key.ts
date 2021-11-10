import { getAPIPath } from '~/services/api/common'

import { BASE_PATH } from '..'

export const GET_TYPEDEFS = 'GET_TYPEDEFS'
export const CREATE_TYPEDEFS = 'CREATE_TYPEDEFS'

export const map = {
    [GET_TYPEDEFS]: () => getAPIPath(BASE_PATH, '/types/typedefs'),
    [CREATE_TYPEDEFS]: () => getAPIPath(BASE_PATH, '/types/typedefs'),
}
