import { ref, Ref } from 'vue'
import { useOptions } from '~/services/api/common'
import { Entity } from '~/services/meta/entity'

export default function useSetClassifications(
    body: Record<string, any> | Ref<Record<string, any>>
) {
    const options: useOptions = {}

    options.asyncOptions = ref({
        immediate: false,
    })
    const { data, mutate, error, isLoading } = Entity.SetClassifications(
        body,
        options
    )
    return {
        data,
        mutate,
        error,
        isLoading,
    }
}
