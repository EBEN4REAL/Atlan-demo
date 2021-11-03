import { getAPIPath, PathParams } from '~/services/api/common'

import { BASE_PATH } from '..'


export const ENTITY_BULK_UPDATE = 'ENTITY_BULK_UPDATE'
export const CREATE_README = 'CREATE_README'
export const ADD_RESOURCE = 'ADD_RESOURCE'
export const GET_ASSET_AUDIT = 'GET_ASSET_AUDIT'

export const map = {
    [ENTITY_BULK_UPDATE]: () => getAPIPath(BASE_PATH, '/entity/bulk'),
    [CREATE_README]: () => getAPIPath(BASE_PATH, '/entity'),
    [ADD_RESOURCE]: () => getAPIPath(BASE_PATH, '/entity'),
    [GET_ASSET_AUDIT]: ({ guid }: PathParams) =>
        getAPIPath('meta', `/entity/${guid}/audit`)
}
