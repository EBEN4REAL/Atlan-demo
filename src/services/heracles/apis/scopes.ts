import { useAPIAsyncState } from '~/api/useAPI'
import { IScopes } from '~/types/accessPolicies/scopes'
import { KeyMaps } from '../keyMaps'

const getScopes = () =>
    useAPIAsyncState<{ scopes: IScopes[] }>(
        KeyMaps.personas.LIST_SCOPES,
        'GET',
        {
            params: { type: 'scopeUniverse' },
            initialState: { scopes: [] },
        }
    )

export default {
    getScopes,
}
