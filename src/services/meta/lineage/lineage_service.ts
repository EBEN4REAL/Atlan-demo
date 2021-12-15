import { computed, Ref, ComputedRef, ref } from 'vue'
import { getLineageOptions, lineageServiceAPI } from './lineage_api'

export default function useLineageService() {
    function useFetchLineage(
        config:
            | Ref<getLineageOptions>
            | getLineageOptions
            | ComputedRef<getLineageOptions>
    ) {
        const asyncOptions = {
            resetOnExecute: false,
            immediate: false,
        }
        const { data, error, isLoading, isReady, mutate } =
            lineageServiceAPI.getLineage(config, asyncOptions)

        const guidEntityMap = computed(() => data.value.guidEntityMap)
        const relations = computed(() => data.value.relations)

        return {
            data,
            error,
            isLoading,
            isReady,
            mutate,
            guidEntityMap,
            relations,
        }
    }

    return { useFetchLineage }
}
