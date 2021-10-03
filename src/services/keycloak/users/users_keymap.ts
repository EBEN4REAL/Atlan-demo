import { getAPIPath } from '~/api'

export const LIST_USERS = 'LIST_USERS'
export const GET_USER_SESSIONS = 'GET_USER_SESSIONS'
export const SIGN_OUT_ALL_SESSIONS = 'SIGN_OUT_ALL_SESSIONS'
export const SIGN_OUT_SESSION_BY_ID = 'SIGN_OUT_SESSION_BY_ID'
export const GET_USER_ACCESS_LOGS = 'GET_USER_ACCESS_LOGS'
export const GET_USER = 'GET_USER'
export const UPDATE_USER = 'UPDATE_USER'
export const UPDATE_USER_ROLE = 'UPDATE_USER_ROLE'
export const ADD_USER_TO_GROUPS = 'ADD_USER_TO_GROUPS'
export const RESEND_INVITATION_EMAIL = 'RESEND_INVITATION_EMAIL'
export const REVOKE_INVITATION = 'REVOKE_INVITATION'
export const INVITE_USERS = 'INVITE_USERS'

const userMap: Record<string, (...params: any) => string> = {
    [LIST_USERS]: () => getAPIPath('auth/tenants/default', '/users'),
    [GET_USER]: () => getAPIPath('auth/tenants/default', '/users'),
    [UPDATE_USER]: ({ id }) => getAPIPath('auth/tenants/default', `/users/${id}`),
    [GET_USER_SESSIONS]: ({ id }) =>
        getAPIPath('auth/tenants/default', `/users/${id}/sessions`),
    [SIGN_OUT_ALL_SESSIONS]: ({ id }) =>
        getAPIPath('auth/tenants/default', `/users/${id}/sessions/delete`),
    [SIGN_OUT_SESSION_BY_ID]: ({ id }) =>
        getAPIPath('auth/tenants/default', `/users/sessions/${id}/delete`),
    [GET_USER_ACCESS_LOGS]: ({ id }) =>
        getAPIPath('auth/tenants/default', `/users/${id}/events`),
    [UPDATE_USER_ROLE]: ({ id }) =>
        getAPIPath('auth/tenants/default', `/users/${id}/roles/update`),
    [ADD_USER_TO_GROUPS]: ({ id }) => getAPIPath('auth/tenants/default', `/users/${id}/groups`),
    [RESEND_INVITATION_EMAIL]: ({ id }) =>
        getAPIPath('auth/tenants/default', `/users/${id}/resendinvite`),
    [REVOKE_INVITATION]: ({ id }) => getAPIPath('auth/tenants/default', `/users/${id}/delete`),
    [INVITE_USERS]: () => getAPIPath('auth/tenants/default', `/users`),
}

export default userMap
