import { ref, Ref, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'

// import { useAPIAsyncState } from '~/services/api/useAPI'

import { useAPI } from '~/services/api/useAPI'
import {
    SavedQueryResponse,
    SavedQuery,
} from '~/types/insights/savedQuery.interface'
import {map} from '~/services/meta/search/key'

import { BasicSearchResponse } from '~/types/common/atlasSearch.interface'

// import { map } from '~/services/meta/insights/key'
import { InternalAttributes, SavedQueryAttributes, BasicSearchAttributes } from '~/constant/projection'
import { ATLAN_PUBLIC_QUERY_CLASSIFICATION } from '~/components/insights/common/constants'
import whoami from '~/composables/user/whoami'

const searchQueries = (
    query: Ref<string>,
    savedQueryType: Ref<'all' | 'personal'>,
    offset?: Ref<number>,
    limit?: Ref<number>
) => {
    const body = ref<Record<string, any>>({})
    
    const { username } = whoami()

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

    const refreshBody = () => {
        // body.value = {
        //     typeName: 'Query',
        //     excludeDeletedEntities: true,
        //     includeClassificationAttributes: true,
        //     includeSubClassifications: true,
        //     includeSubTypes: true,
        //     attributes: [...InternalAttributes, ...SavedQueryAttributes],
        //     query: query.value,
        //     offset: offset?.value ?? 0,
        //     limit: limit?.value ?? 50,
        // }
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
                                "regexp": {
                                    "name.keyword": `${query.value}.*`
                                }
                            },
                        ]
                    }
                }
            },
            attributes
        }

        if (savedQueryType?.value === 'all') {
            body.value.dsl.query.bool.must.push(
                {
                    bool: {
                        should: [
                            {
                                term: {
                                    "__traitNames": ATLAN_PUBLIC_QUERY_CLASSIFICATION
                                }
                            },
                            {
                                "term": {
                                    "__propagatedTraitNames": ATLAN_PUBLIC_QUERY_CLASSIFICATION
                                }
                            }
                        ]
                    }
                }
            )
        } else if (savedQueryType?.value === 'personal') {
            body.value.dsl.query.bool.must.push(
                {
                    "bool": {
                        "must_not": [
                            {
                                "term": {
                                    "__traitNames": ATLAN_PUBLIC_QUERY_CLASSIFICATION
                                }
                            },
                            {
                                "term": {
                                    "__propagatedTraitNames": ATLAN_PUBLIC_QUERY_CLASSIFICATION
                                }
                            }
                        ]
                    }
                }
            )
            body.value.dsl.query.bool.must.push(
                {
                    "term": {
                        "ownerUsers": username.value
                    }
                },
            )
        }
    }
    refreshBody()

    let data1 = ref({})
    let isLoading1 = ref(false)
    let error1 = ref()

    const fetchQueries = () => {
        refreshBody()
        body.value.dsl.query.bool.must.push(
            {
                term: {
                    "__typeName.keyword": "Query"
                }
            }
        )
        const {isLoading, data, error} =  useAPI(
            map.INDEX_SEARCH,
            'POST',
            {
                body,
            },
            {}
        )
        isLoading1.value = isLoading.value;
        data1.value = data.value
        error1.value = error.value
    }


    const onQueryChange = useDebounceFn((query: string) => {
        if (query.length) fetchQueries()
    })

    watch([query, savedQueryType], ([newQuery]) => {
        isLoading1.value = true

        onQueryChange(newQuery)
    })
    return { data1, error1, isLoading1 }
}

export default searchQueries
