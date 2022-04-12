import { computed, ComputedRef, isRef, Ref, ref, watch } from 'vue'
import useFetchAssetList from '@common/assetList/usefetchAssetList'
import {
    AssetAttributes,
    AssetRelationAttributes,
    GlossaryAttributes,
    InternalAttributes,
    MinimalAttributes,
} from '~/constant/projection'

/**
 * A utility function to get the number of terms linked to a category.
 *
 * @param categoryQualifiedName - The qualified name of the category to which
 * the terms belong.
 */
export function useLinkedTerms(
    categoryQualifiedName: ComputedRef<string> | string
): {
    linkedTermsCount: ComputedRef<number>
    isLoading: Ref<boolean>
} {
    const queryText = ref('')
    const preference = ref({ sort: 'default', display: [] })
    const postFilters = ref({
        typeName: '__all',
    })
    const aggregations = ref(['typeName'])
    const isCache = ref(false) // use SWRV or not
    const defaultAttributes = ref([...MinimalAttributes])
    const relationAttributes = ref([])

    const { assetTypeAggregationList, isLoading } = useFetchAssetList({
        queryText,
        offset: ref(0),
        limit: ref(0),
        facets: ref({
            parentCategory: isRef(categoryQualifiedName)
                ? categoryQualifiedName.value
                : categoryQualifiedName,
        }),
        postFacets: postFilters,
        aggregations,
        preference,
        isCache,
        dependentKey: ref(
            isRef(categoryQualifiedName)
                ? categoryQualifiedName.value
                : categoryQualifiedName
        ),
        attributes: defaultAttributes,
        relationAttributes,
        suppressLogs: true,
    })

    const linkedTermsCount = computed(
        () =>
            assetTypeAggregationList.value.find(
                (agg) => agg && agg.label === 'Term'
            )?.count || 0
    )

    return {
        linkedTermsCount,
        isLoading,
    }
}
