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

    // const refreshBody = () => {
    //     body.value = {
    //         dsl: {
    //             size: 100,
    //             sort : [
    //                 { "name.keyword" : {"order" : "asc"}}
    //             ],
    //             query: {
    //                 bool: {
    //                     must: [
                            
    //                     ]
    //                 }
    //             }
    //         },
    //         attributes
    //     }
    //     if (connector.value) {

    //         body.value.dsl.query.bool.must.push(
    //             {
    //                 term: {
    //                     "connectionName": `${connector.value}`
    //                 }
    //             },
                    
    //             {
    //                 term: {
    //                     "__state": "ACTIVE"
    //                 }
    //             }
    //         )
    //     }
    //     if (savedQueryType?.value === 'all') {
    //         body.value.dsl.query.bool.must.push(
    //             {
    //                 bool: {
    //                     should: [
    //                         {
    //                             term: {
    //                                 "__traitNames": ATLAN_PUBLIC_QUERY_CLASSIFICATION
    //                             }
    //                         },
    //                         {
    //                             "term": {
    //                                 "__propagatedTraitNames": ATLAN_PUBLIC_QUERY_CLASSIFICATION
    //                             }
    //                         }
    //                     ]
    //                 }
    //             }
    //         )
    //     } else if (savedQueryType?.value === 'personal') {
    //         body.value.dsl.query.bool.must.push(
    //             {
    //                 "bool": {
    //                     "must_not": [
    //                         {
    //                             "term": {
    //                                 "__traitNames": ATLAN_PUBLIC_QUERY_CLASSIFICATION
    //                             }
    //                         },
    //                         {
    //                             "term": {
    //                                 "__propagatedTraitNames": ATLAN_PUBLIC_QUERY_CLASSIFICATION
    //                             }
    //                         }
    //                     ]
    //                 }
    //             }
    //         )
    //         body.value.dsl.query.bool.must.push(
    //             {
    //                 "term": {
    //                     "ownerUsers": username.value
    //                 }
    //             },
    //         )
    //     }
    // }

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
                            
                        ]
                    }
                }
            },
            attributes
        }
        if (connector.value) {

            body.value.dsl.query.bool.must.push(
                {
                    term: {
                        "connectionName": `${connector.value}`
                    }
                },
                    
                {
                    term: {
                        "__state": "ACTIVE"
                    }
                }
            )
        }
        if (savedQueryType?.value) {
            body.value.dsl.query.bool.must.push(
                {
                    bool: {
                        should: [
                            {
                                term: {
                                    "__traitNames": savedQueryType?.value
                                }
                            },
                            {
                                "term": {
                                    "__propagatedTraitNames": savedQueryType?.value
                                }
                            }
                        ]
                    }
                }
            )
        } 
        // else if (savedQueryType?.value) {
        //     body.value.dsl.query.bool.must.push(
        //         {
        //             "bool": {
        //                 "must_not": [
        //                     {
        //                         "term": {
        //                             "__traitNames": ATLAN_PUBLIC_QUERY_CLASSIFICATION
        //                         }
        //                     },
        //                     {
        //                         "term": {
        //                             "__propagatedTraitNames": ATLAN_PUBLIC_QUERY_CLASSIFICATION
        //                         }
        //                     }
        //                 ]
        //             }
        //         }
        //     )
        //     body.value.dsl.query.bool.must.push(
        //         {
        //             "term": {
        //                 "ownerUsers": username.value
        //             }
        //         },
        //     )
        // }
    }

    refreshBody()
    // const getAllQueryFolders = () => {
    //     refreshBody()

    //     body.value.typeName = 'QueryFolder'
    //     body.value.offset = 0
    //     body.value.limit = 100

    //     return useAPIPromise(map.BASIC_SEARCH(), 'POST', {
    //         body,
    //     }) as Promise<BasicSearchResponse<Folder>>
    // }

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
                    "parentFolderQualifiedName": queryFolderNamespace.value.attributes.qualifiedName
                }
            }
        )
        return useAPIPromise(map.INDEX_SEARCH(), 'POST', {
            body
        })
    }

    const getQueries = (offset?: number) => {
        refreshBody()

        // body.value.typeName = 'Query'
        // body.value.entityFilters.criterion.push({
        //     attributeName: 'parentFolderQualifiedName',
        //     operator: 'eq',
        //     attributeValue: queryFolderNamespace.value.attributes.qualifiedName,
        // })
        // body.value.offset = offset ?? 0

        // return useAPIPromise(map.BASIC_SEARCH(), 'POST', {
        //     body,
        // }) as Promise<RelationshipSearchResponse<SavedQuery>>

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
                    "parentFolderQualifiedName": queryFolderNamespace?.value?.attributes?.qualifiedName
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

        // body.value.typeName = 'QueryFolder'
        // body.value.entityFilters.criterion.push({
        //     attributeName: 'parentFolderQualifiedName',
        //     operator: 'eq',
        //     attributeValue: folderGuid,
        // })
        // body.value.offset = offset ?? 0
        // body.value.limit = limit ?? defaultLimit

        // return useAPIPromise(map.BASIC_SEARCH(), 'POST', {
        //     body,
        // }) as Promise<BasicSearchResponse<Folder>>
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
                    "parentFolderQualifiedName": folderGuid
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

        // body.value.typeName = 'Query'
        // body.value.entityFilters.criterion.push({
        //     attributeName: 'parentFolderQualifiedName',
        //     operator: 'eq',
        //     attributeValue: folderGuid,
        // })
        // body.value.offset = offset ?? 0
        // body.value.limit = limit ?? defaultLimit

        // return useAPIPromise(map.BASIC_SEARCH(), 'POST', {
        //     body,
        // }) as Promise<RelationshipSearchResponse<SavedQuery>>
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
