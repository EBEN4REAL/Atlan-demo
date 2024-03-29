import { getAPIPath, APIFn } from '~/services/api/common'
import { BASE_PATH } from '..'

export const LIST_USERS = 'LIST_USERS'
export const GET_USER_SESSIONS = 'GET_USER_SESSIONS'
export const SIGN_OUT_ALL_SESSIONS = 'SIGN_OUT_ALL_SESSIONS'
export const SIGN_OUT_SESSION_BY_ID = 'SIGN_OUT_SESSION_BY_ID'
export const GET_USER_ACCESS_LOGS = 'GET_USER_ACCESS_LOGS'
export const UPDATE_USER = 'UPDATE_USER'
export const UPDATE_USER_ROLE = 'UPDATE_USER_ROLE'
export const ADD_USER_TO_GROUPS = 'ADD_USER_TO_GROUPS'
export const RESEND_INVITATION_EMAIL = 'RESEND_INVITATION_EMAIL'
export const REVOKE_INVITATION = 'REVOKE_INVITATION'
export const INVITE_USERS = 'INVITE_USERS'
export const LIST_BULK = 'LIST_BULK'
export const GET_USER_GROUPS = 'GET_USER_GROUPS'

interface Map {
    LIST_USERS: APIFn
    GET_USER_SESSIONS: APIFn
    SIGN_OUT_ALL_SESSIONS: APIFn
    SIGN_OUT_SESSION_BY_ID: APIFn
    GET_USER_ACCESS_LOGS: APIFn
    UPDATE_USER: APIFn
    UPDATE_USER_ROLE: APIFn
    ADD_USER_TO_GROUPS: APIFn
    RESEND_INVITATION_EMAIL: APIFn
    REVOKE_INVITATION: APIFn
    INVITE_USERS: APIFn
    LIST_BULK: APIFn
    GET_USER_GROUPS: APIFn
}

export const map: Map = {
    [LIST_USERS]: () => getAPIPath(BASE_PATH, '/users'),
    [GET_USER_SESSIONS]: ({ id }) =>
        getAPIPath('service', `/users/${id}/sessions`),
    [GET_USER_GROUPS]: ({ id }) =>
        getAPIPath('service', `/users/${id}/groups`),
    [SIGN_OUT_ALL_SESSIONS]: ({ id }) =>
        getAPIPath('service', `/users/${id}/sessions/delete`),
    [SIGN_OUT_SESSION_BY_ID]: ({ id }) =>
        getAPIPath('service', `/users/sessions/${id}/delete`),
    [GET_USER_ACCESS_LOGS]: ({ id }) =>
        getAPIPath('service', `/users/${id}/events`),
    [UPDATE_USER_ROLE]: ({ id }) =>
        getAPIPath('service', `/users/${id}/roles/update`),
    [ADD_USER_TO_GROUPS]: ({ id }) =>
        getAPIPath('service', `/users/${id}/groups`),
    [RESEND_INVITATION_EMAIL]: ({ id }) =>
        getAPIPath('service', `/users/${id}/resendinvite`),
    [REVOKE_INVITATION]: ({ id }) =>
        getAPIPath('service', `/users/${id}/delete`),
    [INVITE_USERS]: () => getAPIPath('service', `/users`),
    [UPDATE_USER]: ({ id }) => getAPIPath('service', `/users/${id}`),
    [LIST_BULK]: () => getAPIPath('service', '/users/bulk'),
}
