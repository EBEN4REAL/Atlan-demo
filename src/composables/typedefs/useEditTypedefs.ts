import { watch, ref } from 'vue'

import { useTypedefStore } from '~/store/typedef'
import { useOptions } from '~/services/api/common'

import { Types } from '~/services/meta/types'

export default function useCreateTypedefs(body: Record<string, any>) {
    const options: useOptions = {}
    options.asyncOptions = ref({
        immediate: false,
        onError: (e) => {
            throw e
        },
    })

    const { data, error, isLoading, mutate, isReady } = Types.EditTypedefs(body, options)

    const typedefStore = useTypedefStore()

    watch(data, () => {
        if(data.value?.classificationDefs?.length) {
            data.value?.classificationDefs.forEach((classification) => {
                typedefStore.updateSingleClassification(classification)
            })
        }
    })
    return {
        data,
        error,
        isLoading,
        isReady,
        mutate
    }
}
