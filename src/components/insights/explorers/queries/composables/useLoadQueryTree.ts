import { Ref, ref } from 'vue'

import {
    SavedQuery,
    BasicSearchResponse,
} from '~/types/insights/savedQuery.interface'

import { useAPIPromise } from '~/api/useAPI'
import { KeyMaps } from '~/api/keyMap'

const useLoadQueryTree = () => {
    const body = ref({
        typeName: 'Query',
        excludeDeletedEntities: true,
        includeClassificationAttributes: true,
        includeSubClassifications: true,
        includeSubTypes: true,
        limit: 25,
        offset: 0,
        attributes: [
            'name',
            'owner',
            'qualifiedName',
            'isPrivate',
            'folder',
            'description',
        ],
        entityFilters: null,
        termName: null,
    })

    const getSavedQueriesForConnector = async (
        connectorQualifiedName: string,
        offset?: number
    ) => {
        /*TODO: Add connector in entity filters default is snowlfake*/
        body.value.offset = offset ?? 0
        return useAPIPromise(KeyMaps.insights.BASIC_SEARCH(), 'POST', {
            body,
        }) as Promise<BasicSearchResponse<SavedQuery>>
    }

    return {
        getSavedQueriesForConnector,
    }
}

export default useLoadQueryTree
