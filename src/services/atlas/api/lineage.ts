import { useAPIAsyncState } from '~/api/useAPI'
import { KeyMaps } from '~/api/keyMap'
import { Ref } from 'vue'

export interface getLineageOptions {
    guid: string
    depth: number
    direction: string
}

const getLineage = (options: getLineageOptions | Ref<getLineageOptions>) =>
    useAPIAsyncState(KeyMaps.lineage.GET_LINEAGE, 'GET', {
        pathVariables: options,
        initialState: { guidEntityMap: {}, relations: [] },
    })

export const lineageServiceAPI = {
    getLineage,
}
