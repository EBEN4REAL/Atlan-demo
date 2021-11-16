import { computed, ref, Ref } from 'vue'
import { useOptions } from '~/services/api/common'
import { Entity } from '~/services/meta/entity'

export default function updateAsset(
    body: Record<string, any> | Ref<Record<string, any>>
) {
    const options: useOptions = {}
    options.asyncOptions = ref({
        immediate: false,
        onError: (e) => {
            throw e
        },
    })
    const { data, mutate, error, isLoading, isReady } = Entity.BulkUpdate(
        body,
        options
    )

    const guidCreatedMaps = computed(() => {
        if (data.value?.mutatedEntities?.CREATE) {
            return data.value.mutatedEntities.CREATE.map((i) => i.guid)
        }
        return []
    })

    const guidUpdatedMaps = computed(() => {
        if (data.value?.mutatedEntities?.UPDATE) {
            return data.value.mutatedEntities.UPDATE.map((i) => i.guid)
        }
        return []
    })

    return {
        data,
        mutate,
        error,
        isLoading,
        isReady,
        guidUpdatedMaps,
        guidCreatedMaps,
    }
}
