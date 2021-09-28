import { KeyMaps } from '~/api/keyMap'
import { useAPIAsyncState } from '~/api/useAPI'
import { BasicSearchResponse } from '~/types/insights/savedQuery.interface'

const serviceAlias = 'auth/atlas'

const CreateSavedQuery = (body: Record<string, any>) => {
    const { data, error, isLoading } = useAPIAsyncState<
        BasicSearchResponse<any>
    >(KeyMaps.insights.CREATE_SAVED_QUERY, 'POST', {
        body,
    })
    return { data, error, isLoading }
}

export const Insights = {
    CreateSavedQuery,
}
