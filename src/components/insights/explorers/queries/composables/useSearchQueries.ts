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
import bodybuilder from 'bodybuilder'

const searchQueries = (
    query: Ref<string>,
    classification: Ref<string>,
    facets: Ref<object>,
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
    let base = bodybuilder()

    const refreshBody = () => {
        base = bodybuilder()
        base.sort('name.keyword', { order: "asc" })
        base.filter(
            'regexp',
            'name.keyword',
            `${query.value}.*`
        )
        base.filter(
            'term',
            '__state',
            'ACTIVE'
        )
        if (classification?.value && classification?.value.length) {
            base.orFilter(
                'term',
                '__traitNames',
                classification.value
            )
            base.orFilter(
                'term',
                '__propagatedTraitNames',
                classification.value
            )
        } 

        if(facets.value && Object.keys(facets.value).length>0) {
            Object.keys(facets.value ?? {}).forEach((mkey) => {
                const filterObject = facets?.value[mkey]
                const existsValue = 'NONE'
                switch (mkey) {
                    
                    case 'certificateStatus': {
                        if (filterObject) {
                            if (filterObject.length > 0) {
                                const index = filterObject.indexOf(existsValue)
                                if (index > -1) {
                                    const temp = []
                                    filterObject.forEach((element) => {
                                        if (element !== existsValue) {
                                            temp.push(element)
                                        }
                                    })
                                    base.filter('bool', (q) => {
                                        if (temp.length > 0) {
                                            q.orFilter(
                                                'terms',
                                                'certificateStatus',
                                                temp
                                            )
                                        }
        
                                        q.orFilter('bool', (query) => {
                                            return query.notFilter(
                                                'exists',
                                                'certificateStatus'
                                            )
                                        })
                                        return q
                                    })
                                } else {
                                    base.filter(
                                        'terms',
                                        'certificateStatus',
                                        filterObject
                                    )
                                }
                            }
                        }
                        break
                    }
                    case 'owners': {
                        if (filterObject) {
                            base.filter('bool', (q) => {
                                if (filterObject.ownerUsers?.length > 0)
                                    q.orFilter(
                                        'terms',
                                        'ownerUsers',
                                        filterObject.ownerUsers
                                    )
        
                                if (filterObject.ownerGroups?.length > 0)
                                    q.orFilter(
                                        'terms',
                                        'ownerGroups',
                                        filterObject.ownerGroups
                                    )
                                if (filterObject.empty === true) {
                                    q.orFilter('bool', (query) => {
                                        return query.filter('bool', (query2) => {
                                            query2.notFilter('exists', 'ownerUsers')
                                            query2.notFilter('exists', 'ownerGroups')
                                            return query2
                                        })
                                    })
                                }
                                return q
                            })
                        }
        
                        break
                    }
                    
                    case '__traitNames': {
                        if (filterObject) {
                            base.filter('bool', (q) => {
                                if (filterObject.classifications?.length > 0)
                                    q.orFilter(
                                        'terms',
                                        '__traitNames',
                                        filterObject.classifications
                                    )
        
                                if (filterObject.empty === true) {
                                    q.orFilter('bool', (query) => {
                                        return query.filter('bool', (query2) => {
                                            query2.notFilter('exists', '__traitNames')
                                            return query2
                                        })
                                    })
                                }
                                return q
                            })
                        }
        
                        break
                    }
                   
                    case 'glossary': {
                        if (filterObject) {
                            base.filter('term', '__glossary', filterObject)
                        }
                        break
                    }
                   
                    case 'terms': {
                        if (filterObject) {
                            base.filter('term', '__meanings', filterObject)
                        }
                        break
                    }
                }
            })
        }
        
    }
    refreshBody()

    let data1 = ref({})
    let isLoading1 = ref(false)
    let error1 = ref()

    const fetchQueries = async () => {
        refreshBody()
        base.filter(
            'term',
            '__typeName.keyword',
            "Query"
        )
        let body = base.build()
        // console.log('query filter facet')
        const {isLoading, data, error} =  await useAPI(
            map.INDEX_SEARCH,
            'POST',
            {
                body: {
                    dsl: body,
                    attributes: attributes
                }

            },
            {}
        )

        watch([isLoading, data], () => {
            if(isLoading.value===true) {

            } else {
                isLoading1.value = isLoading.value;
                data1.value = data.value
                error1.value = error.value
            }
        })
    }


    const onQueryChange = useDebounceFn((query: string, facets) => {
        console.log('query: ', facets && Object.keys(facets).length>0)
        if (query.length || (facets && Object.keys(facets).length>0)) fetchQueries()
    })

    watch([query, classification, facets], ([newQuery]) => {
        isLoading1.value = true
        console.log('queryFacets: ', facets.value)

        onQueryChange(newQuery, facets.value)
    })
    return { data1, error1, isLoading1 }
}

export default searchQueries
