import bodybuilder from 'bodybuilder'
import { computed, Ref, ref, watch } from 'vue'
import { ClassificationInterface } from '~/types/classifications/classification.interface'
import { Search } from '~/services/meta/search'
import useFetchAssetList from '@common/assetList/usefetchAssetList'

/**
 * A composable for getting the count of assets which have this particular
 * classification attached.
 *
 * @param classification
 */
export function useLinkedAssets(classification: Ref<ClassificationInterface>) {
    const dependentKey = ref('CLASSIFICATION_LINKED_ASSETS_COUNT')
    const postFilters = ref({
        typeName: '__all',
    })
    const filter = computed(() => ({
        __traitNames: {
            classifications: [classification.value.name],
        },
    }))
    const limit = ref(20)
    const offset = ref(0)
    const queryText = ref('')
    const preference = ref({ sort: 'default', display: [] })
    const aggregations = ref(['typeName'])
    const isCache = ref(true)
    const attributes = ref([])
    const { isLoading, assetTypeAggregationList } = useFetchAssetList({
        queryText,
        limit,
        attributes,
        offset,
        facets: filter,
        postFacets: postFilters,
        aggregations,
        preference,
        isCache,
        dependentKey,
        suppressLogs: true,
    })
    const totalCount = computed(() =>
        assetTypeAggregationList.value.reduce(
            (prev, curr, index, arr) => prev + arr[index].count,
            0
        )
    )

    return {
        assetCount: totalCount,
        isLoading,
    }
}
