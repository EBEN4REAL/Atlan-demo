/* eslint-disable import/prefer-default-export */
import { Ref } from 'vue'
import { map } from './key'
import { useAPI } from '~/services/api/useAPI'

import { useOptions } from '~/services/api/common'

const List = (params: any, options?: useOptions) =>
    useAPI(map.LIST_GROUPS, 'GET', { params }, options || {})

const DeleteGroup = (id: string, options?: useOptions) =>
    useAPI(map.DELETE_GROUP, 'POST', { pathVariables: { id } }, options || {})

const RemoveMembersFromGroup = (
    id: string,
    body: Ref<Record<string, any>> | Record<string, any>,
    options?: useOptions
) =>
    useAPI(
        map.REMOVE_MEMBERS_FROM_GROUP,
        'POST',
        { body, pathVariables: { id } },
        options || {}
    )

const CreateGroup = (
    body: Ref<Record<string, any>> | Record<string, any>,
    options?: useOptions
) => useAPI(map.CREATE_GROUP, 'POST', { body }, options || {})

const AddMembers = (
    id: string,
    body: Ref<Record<string, any>> | Record<string, any>,
    options?: useOptions
) =>
    useAPI(
        map.ADD_MEMBERS_TO_GROUP,
        'POST',
        {
            body,
            pathVariables: { id },
        },
        options || {}
    )

const UpdateGroup = (
    id: string,
    body: Ref<Record<string, any>> | Record<string, any>,
    options?: useOptions
) =>
    useAPI(
        map.UPDATE_GROUP,
        'POST',
        {
            body,
            pathVariables: { id },
        },
        options || {}
    )

const getGroupMembers = (pathVariables, params, options) =>
    useAPI(
        map.LIST_MEMBERS,
        'GET',
        {
            params,
            pathVariables,
        },
        options || {}
    )

export const Groups = {
    getGroupMembers,
    List,
    RemoveMembersFromGroup,
    DeleteGroup,
    CreateGroup,
    AddMembers,
    UpdateGroup,
}
