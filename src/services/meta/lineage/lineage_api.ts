import { ComputedRef, Ref } from 'vue'
import { useAPI } from '~/services/api/useAPI'
import { map } from './key'
import { assetInterface } from '~/types/assets/asset.interface'

export interface getLineageOptions {
    guid: string
    depth: number
    direction: string
}

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
}
