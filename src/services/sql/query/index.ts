import { ref, Ref } from 'vue'
import { map } from './key'

// import { useAPIAsyncState, useAPIPromise } from '~/services/api/useAPI'
import { useAPI } from '~/services/api/useAPI'
import { useAPIPromise } from '~/services/api/useAPIPromise'
import { useOptions } from '~/services/api/common'

// import {
//     BasicSearchResponse,
//     SavedQueryResponse,
//     Query,
// } from '~/types/insights/savedQuery.interface'
import { autosuggestionResponse } from '~/types/insights/autosuggestionEntity.interface'
// import { InternalAttributes, SavedQueryAttributes } from '~/constant/projection'

const GetAutoSuggestions = (
    body: Record<string, any>,
    cancelTokenSource: Ref<any>
) => {
    return useAPIPromise(map.insights.GET_AUTO_SUGGESTIONS(), 'POST', {
        body,
        options: {
            cancelToken: cancelTokenSource.value.token,
        },
    }) as Promise<autosuggestionResponse>
}
const AbortQuery = (body: Record<string, any>) => {
    return useAPIPromise(map.insights.ABORT_QUERY(), 'POST', {
        body,
    }) as Promise<any>
}

const GetSampleData = (body: Record<string, any>, options?: useOptions) => {
    return useAPI(map.asset.PREVIEW_TABLE, 'POST', {
        body,
    }, options || {}
    )
}
export const Insights = {
    AbortQuery,
    GetAutoSuggestions,
    GetSampleData
}
