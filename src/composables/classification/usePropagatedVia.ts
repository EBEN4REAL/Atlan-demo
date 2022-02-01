import { computed, Ref, ref, watch } from 'vue'
import { useDiscoverList } from '~/composables/discovery/useDiscoverList'
import { ClassificationInterface } from '~/types/classifications/classification.interface'

/**
 * A composable for getting the entity from which the classification cascaded;
 * namely the entity where the classification was first linked.
 *
 * For example, a classification "PII" was linked to a table "NETFLIX_SERIES",
 * this classification would propagate to the table's columns too. This composable,
 * returns the table's details.
 * @param classification
 */
export function usePropagatedVia(classification: Ref<ClassificationInterface>) {
    const dependentKey = ref('CLASSIFICATION_ACCESS_LOG')
    const propagatedVia = ref({})
    const assetFetchData = {
        queryText: ref(''),
        limit: ref(1),
        offset: ref(0),
        facets: computed(() => ({
            guid: classification.value.entityGuid,
        })),
        postFacets: ref({}),
        aggregations: ref([]),
        preference: ref({ sort: 'default', display: [] }),
        isCache: false,
        dependentKey,
        attributes: ref(['certificateStatus']),
    }

    const { list, isLoading, error } = useDiscoverList(assetFetchData)

    watch(isLoading, () => {
        if (!isLoading.value && list.value && list.value.length > 0) {
            propagatedVia.value = { ...list.value[0] }
        }
    })

    const propagatedViaIcon = computed(() => {
        if (Object.keys(propagatedVia).length > 0) {
            const typeOfEntity = propagatedVia.value.typeName.replace(
                'AtlasGlossary',
                ''
            )
            if (propagatedVia.value?.attributes?.certificateStatus) {
                switch (propagatedVia.value?.attributes?.certificateStatus) {
                    case 'DRAFT': {
                        return `${typeOfEntity}Draft`
                    }

                    case 'VERIFIED': {
                        return `${typeOfEntity}Verified`
                    }

                    case 'DEPRECATED': {
                        return `${typeOfEntity}Deprecated`
                    }

                    default: {
                        return `${typeOfEntity}`
                    }
                }
            } else {
                return `${typeOfEntity}`
            }
        }
        return ''
    })

    return {
        list,
        isLoading,
        error,
        propagatedVia,
        propagatedViaIcon,
    }
}
