import { Ref, ref } from 'vue'

import { SavedQuery, Folder } from '~/types/insights/savedQuery.interface'
import {
    BasicSearchResponse,
    RelationshipSearchResponse,
} from '~/types/common/atlasSearch.interface'

import { useAPIPromise } from '~/services/api/useAPIPromise'
import { map } from '~/services/meta/insights/key'
import {
    InternalAttributes,
    BasicSearchAttributes,
    SavedQueryAttributes,
} from '~/constant/projection'

import whoami from '~/composables/user/whoami'

import { ATLAN_PUBLIC_QUERY_CLASSIFICATION } from '~/components/insights/common/constants'

interface useLoadQueryDataProps {
    connector: Ref<string | undefined>
    savedQueryType?: Ref<'personal' | 'all'>
    queryFolderNamespace: Ref<Folder>
}

const useLoadQueryData = ({
    connector,
    savedQueryType,
    queryFolderNamespace
}: useLoadQueryDataProps) => {
    const { username } = whoami()

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
            typeName: 'QueryFolder',
            excludeDeletedEntities: true,
            includeClassificationAttributes: true,
            includeSubClassifications: true,
            includeSubTypes: true,
            limit: defaultLimit,
            offset: 0,
            attributes,
            entityFilters: {
                condition: 'AND',
                criterion: [],
            },
            // sortBy: 'name',
            sortOrder: 'ASCENDING',
        }
        if (connector.value) {
            body.value.entityFilters.criterion.push({
                attributeName: 'connectionName',
                attributeValue: connector.value,
                operator: 'eq',
            })
        }
        if (savedQueryType?.value === 'all') {
            body.value.entityFilters.criterion.push({
                condition: 'OR',
                criterion: [
                    {
                        attributeName: '__classificationNames',
                        attributeValue: ATLAN_PUBLIC_QUERY_CLASSIFICATION,
                        operator: 'eq',
                    },
                    {
                        attributeName: '__propagatedClassificationNames',
                        attributeValue: ATLAN_PUBLIC_QUERY_CLASSIFICATION,
                        operator: 'eq',
                    },
                ],
            })
        } else if (savedQueryType?.value === 'personal') {
            body.value.entityFilters.criterion.push({
                condition: 'AND',
                criterion: [
                    {
                        attributeName: '__classificationNames',
                        attributeValue: ATLAN_PUBLIC_QUERY_CLASSIFICATION,
                        operator: 'neq',
                    },
                    {
                        attributeName: '__propagatedClassificationNames',
                        attributeValue: ATLAN_PUBLIC_QUERY_CLASSIFICATION,
                        operator: 'neq',
                    },
                ],
            })
            body.value.entityFilters.criterion.push({
                attributeName: 'ownerUsers',
                attributeValue: username.value,
                operator: 'eq',
            })
        }
    }

    refreshBody()
    const getAllQueryFolders = () => {
        refreshBody()

        body.value.typeName = 'QueryFolder'
        body.value.offset = 0
        body.value.limit = 100

        return useAPIPromise(map.BASIC_SEARCH(), 'POST', {
            body,
        }) as Promise<BasicSearchResponse<Folder>>
    }

    const getQueryFolders = (offset?: number) => {
        refreshBody()
        body.value.typeName = 'QueryFolder'
        body.value.entityFilters.criterion.push({
            attributeName: 'parentFolderQualifiedName',
            operator: 'eq',
            attributeValue: queryFolderNamespace.value.attributes.qualifiedName,
        })
        body.value.offset = offset ?? 0

        return useAPIPromise(map.BASIC_SEARCH(), 'POST', {
            body,
        }) as Promise<BasicSearchResponse<Folder>>
    }

    const getQueries = (offset?: number) => {
        refreshBody()

        body.value.typeName = 'Query'
        body.value.entityFilters.criterion.push({
            attributeName: 'parentFolderQualifiedName',
            operator: 'eq',
            attributeValue: queryFolderNamespace.value.attributes.qualifiedName,
        })
        body.value.offset = offset ?? 0

        return useAPIPromise(map.BASIC_SEARCH(), 'POST', {
            body,
        }) as Promise<RelationshipSearchResponse<SavedQuery>>
    }

    const getSubFolders = (
        folderGuid: string,
        offset?: number,
        limit?: number
    ) => {
        refreshBody()

        body.value.typeName = 'QueryFolder'
        body.value.entityFilters.criterion.push({
            attributeName: 'parentFolderQualifiedName',
            operator: 'eq',
            attributeValue: folderGuid,
        })
        body.value.offset = offset ?? 0
        body.value.limit = limit ?? defaultLimit

        return useAPIPromise(map.BASIC_SEARCH(), 'POST', {
            body,
        }) as Promise<BasicSearchResponse<Folder>>
    }

    const getFolderQueries = (
        folderGuid: string,
        offset?: number,
        limit?: number
    ) => {
        refreshBody()

        body.value.typeName = 'Query'
        body.value.entityFilters.criterion.push({
            attributeName: 'parentFolderQualifiedName',
            operator: 'eq',
            attributeValue: folderGuid,
        })
        body.value.offset = offset ?? 0
        body.value.limit = limit ?? defaultLimit

        return useAPIPromise(map.BASIC_SEARCH(), 'POST', {
            body,
        }) as Promise<RelationshipSearchResponse<SavedQuery>>
    }

    return {
        getQueryFolders,
        getQueries,
        getSubFolders,
        getFolderQueries,
        getAllQueryFolders,
    }
}

export default useLoadQueryData
