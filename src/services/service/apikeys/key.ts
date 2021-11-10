import { getAPIPath } from '~/services/api/common'

import { BASE_PATH } from '..'

export const LIST_API_KEYS = 'LIST_API_KEYS'
export const UPDATE_API_KEY = 'UPDATE_API_KEY'
export const CREATE_API_KEY = 'CREATE_API_KEY'

export const map = {
    [LIST_API_KEYS]: () => getAPIPath(BASE_PATH, '/apikeys'),
    [UPDATE_API_KEY]: ({ id }) => getAPIPath(BASE_PATH, `/apikeys/${id}`),
    [CREATE_API_KEY]: () => getAPIPath(BASE_PATH, `/apikeys`),
}
