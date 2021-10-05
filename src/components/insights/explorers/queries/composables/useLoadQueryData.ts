import { Ref, ref } from 'vue'

import { SavedQuery, Folder } from '~/types/insights/savedQuery.interface'
import { BasicSearchResponse, RelationshipSearchResponse } from '~/types/common/atlasSearch.interface'

import { useAPIPromise, useAPI } from '~/api/useAPI'
import { KeyMaps } from '~/api/keyMap'
import { BaseAttributes, BasicSearchAttributes } from '~/constant/projection'


const useLoadQueryData = () => {
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
    const body = ref({
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
            criterion: [
                {
                    attributeName: "",
                    attributeValue: "",
                    operator: "eq"
                }
            ]
        },
        sortBy: "Asset.name.keyword",
        sortOrder: "ASCENDING",
    });

    const getQueryFolders = (offset?: number) => {
        body.value.typeName = 'QueryFolder';
        body.value.entityFilters.criterion = [{
            attributeName: "parentFolderQualifiedName",
            operator: "is_null",
            attributeValue: ''
        }]
        body.value.offset = offset ?? 0

        return useAPI<BasicSearchResponse<Folder>>('BASIC_SEARCH', 'POST', {
            cache: 'ROOT_FOLDERS',
            body,
        })

    }

    const getQueries = (offset?: number) => {
        body.value.typeName = 'Query';
        body.value.entityFilters.criterion = [{
            attributeName: "parentFolderQualifiedName",
            operator: "is_null",
            attributeValue: ''
        }]
        body.value.offset = offset ?? 0

        return useAPI<BasicSearchResponse<SavedQuery>>('BASIC_SEARCH', 'POST', {
            cache: 'ROOT_QUERIES',
            body,
        })
    }

    const getSubFolders = (folderGuid: string, offset?: number, limit?: number) => {
        body.value.typeName = 'QueryFolder';
        body.value.entityFilters.criterion = [{
            attributeName: "parentFolderQualifiedName",
            operator: "eq",
            attributeValue: folderGuid
        }]
        body.value.offset = offset ?? 0
        body.value.limit = limit ?? defaultLimit

        return useAPIPromise(KeyMaps.savedQueries.BASIC_SEARCH(), 'POST', {
            body
        }) as Promise<BasicSearchResponse<Folder>>
    }

    const getFolderQueries = (folderGuid: string, offset?: number, limit?: number) => {
        body.value.typeName = 'Query';
        body.value.entityFilters.criterion = [{
            attributeName: "parentFolderQualifiedName",
            operator: "eq",
            attributeValue: folderGuid
        }]
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