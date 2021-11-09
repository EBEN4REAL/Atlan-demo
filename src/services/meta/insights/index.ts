import { ref } from 'vue'
import { KeyMaps } from './atlas_keyMaps'
import { useAPIAsyncState, useAPIPromise } from '~/services/api/useAPI'

import {
    BasicSearchResponse,
    SavedQueryResponse,
    Query,
} from '~/types/insights/savedQuery.interface'

const CreateSavedQuery = (body: Record<string, any>) => {
    const { data, error, isLoading } = useAPIAsyncState<
        BasicSearchResponse<any>
    >(KeyMaps.insights.CREATE_SAVED_QUERY, 'POST', {
        body,
    })
    return { data, error, isLoading }
}
const CreateQueryFolder = (body: Record<string, any>) => {
    const { data, error, isLoading } = useAPIAsyncState<
        BasicSearchResponse<any>
    >(KeyMaps.insights.CREATE_QUERY_FOLDER, 'POST', {
        body,
    })
    return { data, error, isLoading }
}
const GetSavedQuery = (guid: string) => {
    const { data, error, isLoading } = useAPIAsyncState<SavedQueryResponse>(
        KeyMaps.insights.GET_SAVED_QUERY,
        'GET',
        {
            pathVariables: { guid },
            params: {
                ignoreRelationships: true,
            },
        }
    )
    return { data, error, isLoading }
}
const UpdateSavedQuery = (body: Record<string, any>) => {
    const { data, error, isLoading } = useAPIAsyncState<SavedQueryResponse>(
        KeyMaps.insights.UPDATE_SAVED_QUERY,
        'POST',
        {
            body,
        }
    )
    return { data, error, isLoading }
}

const DeleteEntity = (guid: string) => {
    const { data, error, isLoading } = useAPIAsyncState<SavedQueryResponse>(
        KeyMaps.insights.DELETE_ENTITY,
        'DELETE',
        {
            pathVariables: {
                guid,
            },
        }
    )
    return { data, error, isLoading }
}
export const Insights = {
    UpdateSavedQuery,
    CreateSavedQuery,
    GetSavedQuery,
    CreateQueryFolder,
    DeleteEntity,
}
