import { watch, ref, Ref } from 'vue'
import { message } from 'ant-design-vue'

import { useTypedefStore } from '~/store/typedef'
import { useOptions } from '~/services/api/common'

import { Types } from '~/services/meta/types'

export default function useEditTypedefs(body: Ref<Record<string, any>>) {
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
