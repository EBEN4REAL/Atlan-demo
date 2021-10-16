import { ref } from 'vue'
import { KeyMaps } from '../heka_keyMaps'
import { useAPIAsyncState, useAPIPromise } from '~/services/api/useAPI'

import {
    BasicSearchResponse,
    SavedQueryResponse,
    Query,
} from '~/types/insights/savedQuery.interface'
import { autosuggestionResponse } from '~/types/insights/autosuggestionEntity.interface'
import { BaseAttributes, SavedQueryAttributes } from '~/constant/projection'

const GetAutoSuggestions = (body: Record<string, any>) => {
    return useAPIPromise(KeyMaps.insights.GET_AUTO_SUGGESTIONS(), 'POST', {
        body,
    }) as Promise<autosuggestionResponse>
}

export const Insights = {
    GetAutoSuggestions,
}
