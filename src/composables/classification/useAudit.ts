import { Ref, ref } from 'vue'
import { ClassificationInterface } from '~/types/classifications/classification.interface'
import { useAssetAuditSearch } from '~/composables/discovery/useAssetAuditSearch'

export function useAudit(classification: Ref<ClassificationInterface>) {
    const dependentKey = ref('CLASSIFICATION_ACCESS_LOG')
    const limit = ref(1)
    const offset = ref(0)
    const facets = ref({
        action: 'CLASSIFICATION_ADD',
    })
    if (classification.value.entityGuid) {
        facets.value.entityId = classification.value.entityGuid
    }

    const preference = ref({
        sort: 'created-desc',
    })

    const { list, isLoading, error } = useAssetAuditSearch({
        guid: classification.value.entityGuid,
        isCache: false,
        dependentKey,
        limit,
        offset,
        facets,
        preference,
    })

    return {
        list,
        isLoading,
        error,
    }
}
