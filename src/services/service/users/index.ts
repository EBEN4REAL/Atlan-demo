/* eslint-disable import/prefer-default-export */
import { computed, ComputedRef, Ref } from 'vue'
import { map } from './key'
import { useAPI } from '~/services/api/useAPI'

import { useOptions } from '~/services/api/common'

const List = (params: any, options?: useOptions) =>
    useAPI(map.LIST_USERS, 'GET', { params }, options || {})

const ListUserGroups = (
    params: any,
    id: ComputedRef<string>,
    options?: useOptions
) => {
    const pathVariables = computed(() => ({ id: id.value }))
    return useAPI(
        map.GET_USER_GROUPS,
        'GET',
        { params, pathVariables },
        options || {}
    )
}

const GetUserSessions = (pathVariables, params?: any, options?: useOptions) =>
    useAPI(
        map.GET_USER_SESSIONS,
        'GET',
        { params, pathVariables },
        options || {}
    )

const SignOutAllSessions = (id: string, options?: useOptions) =>
    useAPI(
        map.SIGN_OUT_ALL_SESSIONS,
        'POST',
        { pathVariables: { id } },
        options || {}
    )

const SignOutSessionById = (id: string, options?: useOptions) =>
    useAPI(
        map.SIGN_OUT_SESSION_BY_ID,
        'POST',
        { pathVariables: { id } },
        options || {}
    )

// Access Logs
const GetUserAccessLogs = (pathVariables, params?: any, options?: any) => {
    return useAPI(
        map.GET_USER_ACCESS_LOGS,
        'GET',
        { params, pathVariables },
        options || {}
    )
}

// User Actions
const UpdateUser = (
    id: string,
    body: Ref<Record<string, any>> | Record<string, any>,
    options?: any
) =>
    useAPI(
        map.UPDATE_USER,
        'POST',
        { body, pathVariables: { id } },
        options || {}
    )

const UpdateUserRole = (
    id: string,
    body: Ref<Record<string, any>> | Record<string, any>,
    options?: any
) =>
    useAPI(
        map.UPDATE_USER_ROLE,
        'POST',
        { body, pathVariables: { id } },
        options || {}
    )

const AddGroups = (
    id: string,
    body: Ref<Record<string, any>> | Record<string, any>,
    options?: any
) =>
    useAPI(
        map.ADD_USER_TO_GROUPS,
        'POST',
        { body, pathVariables: { id } },
        options || {}
    )

const ResendVerificationEmail = (
    id: string,

    options?: any
) =>
    useAPI(
        map.RESEND_INVITATION_EMAIL,
        'POST',
        { pathVariables: { id } },
        options || {}
    )

const RevokeInvitation = (id: string, options?: any) =>
    useAPI(
        map.REVOKE_INVITATION,
        'POST',
        { pathVariables: { id } },
        options || {}
    )

const InviteUsers = (body, options?: any) =>
    useAPI(map.INVITE_USERS, 'POST', { body }, options || {})

const ListBulk = (
    body: Ref<Record<string, any>> | Record<string, any>,
    options?: any
) => useAPI(map.LIST_BULK, 'POST', { body }, options || {})

export interface IUser {
    email: string
    firstName: string
    lastName: string
    username: string
}

export const Users = {
    ListUserGroups,
    List,
    GetUserSessions,
    RevokeInvitation,
    InviteUsers,
    ResendVerificationEmail,
    AddGroups,
    UpdateUserRole,
    SignOutAllSessions,
    UpdateUser,
    GetUserAccessLogs,
    SignOutSessionById,
    ListBulk,
}
