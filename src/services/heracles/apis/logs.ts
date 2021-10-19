import keyMap from './keymap'

import { heracles_keymap } from '../heracles_keymap'
import { useAPISWRV } from '~/services/api/useAPI'

const QueryAuditLogs = (payload: any, cacheKey?: any) =>
    useAPISWRV(heracles_keymap.INDEX_SEARCH, 'POST', cacheKey, payload)

export const Discovery = {
    IndexSearch,
}
