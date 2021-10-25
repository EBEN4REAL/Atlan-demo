import { getAPIPath } from '~/services2/api/common'

import { BASE_PATH } from '..'

export const GET_TYPEDEFS = 'GET_TYPEDEFS'

export const map = {
    [GET_TYPEDEFS]: () => getAPIPath(BASE_PATH, '/types/typedefs'),
}
