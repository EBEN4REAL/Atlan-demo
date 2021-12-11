import { Ref, ref } from 'vue'

import { SavedQuery, Folder } from '~/types/insights/savedQuery.interface'
// import {
//     BasicSearchResponse,
//     RelationshipSearchResponse,
// } from '~/types/common/atlasSearch.interface'

import { useAPIPromise } from '~/services/api/useAPIPromise'
// import { map } from '~/services/meta/insights/key'
import {map} from '~/services/meta/search/key'

import {
    InternalAttributes,
    BasicSearchAttributes,
    SavedQueryAttributes,
} from '~/constant/projection'

import whoami from '~/composables/user/whoami'

import { ATLAN_PUBLIC_QUERY_CLASSIFICATION } from '~/components/insights/common/constants'

interface useLoadQueryDataProps {
    connector: Ref<string | undefined>
    // savedQueryType?: Ref<'personal' | 'all'>
    savedQueryType?: Ref<string>
    queryFolderNamespace: Ref<Folder>
    collectionQualifiedName?: Ref<string | undefined>
}

const useLoadQueryData = ({
    connector,
    savedQueryType,
    queryFolderNamespace,
    collectionQualifiedName
}: useLoadQueryDataProps) => {
    // ditch: connector, savedQueryType, queryFolderNamespace

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
        'defaultDatabaseQualifiedName',
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
            dsl: {
                size: 100,
                sort : [
                    { "name.keyword" : {"order" : "asc"}}
                ],
                query: {
                    bool: {
                        must: [
                            {
                                term: {
                                    "__state": "ACTIVE"
                                }
                            }
                        ]
                    }
                }
            },
            attributes
        }
    }

    refreshBody()

    const getQueryFolders = (offset?: number) => {
        refreshBody()
        body.value.dsl.query.bool.must.push(
            {
                term: {
                    "__typeName.keyword": "QueryFolder"
                }
            }
        )
        body.value.dsl.query.bool.must.push(
            {
                term: {
                    "parentQualifiedName": collectionQualifiedName.value ? collectionQualifiedName.value : ""
                }
            }
        )
        return useAPIPromise(map.INDEX_SEARCH(), 'POST', {
            body
        })
    }

    const getQueries = (offset?: number) => {
        refreshBody()

        body.value.dsl.query.bool.must.push(
            {
                term: {
                    "__typeName.keyword": "Query"
                }
            }
        )
        body.value.dsl.query.bool.must.push(
            {
                term: {
                    "parentQualifiedName": collectionQualifiedName.value ? collectionQualifiedName.value : ""
                }
            }
        )
        return useAPIPromise(map.INDEX_SEARCH(), 'POST', {
            body
        })
    }

    const getSubFolders = (
        folderGuid: string,
        offset?: number,
        limit?: number
    ) => {
        refreshBody()
        body.value.dsl.query.bool.must.push(
            {
                term: {
                    "__typeName.keyword": "QueryFolder"
                }
            }
        )
        body.value.dsl.query.bool.must.push(
            {
                term: {
                    "parentQualifiedName": folderGuid
                }
            }
        )
        return useAPIPromise(map.INDEX_SEARCH(), 'POST', {
            body
        })
    }

    const getFolderQueries = (
        folderGuid: string,
        offset?: number,
        limit?: number
    ) => {
        refreshBody()
        body.value.dsl.query.bool.must.push(
            {
                term: {
                    "__typeName.keyword": "Query"
                }
            }
        )
        body.value.dsl.query.bool.must.push(
            {
                term: {
                    "parentFolderQualifiedName": folderGuid
                }
            }
        )
        return useAPIPromise(map.INDEX_SEARCH(), 'POST', {
            body
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
