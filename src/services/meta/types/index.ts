/* eslint-disable import/prefer-default-export */
import { map } from './key'
import { useAPI } from '~/services/api/useAPI'

import { useOptions } from '~/services/api/common'

import { TypedefsInterface } from '~/types/typedefs/typedefs.interface'

const GetTypedefs = (
    params: Record<string, any> | URLSearchParams,
    options?: useOptions
) => useAPI(map.GET_TYPEDEFS, 'GET', { params }, options || {})

const CreateTypedefs = (body: Record<string, any>, options?: useOptions) =>
    useAPI<TypedefsInterface>(
        map.CREATE_TYPEDEFS,
        'POST',
        { body },
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
    GetTypedefs,
    CreateTypedefs,
    updateCustomMetadata,
    updateAssetBMChanges,
}
