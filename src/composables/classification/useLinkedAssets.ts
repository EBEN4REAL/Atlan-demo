import bodybuilder from 'bodybuilder'
import { Ref, ref, watch } from 'vue'
import { ClassificationInterface } from '~/types/classifications/classification.interface'
import { Search } from '~/services/meta/search'

/**
 * A composable for getting the count of assets which have this particular
 * classification attached.
 *
 * @param classification
 */
export function useLinkedAssets(classification: Ref<ClassificationInterface>) {
    const query = bodybuilder()
        .filter('terms', '__traitNames', [classification.value.name])
        .build()
    const assetCount = ref(0)
    const { data, isLoading, error } = Search.IndexSearch(
        { dsl: query },
        {
            cacheKey: 'CLASSIFICATION_LINKED_ASSETS_COUNT',
        }
    )
    watch(isLoading, () => {
        if (!isLoading.value && !error.value) {
            assetCount.value = data.value?.approximateCount || 0
        }
    })

    return {
        assetCount,
        isLoading,
    }
}
