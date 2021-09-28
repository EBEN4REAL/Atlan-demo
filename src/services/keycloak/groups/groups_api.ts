import { AxiosRequestConfig } from 'axios'
import {
    UPDATE_GROUP,
    REMOVE_MEMBERS_FROM_GROUP,
    ADD_MEMBERS_TO_GROUP,
    DELETE_GROUP,
    CREATE_GROUP,
} from '@services/keycloak/groups/groups_keymap'
import { getAPIPath, getAxiosClient } from '~/api'
import { useAPI } from '~/api/useAPI'

const serviceAlias = 'auth'

export const URL = {
    GroupList: '/groups',
}

const ListV2 = (params?: any, options?: AxiosRequestConfig) =>
    getAxiosClient().get(getAPIPath(serviceAlias, URL.GroupList), {
        params,
        ...options,
    })
const DeleteGroup = (id: string) => {
    const { data, mutate, error, isReady, isLoading } = useAPI(
        DELETE_GROUP,
        'POST',
        {
            pathVariables: { id },
        }
    )
    return { data, mutate, error, isReady, isLoading }
}
const RemoveMembersFromGroup = (id: string, body: any) => {
    const { data, mutate, error, isReady, isLoading } = useAPI(
        REMOVE_MEMBERS_FROM_GROUP,
        'POST',
        {
            body,
            pathVariables: { id },
        }
    )
    return { data, mutate, error, isReady, isLoading }
}
const CreateGroup = (body: any) => {
    const { data, mutate, error, isReady, isLoading } = useAPI(
        CREATE_GROUP,
        'POST',
        {
            body,
        }
    )
    return { data, mutate, error, isReady, isLoading }
}
const AddMembers = (id: string, body: any) => {
    const { data, mutate, error, isReady, isLoading } = useAPI(
        ADD_MEMBERS_TO_GROUP,
        'POST',
        {
            body,
            pathVariables: { id },
        }
    )
    return { data, mutate, error, isReady, isLoading }
}
const UpdateGroup = (id: string, body) => {
    const { data, error, isLoading, isReady } = useAPI(UPDATE_GROUP, 'POST', {
        body,
        pathVariables: { id },
    })
    return { data, error, isLoading, isReady }
}
export const Group = {
    ListV2,
    RemoveMembersFromGroup,
    DeleteGroup,
    CreateGroup,
    AddMembers,
    UpdateGroup,
}
