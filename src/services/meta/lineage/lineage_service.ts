import { computed, Ref, ComputedRef } from 'vue'
import { getLineageOptions, lineageServiceAPI } from './lineage_api'

export default function useLineageService() {
    function useFetchLineage(
        config: Ref<getLineageOptions> | getLineageOptions | ComputedRef<getLineageOptions>
    ) {
        const {
            data,
            error,
            isLoading,
            isReady,
            mutate: reFetch,
        } = lineageServiceAPI.getLineage(config)

        const guidEntityMap = computed(() => data.value.guidEntityMap)
        const relations = computed(() => data.value.relations)

        return {
            data,
            error,
            isLoading,
            isReady,
            reFetch,
            guidEntityMap,
            relations,
        }
    }

    return { useFetchLineage }
}
