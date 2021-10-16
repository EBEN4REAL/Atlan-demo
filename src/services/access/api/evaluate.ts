import { useAPIAsyncState } from '~/services/api/useAPI'
import { KeyMaps } from '../access_keyMaps'

interface EvaluateResponse {
    action: string
    allowed: boolean
    entityGuid: string
    typeName: string
}

export interface EvaluatesBody {
    entities: {
        action: string
        entityGuid: string
        typeName: string
    }[]
}

export const evaluate = (body: EvaluatesBody) => {
    return useAPIAsyncState<EvaluateResponse[]>(KeyMaps.EVALUATE, 'POST', { body })
}