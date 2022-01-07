import { Ref, ref } from 'vue'

import {
    SavedQuery,
} from '~/types/insights/savedQuery.interface'

import {
    BasicSearchResponse,
} from '~/types/common/atlasSearch.interface'

import { useAPIPromise } from '~/services/api/useAPIPromise'
import { map } from '~/services/meta/insights/key'

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
            'ownerUsers',
            'qualifiedName',
            'isPrivate',
            'folder',
            'description',
            'meanings',
            'classifications'
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
        return useAPIPromise(map.BASIC_SEARCH(), 'POST', {
            body,
        }) as Promise<BasicSearchResponse<SavedQuery>>
    }

    return {
        getSavedQueriesForConnector,
    }
}

export default useLoadQueryTree
