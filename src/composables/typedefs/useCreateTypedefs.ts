import { watch, ref, Ref } from 'vue'
import { message } from 'ant-design-vue'

import { useTypedefStore } from '~/store/typedef'
import { useOptions } from '~/services/api/common'

import { Types } from '~/services/meta/types'

export default function useCreateTypedefs(body: Ref<Record<string, any>>) {
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

    watch(error, (newError) => {
        if(newError) {
            message.error(newError.response.data.errorMessage)
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
