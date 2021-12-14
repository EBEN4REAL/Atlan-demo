import { getAPIPath } from '~/services/api/common'

import { BASE_PATH } from '..'

export const GET_TYPEDEFS = 'GET_TYPEDEFS'
export const CREATE_TYPEDEFS = 'CREATE_TYPEDEFS'
export const EDIT_TYPEDEFS = 'EDIT_TYPEDEFS'
export const DELETE_TYPEDEF = 'DELETE_TYPEDEF'
export const UPDATE_CUSTOM_METADATA = 'UPDATE_CUSTOM_METADATA'
export const UPDATE_ASSET_BUSINESS_METADATA = 'UPDATE_ASSET_BUSINESS_METADATA'

export const map = {
    [GET_TYPEDEFS]: () =>
        getAPIPath(
            BASE_PATH,
            '/types/typedefs?type=enum&type=classification&type=business_metadata'
        ),
    [CREATE_TYPEDEFS]: () => getAPIPath(BASE_PATH, '/types/typedefs'),
    [EDIT_TYPEDEFS]: () => getAPIPath(BASE_PATH, '/types/typedefs'),
    [DELETE_TYPEDEF]: ({ name }: Record<string, any>) =>
        getAPIPath(BASE_PATH, `/types/typedef/name/${name}`),
    [UPDATE_CUSTOM_METADATA]: ({ guid }) =>
        getAPIPath(BASE_PATH, `/entity/guid/${guid}/businessmetadata`),
    [UPDATE_ASSET_BUSINESS_METADATA]: ({ guid }) =>
        getAPIPath(BASE_PATH, `/entity/guid/${guid}/businessmetadata`),
}
