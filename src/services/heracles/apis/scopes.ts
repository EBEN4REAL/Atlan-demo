import { useAPIAsyncState } from '~/api/useAPI'
import { IScopes } from '~/types/accessPolicies/scopes'
import { heracles_keymap } from '../heracles_keymap'

const getScopes = () =>
    useAPIAsyncState<{ scopes: IScopes[] }>(
        heracles_keymap.personas.LIST_SCOPES,
        'GET',
        {
            params: { type: 'scopeUniverse' },
            initialState: { scopes: [] },
        }
    )

export default {
    getScopes,
}
