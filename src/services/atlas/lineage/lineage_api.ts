import { useAPIAsyncState } from '~/services/api/useAPI'
import { KeyMaps } from '~/api/keyMap'
import { Ref } from 'vue'
import { assetInterface } from '~/types/assets/asset.interface'

export interface getLineageOptions {
    guid: string
    depth: number
    direction: string
}

const getLineage = (options: getLineageOptions | Ref<getLineageOptions>) =>
    useAPIAsyncState(KeyMaps.lineage.GET_LINEAGE, 'GET', {
        pathVariables: options,
        initialState: {
            guidEntityMap: <Record<string, assetInterface>>{},
            relations: [],
        },
    })

export const lineageServiceAPI = {
    getLineage,
}