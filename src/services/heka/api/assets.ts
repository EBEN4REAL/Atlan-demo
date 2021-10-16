import { KeyMaps } from '../heka_keyMaps'
import { useAPIAsyncState } from '~/api/useAPI'
import { RequestAttributes } from '~/types/atlas/requests'

const GetSampleData = (body: Record<string, any>) => {
    const { data, error, mutate, isLoading } = useAPIAsyncState<{
        records: RequestAttributes[]
    }>(KeyMaps.asset.PREVIEW_TABLE, 'POST', {
        body,
    })

    return { data, error, mutate, isLoading }
}

export const Assets = {
    GetSampleData,
}
