import { Ref, ref } from 'vue'

import { SavedQuery, Folder } from '~/types/insights/savedQuery.interface'
import { BasicSearchResponse, RelationshipSearchResponse } from '~/types/common/atlasSearch.interface'

import { useAPIPromise } from '~/api/useAPI'
import { KeyMaps } from '~/api/keyMap'
import { BaseAttributes, BasicSearchAttributes } from '~/constant/projection'

import whoami from '~/composables/user/whoami'

import { ATLAN_PUBLIC_QUERY_CLASSIFICATION } from '~/components/insights/common/constants';

interface useLoadQueryDataProps {
    connector: Ref<string | undefined>
    savedQueryType?: Ref<'personal' | 'all'>

}

const useLoadQueryData = ({ connector, savedQueryType }: useLoadQueryDataProps) => {
    const { username } = whoami()

    const defaultLimit = 50;

    const attributes = [
        "name",
        "displayName",
        "typeName",
        "dataType",
        "description",
        "userDescription",
        "assetStatus",
        "ownerUsers",
        "ownerGroups",
        "classifications",

        "integrationName",
        "connectionQualifiedName",
        "parentFolderQualifiedName",
        "parentFolder",
        "columns", //TODO: queries
        "folder",
        "compiledQuery",
        "rawQuery",
        ...BaseAttributes,
        ...BasicSearchAttributes
    ];
    const body = ref();

    const refreshBody = () => {
        body.value = {
            typeName: "QueryFolder",
            excludeDeletedEntities: true,
            includeClassificationAttributes: true,
            includeSubClassifications: true,
            includeSubTypes: true,
            limit: defaultLimit,
            offset: 0,
            attributes,
            entityFilters: {
                condition: "AND",
                criterion: []
            },
            sortBy: "Asset.name.keyword",
            sortOrder: "ASCENDING",
        }
        if(connector.value) {
            body.value.entityFilters.criterion.push({
                attributeName: "integrationName",
                attributeValue: connector.value,
                operator: "eq"
            })
        }
        if(savedQueryType?.value === 'all') {
            body.value.entityFilters.criterion.push({
                condition: "OR",
                criterion: [
                   {
                     attributeName: "__classificationNames",
                     attributeValue: ATLAN_PUBLIC_QUERY_CLASSIFICATION,
                     operator: "eq"
                   },
                   {
                     attributeName: "__propagatedClassificationNames",
                     attributeValue: ATLAN_PUBLIC_QUERY_CLASSIFICATION,
                     operator: "eq"
                   }
                 ]
               })
        } 
        else if(savedQueryType?.value === 'personal') {
            body.value.entityFilters.criterion.push({
                condition: "AND",
                criterion: [
                   {
                     attributeName: "__classificationNames",
                     attributeValue: ATLAN_PUBLIC_QUERY_CLASSIFICATION,
                     operator: "neq"
                   },
                   {
                     attributeName: "__propagatedClassificationNames",
                     attributeValue: ATLAN_PUBLIC_QUERY_CLASSIFICATION,
                     operator: "neq"
                   }
                 ]
               })
            body.value.entityFilters.criterion.push({
                attributeName: "owner",
                attributeValue: username.value,
                operator: "eq"
              })
        }
    }

    refreshBody();

    const getQueryFolders = (offset?: number) => {
        refreshBody();

        body.value.typeName = 'QueryFolder';
        body.value.entityFilters.criterion.push({
            attributeName: "parentFolderQualifiedName",
            operator: "is_null",
            attributeValue: ''
        })
        body.value.offset = offset ?? 0

        return useAPIPromise(KeyMaps.savedQueries.BASIC_SEARCH(), 'POST', {
            body
        }) as Promise<BasicSearchResponse<Folder>>

    }

    const getQueries = (offset?: number) => {
        refreshBody();

        body.value.typeName = 'Query';
        body.value.entityFilters.criterion.push({
            attributeName: "parentFolderQualifiedName",
            operator: "is_null",
            attributeValue: ''
        })
        body.value.offset = offset ?? 0

        return useAPIPromise(KeyMaps.savedQueries.BASIC_SEARCH(), 'POST', {
            body
        }) as Promise<RelationshipSearchResponse<SavedQuery>>
    }

    const getSubFolders = (folderGuid: string, offset?: number, limit?: number) => {
        refreshBody();

        body.value.typeName = 'QueryFolder';
        body.value.entityFilters.criterion.push({
            attributeName: "parentFolderQualifiedName",
            operator: "eq",
            attributeValue: folderGuid
        })
        body.value.offset = offset ?? 0
        body.value.limit = limit ?? defaultLimit

        return useAPIPromise(KeyMaps.savedQueries.BASIC_SEARCH(), 'POST', {
            body
        }) as Promise<BasicSearchResponse<Folder>>
    }

    const getFolderQueries = (folderGuid: string, offset?: number, limit?: number) => {
        refreshBody();

        body.value.typeName = 'Query';
        body.value.entityFilters.criterion.push({
            attributeName: "parentFolderQualifiedName",
            operator: "eq",
            attributeValue: folderGuid
        })

        body.value.offset = offset ?? 0
        body.value.limit = limit ?? defaultLimit

        return useAPIPromise(KeyMaps.savedQueries.BASIC_SEARCH(), 'POST', {
            body
        }) as Promise<RelationshipSearchResponse<SavedQuery>>
    }

   

    return {
        getQueryFolders,
        getQueries,
        getSubFolders,
        getFolderQueries,
    }
}

export default useLoadQueryData;