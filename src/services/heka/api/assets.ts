import { KeyMaps } from '../heka_keyMaps'
import { useAPIAsyncState, useAPIPromise } from '~/api/useAPI'


const GetSampleData = (body: Record<string, any>) => useAPIAsyncState(KeyMaps.asset.PREVIEW_TABLE(), 'POST', {
    body,
})

export const Assets = {
    GetSampleData,
}
