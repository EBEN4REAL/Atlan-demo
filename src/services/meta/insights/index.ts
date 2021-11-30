import { map} from './key'
import { useAPI } from '~/services/api/useAPI'
import { SavedQueryResponse } from '~/types/insights/savedQuery.interface'
import { BasicSearchResponse } from '~/types/common/atlasSearch.interface'
import { useOptions } from '~/services/api/common'
import { map as Index } from '~/services/meta/search/key'

const CreateSavedQuery = (body: Record<string, any>, options: useOptions) => {
    return useAPI<BasicSearchResponse<any>>(
        map.CREATE_SAVED_QUERY,
        'POST',
        {
            body,
        },
        options || {}
    )
}
const CreateQueryFolder = (body: Record<string, any>,  options: useOptions) => {
    return useAPI<BasicSearchResponse<any>>(
        map.CREATE_QUERY_FOLDER,
        'POST',
        {
            body,
        },
        options || {}
    )
}
const GetSavedQuery = (guid: string, options: useOptions) => {
    return useAPI<SavedQueryResponse>(
        map.GET_SAVED_QUERY,
        'GET',
        {
            pathVariables: { guid },
            params: {
                ignoreRelationships: true,
            },
        },
        options || {}
    )
}

const GetSavedQueryIndex = (body, options: useOptions) => {
    return useAPI<SavedQueryResponse>(
        Index.INDEX_SEARCH, 'POST', {
            body,
        },
        options || {}
    )
    }
const UpdateSavedQuery = (body: Record<string, any>, options: useOptions) => {
    return useAPI<SavedQueryResponse>(
        map.UPDATE_SAVED_QUERY,
        'POST',
        {
            body,
        },
        options || {}
    )
}

const UpdateSavedFolder = (body: Record<string, any>, options: useOptions) => {
    return useAPI(
        map.UPDATE_SAVED_FOLDER,
        'POST',
        {
            body,
        },
        options || {}
    )
}

const DeleteEntity = (guid: string, options: useOptions) => {
    return useAPI<SavedQueryResponse>(
        map.DELETE_ENTITY,
        'DELETE',
        {
            pathVariables: {
                guid,
            },
        },
        options || {}
    )
}
export const Insights = {
    UpdateSavedQuery,
    CreateSavedQuery,
    GetSavedQuery,
    CreateQueryFolder,
    DeleteEntity,
    UpdateSavedFolder,
    GetSavedQueryIndex
}
