import keyMap from './keymap'

import { useAPISWRV } from '~/services/api/useAPI'

const QueryLogs = (payload: any, cacheKey?: any) =>
    useAPISWRV(keyMap.QUERY_LOGS, 'POST', cacheKey, payload)

export const Logs = {
    QueryLogs,
}
