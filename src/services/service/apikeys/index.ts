/* eslint-disable import/prefer-default-export */
import { map } from './key'
import { useAPI } from '~/services/api/useAPI'

import { useOptions } from '~/services/api/common'

const List = (params?: any, options?: useOptions) =>
    useAPI(map.LIST_API_KEYS, 'GET', { params }, options || {})
const Update = (body: any, options?: useOptions) =>
    useAPI(
        map.UPDATE_API_KEY,
        'POST',
        {
            body,
            pathVariables: {
                id: body.id!,
            },
        },
        options || {}
    )
const Create = (body: any, options?: useOptions) =>
    useAPI(
        map.CREATE_API_KEY,
        'POST',
        {
            body,
        },
        options || {}
    )
const Delete = (id: any, options?: useOptions) => {
    return useAPI(
        map.DELETE_API_KEY,
        'DELETE',
        {
            pathVariables: { id },
        },
        options || {}
    )
}
export const APIKey = {
    List,
    Update,
    Create,
    Delete,
}
