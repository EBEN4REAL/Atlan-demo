import { KeyMaps } from '../atlas_keyMaps'
import { useAPISWRV } from '~/services/api/useAPI'

const IndexSearch = (payload: any, cacheKey?: any) =>
    useAPISWRV(KeyMaps.ES.INDEX_SEARCH, 'POST', cacheKey, payload)

export const Discovery = {
    IndexSearch,
}
