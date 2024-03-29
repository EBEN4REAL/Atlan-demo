import { Ref, ref } from 'vue'

import { SavedQuery, Folder } from '~/types/insights/savedQuery.interface'
// import {
//     BasicSearchResponse,
//     RelationshipSearchResponse,
// } from '~/types/common/atlasSearch.interface'

import { useAPIPromise } from '~/services/api/useAPIPromise'
// import { map } from '~/services/meta/insights/key'
import { map } from '~/services/meta/search/key'

import {
    InternalAttributes,
    BasicSearchAttributes,
    SavedQueryAttributes,
    AssetAttributes,
    AssetRelationAttributes,
} from '~/constant/projection'

import whoami from '~/composables/user/whoami'

import { ATLAN_PUBLIC_QUERY_CLASSIFICATION } from '~/components/insights/common/constants'

interface useLoadQueryDataProps {
    collectionQualifiedName?: Ref<string | undefined>
}

const useLoadQueryData = ({
    collectionQualifiedName,
}: useLoadQueryDataProps) => {
    const { username } = whoami()

    const defaultLimit = 50

    const attributes = [
        ...AssetAttributes,
        ...InternalAttributes,
        ...SavedQueryAttributes,
        // ...AssetAttributes
    ]
    const body = ref()

    const refreshBody = () => {
        body.value = {
            dsl: {
                size: 100,
                sort: [{ 'name.keyword': { order: 'asc' } }],
                query: {
                    bool: {
                        must: [
                            {
                                term: {
                                    __state: 'ACTIVE',
                                },
                            },
                        ],
                    },
                },
            },
            attributes,
            suppressLogs: true,
            relationAttributes: [...AssetRelationAttributes, 'icon'],
        }
    }

    refreshBody()

    const getQueryFolders = (offset?: number) => {
        refreshBody()
        body.value.dsl.query.bool.must.push({
            term: {
                '__typeName.keyword': 'Folder',
            },
        })
        body.value.dsl.query.bool.must.push({
            term: {
                parentQualifiedName: collectionQualifiedName.value
                    ? collectionQualifiedName.value
                    : '',
            },
        })
        return useAPIPromise(map.INDEX_SEARCH(), 'POST', {
            body,
        })
    }

    const getQueries = (offset?: number) => {
        refreshBody()

        body.value.dsl.query.bool.must.push({
            term: {
                '__typeName.keyword': 'Query',
            },
        })
        body.value.dsl.query.bool.must.push({
            term: {
                parentQualifiedName: collectionQualifiedName.value
                    ? collectionQualifiedName.value
                    : '',
            },
        })
        return useAPIPromise(map.INDEX_SEARCH(), 'POST', {
            body,
        })
    }

    const getSubFolders = (
        folderGuid: string,
        offset?: number,
        limit?: number
    ) => {
        refreshBody()
        body.value.dsl.query.bool.must.push({
            term: {
                '__typeName.keyword': 'Folder',
            },
        })
        body.value.dsl.query.bool.must.push({
            term: {
                parentQualifiedName: folderGuid,
            },
        })
        return useAPIPromise(map.INDEX_SEARCH(), 'POST', {
            body,
        })
    }

    const getFolderQueries = (
        folderGuid: string,
        offset?: number,
        limit?: number
    ) => {
        refreshBody()
        body.value.dsl.query.bool.must.push({
            term: {
                '__typeName.keyword': 'Query',
            },
        })
        body.value.dsl.query.bool.must.push({
            term: {
                parentQualifiedName: folderGuid,
            },
        })
        return useAPIPromise(map.INDEX_SEARCH(), 'POST', {
            body,
        })
    }

    return {
        getQueryFolders,
        getQueries,
        getSubFolders,
        getFolderQueries,
        // getAllQueryFolders,
    }
}

export default useLoadQueryData
