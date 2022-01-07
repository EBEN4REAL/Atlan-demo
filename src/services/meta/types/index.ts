/* eslint-disable import/prefer-default-export */
import { Ref } from 'vue'
import { map } from './key'
import { useAPI } from '~/services/api/useAPI'

import { useOptions } from '~/services/api/common'

import { TypedefsInterface } from '~/types/typedefs/typedefs.interface'

const GetTypedefs = (
    params: Record<string, any> | URLSearchParams,
    options?: useOptions
) => useAPI(map.GET_TYPEDEFS, 'GET', { params }, options || {})

const GetTypedef = (
    params: Record<string, any> | URLSearchParams,
    type,
    options?: useOptions
) => useAPI(map.GET_TYPEDEF, 'GET', { params, pathVariables: { type } }, options || {})

const CreateTypedefs = (
    body: Ref<Record<string, any>> | Record<string, any>,
    options?: useOptions
) =>
    useAPI<TypedefsInterface>(
        map.CREATE_TYPEDEFS,
        'POST',
        { body },
        options || {}
    )

const EditTypedefs = (
    body: Ref<Record<string, any>> | Record<string, any>,
    options?: useOptions
) =>
    useAPI<TypedefsInterface>(map.EDIT_TYPEDEFS, 'PUT', { body }, options || {})

const DeleteTypedefs = (name: string, options?: useOptions) =>
    useAPI<TypedefsInterface>(
        map.DELETE_TYPEDEF,
        'DELETE',
        { pathVariables: { name } },
        options || {}
    )

const updateCustomMetadata = (
    body: Record<string, any>,
    options?: useOptions
) => useAPI<TypedefsInterface>(map.GET_TYPEDEFS, 'PUT', { body }, options || {})

const updateAssetBMChanges = (guid: any, payload: any, options?: useOptions) =>
    useAPI<TypedefsInterface>(
        map.UPDATE_ASSET_BUSINESS_METADATA,
        'POST',
        {
            params: { isOverwrite: true },
            pathVariables: { guid },
            body: payload,
        },
        options || {}
    )

export const Types = {
    GetTypedef,
    GetTypedefs,
    CreateTypedefs,
    EditTypedefs,
    DeleteTypedefs,
    updateCustomMetadata,
    updateAssetBMChanges,
}
