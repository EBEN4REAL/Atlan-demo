import { computed } from 'vue'
import useWorkflowIndexSearch from './useWorkflowIndexSearch'

export function useWorkflowTypes(immediate = true) {
    const dsl = {
        size: 0,
        aggs: {
            by_types: {
                nested: {
                    path: 'metadata',
                },
                aggs: {
                    by_type: {
                        terms: {
                            field: 'metadata.labels.orchestration.atlan.com/type.keyword',
                            size: 100,
                        },
                    },
                },
            },
        },
        query: {
            bool: {
                filter: {
                    nested: {
                        path: 'metadata',
                        query: {
                            term: {
                                'metadata.labels.orchestration.atlan.com/atlan-ui.keyword':
                                    true,
                            },
                        },
                    },
                },
            },
        },
    }

    const { data, refresh, isLoading, isValidating, cancelRequest, error } =
        useWorkflowIndexSearch(dsl, immediate)

    const workflowTypeList = computed(
        () => data.value?.aggregations?.by_types?.by_type?.buckets || []
    )
    const quickChange = () => {
        cancelRequest()
        refresh()
    }

    return {
        isValidating,
        isLoading,
        data,
        cancelRequest,
        error,
        quickChange,
        refresh,
        workflowTypeList,
    }
}
