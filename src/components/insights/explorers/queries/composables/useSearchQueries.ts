import { ref, Ref, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'

import { useAPI } from '~/services/api/useAPI'
import {
    SavedQueryResponse,
    SavedQuery,
} from '~/types/insights/savedQuery.interface'
import { BasicSearchResponse } from '~/types/common/atlasSearch.interface'

import { map as KeyMaps } from '~/services/meta/search/key'
import { AssetAttributes, SavedQueryAttributes } from '~/constant/projection'
import { ATLAN_PUBLIC_QUERY_CLASSIFICATION } from '~/components/insights/common/constants'

const searchQueries = (
    query: Ref<string>,
    savedQueryType: Ref<'all' | 'personal'>,
    offset?: Ref<number>,
    limit?: Ref<number>
) => {
    const body = ref<Record<string, any>>({})
    const data = ref<BasicSearchResponse<SavedQuery>>()
    const isLoading = ref(true)
    const error = ref()

    const refreshBody = () => {
        body.value = {
            typeName: 'Query',
            excludeDeletedEntities: true,
            includeClassificationAttributes: true,
            includeSubClassifications: true,
            includeSubTypes: true,
            attributes: [...AssetAttributes, ...SavedQueryAttributes],
            query: query.value,
            offset: offset?.value ?? 0,
            limit: limit?.value ?? 50,
        }
        if (savedQueryType?.value === 'all') {
            body.value.entityFilters = {
                condition: 'AND',
                criterion: [
                    {
                        condition: 'OR',
                        criterion: [
                            {
                                attributeName: '__classificationNames',
                                attributeValue:
                                    ATLAN_PUBLIC_QUERY_CLASSIFICATION,
                                operator: 'eq',
                            },
                            {
                                attributeName:
                                    '__propagatedClassificationNames',
                                attributeValue:
                                    ATLAN_PUBLIC_QUERY_CLASSIFICATION,
                                operator: 'eq',
                            },
                        ],
                    },
                ],
            }
        } else {
            body.value.entityFilters = {
                condition: 'AND',
                criterion: [
                    {
                        condition: 'AND',
                        criterion: [
                            {
                                attributeName: '__classificationNames',
                                attributeValue:
                                    ATLAN_PUBLIC_QUERY_CLASSIFICATION,
                                operator: 'neq',
                            },
                            {
                                attributeName:
                                    '__propagatedClassificationNames',
                                attributeValue:
                                    ATLAN_PUBLIC_QUERY_CLASSIFICATION,
                                operator: 'neq',
                            },
                        ],
                    },
                ],
            }
        }
    }
    refreshBody()

    const fetchQueries = () => {
        refreshBody()
        const {
            data: queries,
            error: searchError,
            isLoading: loading,
        } = useAPI<SavedQueryResponse>(
            KeyMaps.INDEX_SEARCH,
            'POST',
            {
                body,
            },
            {}
        )
        watch(
            [queries, searchError, loading],
            ([newQueries, newError, newLoading]) => {
                data.value = newQueries
                error.value = newError
                isLoading.value = newLoading
            }
        )
    }
    const onQueryChange = useDebounceFn((query: string) => {
        if (query.length) fetchQueries()
    })

    watch([query, savedQueryType], ([newQuery]) => {
        isLoading.value = true

        onQueryChange(newQuery)
    })
    return { data, error, isLoading }
}

export default searchQueries
