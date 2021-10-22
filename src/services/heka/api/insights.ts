import { ref, Ref } from 'vue'
import { KeyMaps } from '../heka_keyMaps'
import { useAPIAsyncState, useAPIPromise } from '~/services/api/useAPI'

import {
    BasicSearchResponse,
    SavedQueryResponse,
    Query,
} from '~/types/insights/savedQuery.interface'
import { autosuggestionResponse } from '~/types/insights/autosuggestionEntity.interface'
import { BaseAttributes, SavedQueryAttributes } from '~/constant/projection'

const GetAutoSuggestions = (
    body: Record<string, any>,
    cancelTokenSource: Ref<any>
) => {
    return useAPIPromise(KeyMaps.insights.GET_AUTO_SUGGESTIONS(), 'POST', {
        body,
        options: {
            cancelToken: cancelTokenSource.value.token,
        },
    }) as Promise<autosuggestionResponse>
}
const AbortQuery = (body: Record<string, any>) => {
    return useAPIPromise(KeyMaps.insights.ABORT_QUERY(), 'POST', {
        body,
    }) as Promise<any>
}

export const Insights = {
    AbortQuery,
    GetAutoSuggestions,
}
