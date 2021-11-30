import { Ref } from 'vue'
import { map } from './key'

import { useAPI } from '~/services/api/useAPI'
import { useAPIPromise } from '~/services/api/useAPIPromise'
import { useOptions } from '~/services/api/common'
import { autosuggestionResponse } from '~/types/insights/autosuggestionEntity.interface'
import { map as IndexMap } from '~/services/meta/search/key'

const GetAutoSuggestions = (
    body: Record<string, any>,
    cancelTokenSource: Ref<any>
) =>
    useAPIPromise(IndexMap.INDEX_SEARCH(), 'POST', {
        body,
        options: {
            cancelToken: cancelTokenSource.value.token,
        },
    }) as Promise<autosuggestionResponse>

const AbortQuery = (body: Record<string, any>) =>
    useAPIPromise(map.insights.ABORT_QUERY(), 'POST', {
        body,
    }) as Promise<any>

const TestQuery = (
    body: Ref<Record<string, any>> | Record<string, any>,
    options?: useOptions
) =>
    useAPI(
        map.insights.TEST_QUERY,
        'POST',
        {
            body,
        },
        options || {}
    )

const GetSampleData = (body: Record<string, any>, options?: useOptions) =>
    useAPI(
        map.asset.PREVIEW_TABLE,
        'POST',
        {
            body,
        },
        options || {}
    )

export const Insights = {
    AbortQuery,
    GetAutoSuggestions,
    GetSampleData,
    TestQuery,
}
