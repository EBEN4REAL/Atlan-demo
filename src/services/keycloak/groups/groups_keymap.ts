import { getAPIPath } from '~/api'

export const LIST_GROUPS = 'LIST_GROUPS'
export const GET_GROUP = 'GET_GROUP'
export const UPDATE_GROUP = 'UPDATE_GROUP'
export const DELETE_GROUP = 'DELETE_GROUP'
export const CREATE_GROUP = 'CREATE_GROUP'
export const REMOVE_MEMBERS_FROM_GROUP = 'REMOVE_MEMBERS_FROM_GROUP'
export const ADD_MEMBERS_TO_GROUP = 'ADD_MEMBERS_TO_GROUP'

const groupsMap: Record<string, (...params: any) => string> = {
    [LIST_GROUPS]: () => getAPIPath('auth', '/groups'),
    [GET_GROUP]: () => getAPIPath('auth', `/groups`),
    [UPDATE_GROUP]: ({ id }) => getAPIPath('auth', `/groups/${id}`),
    [DELETE_GROUP]: ({ id }) => getAPIPath('auth', `/groups/${id}/delete`),
    [CREATE_GROUP]: () => getAPIPath('auth', `/groups`),
    [REMOVE_MEMBERS_FROM_GROUP]: ({ id }) =>
        getAPIPath('auth', `/groups/${id}/members/remove`),
    [ADD_MEMBERS_TO_GROUP]: ({ id }) =>
        getAPIPath('auth', `/groups/${id}/members`),
}

export default groupsMap
