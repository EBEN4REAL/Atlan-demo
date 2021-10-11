import { ref, Ref, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'

import { useAPIAsyncState } from '~/api/useAPI'
import {
    SavedQueryResponse,
    SavedQuery,
} from '~/types/insights/savedQuery.interface'
import { BasicSearchResponse } from '~/types/common/atlasSearch.interface'

import { KeyMaps } from '~/services/atlas/atlas_keyMaps'
import { BaseAttributes, SavedQueryAttributes } from '~/constant/projection'
import { ATLAN_PUBLIC_QUERY_CLASSIFICATION } from '~/components/insights/common/constants';

const searchQueries = (query: Ref<string>, savedQueryType: Ref<'all' | 'personal'>, offset?: Ref<number>, limit?: Ref<number>) => {
    const body = ref<Record<string, any>>({})
    const data = ref<BasicSearchResponse<SavedQuery>>();
    const isLoading = ref(true);
    const error = ref();

    const refreshBody = () => {
        body.value = {
            typeName: 'Query',
            excludeDeletedEntities: true,
            includeClassificationAttributes: true,
            includeSubClassifications: true,
            includeSubTypes: true,
            attributes: [
                ...BaseAttributes,
                ...SavedQueryAttributes,
            ],
            query: query.value,
            offset: offset?.value ?? 0,
            limit: limit?.value ?? 50,
        }
        if(savedQueryType?.value === 'all') {
            body.value.entityFilters = {
                condition: 'AND',
                criterion: [{
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
                }]
            }
        }  else {
            body.value.entityFilters = {
                condition: 'AND',
                criterion: [{
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
                }]
            }
        }
    }
    refreshBody();

    const fetchQueries = () => {
        refreshBody()
        const { data:queries, error: searchError, isLoading:loading } = useAPIAsyncState<SavedQueryResponse>(
            KeyMaps.insights.BASIC_SEARCH,
            'POST',
            {  
                body,
            }
        )
        watch([queries, searchError, loading], ([newQueries, newError, newLoading]) => {
            data.value = newQueries
            error.value = newError
            isLoading.value = newLoading
        })
    }
    const onQueryChange = useDebounceFn((query: string) => {
        if(query.length) fetchQueries()
    })

    watch([query, savedQueryType], ([newQuery]) => {
        isLoading.value = true

        onQueryChange(newQuery)
    })
    return { data, error, isLoading }
}

export default searchQueries