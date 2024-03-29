import { getAPIPath } from '~/services/api/common'
import { BASE_PATH } from '..'

export const LIST_GROUPS = 'LIST_GROUPS'
export const LIST_GROUP = 'LIST_GROUP'
export const UPDATE_GROUP = 'UPDATE_GROUP'
export const DELETE_GROUP = 'DELETE_GROUP'
export const CREATE_GROUP = 'CREATE_GROUP'
export const LIST_MEMBERS = 'LIST_MEMBERS'
export const REMOVE_MEMBERS_FROM_GROUP = 'REMOVE_MEMBERS_FROM_GROUP'
export const ADD_MEMBERS_TO_GROUP = 'ADD_MEMBERS_TO_GROUP'

export const map = {
    [LIST_GROUPS]: () => getAPIPath(BASE_PATH, '/groups'),
    [LIST_MEMBERS]: ({ id }) => getAPIPath('service', `/groups/${id}/members`),
    [UPDATE_GROUP]: ({ id }) => getAPIPath('service', `/groups/${id}`),
    [DELETE_GROUP]: ({ id }) => getAPIPath('service', `/groups/${id}/delete`),
    [CREATE_GROUP]: () => getAPIPath('service', `/groups`),
    [REMOVE_MEMBERS_FROM_GROUP]: ({ id }) =>
        getAPIPath(BASE_PATH, `/groups/${id}/members/remove`),
    [ADD_MEMBERS_TO_GROUP]: ({ id }) =>
        getAPIPath(BASE_PATH, `/groups/${id}/members`),
}
