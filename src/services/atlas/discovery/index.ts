import keyMap from './keymap'

import { useAPISWRV } from '~/api/useAPI'

const IndexSearch = (payload: any, cacheKey?: any) =>
    useAPISWRV(keyMap.INDEX_SEARCH, 'POST', cacheKey, payload)

export const Discovery = {
    IndexSearch,
}
