import { KeyMaps } from '../heka_keyMaps'
import { useAPI } from '~/api/useAPI'

const GetSampleData = (body: Record<string, any>) => useAPI(KeyMaps.asset.PREVIEW_TABLE(), 'POST', {
    body,
})

export const Assets = {
    GetSampleData,
}
