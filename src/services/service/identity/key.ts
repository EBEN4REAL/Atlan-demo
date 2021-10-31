import { getAPIPath } from '~/services/api/common'
import { BASE_PATH } from '..'

export const CREATE_IDP = 'CREATE_IDP'
export const UPDATE_IDP = 'UPDATE_IDP'
export const DELETE_IDP = 'DELETE_IDP'

export const GET_MAPPER = 'GET_MAPPER'
export const CREATE_MAPPER = 'CREATE_MAPPER'
export const UPDATE_MAPPER = 'UPDATE_MAPPER'

export const GET_DEFAULT_IDP = 'GET_DEFAULT_IDP'
export const SET_DEFAULT_IDP = 'SET_DEFAULT_IDP'
export const DELETE_DEFAULT_IDP = 'DELETE_DEFAULT_IDP'
// export const UPDATE_IDP = 'UPDATE_IDP'
// export const UPDATE_IDP = 'UPDATE_IDP'

export const map = {
    [CREATE_IDP]: () => getAPIPath(BASE_PATH, '/idp'),
    [UPDATE_IDP]: ({ alias }) => getAPIPath(BASE_PATH, `/idp/${alias}`),
    [DELETE_IDP]: ({ alias }) => getAPIPath(BASE_PATH, `/idp/${alias}/delete`),
    [GET_MAPPER]: ({ alias }) => getAPIPath(BASE_PATH, `/idp/${alias}/mappers`),
    [CREATE_MAPPER]: ({ alias }) =>
        getAPIPath(BASE_PATH, `/idp/${alias}/mappers`),
    [UPDATE_MAPPER]: ({ alias, id }) =>
        getAPIPath(BASE_PATH, `/idp/${alias}/mappers/${id}`),

    [GET_DEFAULT_IDP]: () => getAPIPath(BASE_PATH, `/idp/default`),

    [SET_DEFAULT_IDP]: ({ alias }) =>
        getAPIPath(BASE_PATH, `/idp/default/${alias}`),

    [DELETE_DEFAULT_IDP]: ({ alias }) =>
        getAPIPath(BASE_PATH, `/idp/default/${alias}/delete`),
}
