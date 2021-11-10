import { ref, Ref } from 'vue'
import { map } from './key'
import { useAPIPromise } from '~/services/api/useAPIPromise'

import { autosuggestionResponse } from '~/types/insights/autosuggestionEntity.interface'

const GetAutoSuggestions = (
    body: Record<string, any>,
    cancelTokenSource: Ref<any>
) => {
    return useAPIPromise(map.GET_AUTO_SUGGESTIONS(), 'POST', {
        body,
        options: {
            cancelToken: cancelTokenSource.value.token,
        },
    }) as Promise<autosuggestionResponse>
}
const AbortQuery = (body: Record<string, any>) => {
    return useAPIPromise(map.ABORT_QUERY(), 'POST', {
        body,
    }) as Promise<any>
}

export const Insights = {
    AbortQuery,
    GetAutoSuggestions,
}
