import { Ref, ref } from 'vue'

import { Query, Folder } from '~/types/insights/savedQuery.interface'
import { BasicSearchResponse, RelationshipSearchResponse } from '~/types/common/atlasSearch.interface'

import { useAPIPromise } from '~/api/useAPI'
import { KeyMaps } from '~/api/keyMap'
import { BaseAttributes, BasicSearchAttributes } from '~/constant/projection'


const useLoadQueryData = () => {
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
        "tableCount",
        "columnCount",
        ...BaseAttributes,
        ...BasicSearchAttributes
    ];
    const body = ref({
        typeName: "QueryFolder",
        excludeDeletedEntities: true,
        includeClassificationAttributes: true,
        includeSubClassifications: true,
        includeSubTypes: true,
        limit: 5,
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
        // body.value.entityFilters.criterion = [{
        //     attributeName: "parentFolderQualifiedName",
        //     operator: "is_null"
        // }]
        body.value.offset = offset ?? 0

        return useAPIPromise(KeyMaps.savedQueries.BASIC_SEARCH(), 'POST', {
            body,
        }) as Promise<BasicSearchResponse<Folder>>
    }

    const getQueries = (offset?: number) => {
        body.value.typeName = 'Query';
        // body.value.entityFilters.criterion = [{
        //     attributeName: "parentFolderQualifiedName",
        //     operator: "is_null"
        // }]
        body.value.offset = offset ?? 0

        return useAPIPromise(KeyMaps.savedQueries.BASIC_SEARCH(), 'POST', {
            body,
        }) as Promise<BasicSearchResponse<Query>>
    }

    const getSubFolders = (folderGuid: string, offset?: number, limit?: number) => {
        const params = new URLSearchParams();

        attributes.forEach((param: string) => {
            params.append('attributes', param)
        })

        const paramsObj: any = {
            limit: limit ?? 5,
            offset: 0,
            relation: 'childFolders',
            includeClassificationAttributes: true,
            guid: folderGuid,
            excludeDeletedEntities: true,
        }
        Object.keys(paramsObj).forEach((key) => {
            params.append(key, paramsObj[key])
        })

        return useAPIPromise(KeyMaps.savedQueries.RELATIONSHIP(), 'GET', {
            params
        }) as Promise<RelationshipSearchResponse<Folder>>
    }

    const getFolderQueries = (folderGuid: string, offset?: number, limit?: number) => {
        const params = new URLSearchParams();

        attributes.forEach((param: string) => {
            params.append('attributes', param)
        })

        const paramsObj: any = {
            limit: limit ?? 5,
            offset: 0,
            relation: 'columns', //TODO: replace with queries on atlas reset
            includeClassificationAttributes: true,
            guid: folderGuid,
            excludeDeletedEntities: true,
        }
        Object.keys(paramsObj).forEach((key) => {
            params.append(key, paramsObj[key])
        })

        return useAPIPromise(KeyMaps.savedQueries.RELATIONSHIP(), 'GET', {
            params
        }) as Promise<RelationshipSearchResponse<Folder>>
    }

   

    return {
        getQueryFolders,
        getQueries,
        getSubFolders,
        getFolderQueries,
    }
}

export default useLoadQueryData;