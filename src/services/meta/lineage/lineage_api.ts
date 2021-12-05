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
        map.GET_LINEAGE,
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

const getLineage = (
    options:
        | getLineageOptions
        | Ref<getLineageOptions>
        | ComputedRef<getLineageOptions>,
    asyncOptions
) =>
    useAPI(
        map.GET_LINEAGE,
        'GET',
        {
            pathVariables: options,
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
