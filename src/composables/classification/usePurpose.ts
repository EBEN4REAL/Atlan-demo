import { computed, Ref } from 'vue'
import { ClassificationInterface } from '~/types/classifications/classification.interface'
import usePurposeList from '@/governance/purposes/composables/usePurposeListV2'

interface UsePurpose {
    classification: Ref<ClassificationInterface>
    limit?: Ref<string>
    options?: Object
}

interface UsePurposeResult {
    purposes: Ref<Array<any>> | undefined
    isLoading: Ref<Boolean> | undefined
    error: any | undefined
}

export function usePurpose({
    classification,
    limit,
    options,
}: UsePurpose): UsePurposeResult {
    const searchParams = computed(
        () =>
            new URLSearchParams({
                limit: limit?.value ?? '100',
                filter: JSON.stringify({
                    tags: {
                        $elemMatch: [classification.value.typeName],
                    },
                }),
            })
    )

    const {
        results: purposes,
        isLoading,
        error,
    } = usePurposeList(
        options ?? { asyncOptions: { immediate: true } },
        searchParams.value
    )

    return {
        purposes,
        isLoading,
        error,
    }
}
