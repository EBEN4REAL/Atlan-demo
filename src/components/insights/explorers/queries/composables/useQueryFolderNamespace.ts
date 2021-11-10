// FIXME: CHANGE BASIC -> INDEX
import { Ref, ref } from 'vue'

import { QueryFolderNamespace } from '~/types/insights/savedQuery.interface'
import { BasicSearchResponse } from '~/types/common/atlasSearch.interface'

import { useAPI } from '~/services/api/useAPI'
import { map } from '~/services/meta/insights/key'
import {
    InternalAttributes,
    BasicSearchAttributes,
    SavedQueryAttributes,
} from '~/constant/projection'

const useQueryFolderNamespace = () => {
    const defaultLimit = 50

    const attributes = [
        'name',
        'displayName',
        'typeName',
        'dataType',
        'description',
        'userDescription',
        'certificateStatus',
        'ownerUsers',
        'ownerGroups',
        'classifications',

        'connectorName',
        'connectionId',
        'connectionQualifiedName',
        'parentFolderQualifiedName',
        'defaultSchemaQualifiedName',
        'parentFolder',
        'columns', //TODO: queries
        'folder',
        'compiledQuery',
        'rawQuery',
        ...InternalAttributes,
        ...BasicSearchAttributes,
        ...SavedQueryAttributes,
    ]
    const body = ref()

    const refreshBody = () => {
        body.value = {
            typeName: 'QueryFolderNamespace',
            excludeDeletedEntities: true,
            includeClassificationAttributes: true,
            includeSubClassifications: true,
            includeSubTypes: true,
            limit: defaultLimit,
            offset: 0,
            attributes,
            // sortBy: 'name',
            sortOrder: 'ASCENDING',
        }
    }

    refreshBody()
    const getQueryFolderNamespace = () => {
        refreshBody()
        return useAPI<BasicSearchResponse<QueryFolderNamespace>>(
            map.BASIC_SEARCH,
            'POST',
            {
                body,
            },
            {}
        )
    }

    return {
        getQueryFolderNamespace,
    }
}

export default useQueryFolderNamespace
