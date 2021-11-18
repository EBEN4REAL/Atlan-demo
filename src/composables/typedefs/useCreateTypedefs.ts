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

    const { data, error, isLoading, isReady, mutate } = Types.CreateTypedefs(body, options)

    const typedefStore = useTypedefStore()

    watch(data, () => {
        if(data.value?.classificationDefs?.length) {
            typedefStore.appendClassificationList(data.value?.classificationDefs)
        }
        if(data.value?.enumDefs?.length) {
            typedefStore.appendEnumList(data.value?.enumDefs)
        }
        if(data.value?.businessMetadataDefs?.length) {
            typedefStore.appendCustomMetadata(data.value?.businessMetadataDefs)
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
