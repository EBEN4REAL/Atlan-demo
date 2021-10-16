import { getAPIPath } from '~/api'

export const LIST_GROUPS = 'LIST_GROUPS'
export const GET_GROUP = 'GET_GROUP'
export const UPDATE_GROUP = 'UPDATE_GROUP'
export const DELETE_GROUP = 'DELETE_GROUP'
export const CREATE_GROUP = 'CREATE_GROUP'
export const REMOVE_MEMBERS_FROM_GROUP = 'REMOVE_MEMBERS_FROM_GROUP'
export const ADD_MEMBERS_TO_GROUP = 'ADD_MEMBERS_TO_GROUP'

const groupsMap: Record<string, (...params: any) => string> = {
    [LIST_GROUPS]: () => getAPIPath('service', '/groups'),
    [GET_GROUP]: () => getAPIPath('service', `/groups`),
    [UPDATE_GROUP]: ({ id }) => getAPIPath('service', `/groups/${id}`),
    [DELETE_GROUP]: ({ id }) => getAPIPath('service', `/groups/${id}/delete`),
    [CREATE_GROUP]: () => getAPIPath('service', `/groups`),
    [REMOVE_MEMBERS_FROM_GROUP]: ({ id }) =>
        getAPIPath('service', `/groups/${id}/members/remove`),
    [ADD_MEMBERS_TO_GROUP]: ({ id }) =>
        getAPIPath('service', `/groups/${id}/members`),
}

export default groupsMap
