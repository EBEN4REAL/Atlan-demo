import { ComputedRef, Ref } from 'vue'
import { useAPI } from '~/services/api/useAPI'
import { map } from './key'
import { assetInterface } from '~/types/assets/asset.interface'
import { useOptions } from '~/services/api/common'

export interface getLineageOptions {
    guid: string
    depth: number
    direction: string
}

const getLineageUpdated = (
    guid: string,
    params: Ref<getLineageOptions> | getLineageOptions,
    options: useOptions
) =>
    useAPI(
        map.GET_LINEAGE_UPDATED,
        'GET',
        {
            pathVariables: { guid },
            params,
            initialState: {
                guidEntityMap: <Record<string, assetInterface>>{},
                relations: [],
            },
        },
        options || {}
    )

const getLineage = (body, asyncOptions) =>
    useAPI(
        map.GET_LINEAGE,
        'POST',
        {
            body,
            pathVariables: {},
            initialState: {
                guidEntityMap: <Record<string, assetInterface>>{},
                relations: [],
            },
        },

        {
            asyncOptions,
        }
    )

export const lineageServiceAPI = {
    getLineage,
    getLineageUpdated,
}
