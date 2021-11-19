import { getAPIPath } from '~/services/api/common'

import { BASE_PATH } from '..'

export const GET_TYPEDEFS = 'GET_TYPEDEFS'
export const CREATE_TYPEDEFS = 'CREATE_TYPEDEFS'
export const UPDATE_CUSTOM_METADATA = 'UPDATE_CUSTOM_METADATA'

export const map = {
  [GET_TYPEDEFS]: () => getAPIPath(BASE_PATH, '/types/typedefs'),
  [CREATE_TYPEDEFS]: () => getAPIPath(BASE_PATH, '/types/typedefs'),
  [UPDATE_CUSTOM_METADATA]: ({ guid }) =>
    getAPIPath(BASE_PATH, `/entity/guid/${guid}/businessmetadata`),
}
