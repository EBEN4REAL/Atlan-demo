import { ref, Ref, watch } from 'vue'
import { KeyMaps } from '~/services/atlas/atlas_keyMpas'
import { useAPIAsyncState } from '~/api/useAPI'
import {
    SavedQueryResponse,
    SavedQuery,
} from '~/types/insights/savedQuery.interface'
import { BaseAttributes, SavedQueryAttributes } from '~/constant/projection'
import { useDebounceFn } from '@vueuse/core'

const searchQueries = (query: Ref<string>, offset?: Ref<number>, limit?: Ref<number>) => {
    const body = ref({})
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
    
    watch(query, (newQuery) => {
        onQueryChange(newQuery)
    })
    return { data, error, isLoading }
}

export default searchQueries