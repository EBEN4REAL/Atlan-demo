import { getAPIPath, PathParams } from '~/services/api/common'

export const BASIC_SEARCH = 'BASIC_SEARCH'
export const CREATE_SAVED_QUERY = 'CREATE_SAVED_QUERY'
export const CREATE_QUERY_FOLDER = 'CREATE_QUERY_FOLDER'
export const GET_SAVED_QUERY = 'GET_SAVED_QUERY'
export const UPDATE_SAVED_QUERY = 'UPDATE_SAVED_QUERY'
export const UPDATE_SAVED_FOLDER = 'UPDATE_SAVED_FOLDER'
export const DELETE_ENTITY = 'DELETE_ENTITY'

export const map = {
    [BASIC_SEARCH]: () => getAPIPath('meta', '/search/basic'),
    [CREATE_SAVED_QUERY]: () => getAPIPath('meta', '/entity'),
    [CREATE_QUERY_FOLDER]: () => getAPIPath('meta', '/entity'),
    [GET_SAVED_QUERY]: ({ guid }: PathParams) =>
        getAPIPath('meta', `/entity/guid/${guid}`),
    [UPDATE_SAVED_QUERY]: () => getAPIPath('meta', `/entity?replaceClassifications=true`),
    [UPDATE_SAVED_FOLDER]: () => getAPIPath('meta', `/entity?replaceClassifications=true`),
    [DELETE_ENTITY]: ({ guid }: Record<string, any>) =>
        getAPIPath('meta', `/entity/bulk?guid=${guid}`),
}
