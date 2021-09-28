import { ref } from 'vue'
import { KeyMaps } from '../atlas_keyMpas'
import { useAPIAsyncState } from '~/api/useAPI'
import {
    BasicSearchResponse,
    SavedQueryResponse,
    Query,
} from '~/types/insights/savedQuery.interface'
import { BaseAttributes, SavedQueryAttributes } from '~/constant/projection'

const serviceAlias = 'auth/atlas'
const body = ref({
    typeName: 'Query',
    excludeDeletedEntities: true,
    includeClassificationAttributes: true,
    includeSubClassifications: true,
    includeSubTypes: true,
    attributes: [...SavedQueryAttributes, ...BaseAttributes],
})
const CreateSavedQuery = (body: Record<string, any>) => {
    const { data, error, isLoading } = useAPIAsyncState<
        BasicSearchResponse<any>
    >(KeyMaps.insights.CREATE_SAVED_QUERY, 'POST', {
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
                minExtInfo: true,
            },
        }
    )
    return { data, error, isLoading }
}

export const Insights = {
    CreateSavedQuery,
    GetSavedQuery,
}
