import { ref, Ref } from 'vue'
import { useOptions } from '~/services/api/common'
import { Entity } from '~/services/meta/entity'

export default function updateAsset(
    body: Record<string, any> | Ref<Record<string, any>>,
    token?: any
) {
    const options: useOptions = {}

    if (token) {
        options.options = ref({
            cancelToken: token.value,
        })
    }
    options.asyncOptions = ref({
        immediate: false,
    })

    const { data, mutate, error, isLoading } = Entity.BulkUpdate(body, options)

    return {
        data,
        mutate,
        error,
        isLoading,
    }
}
