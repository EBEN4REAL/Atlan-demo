import { watch, ref } from 'vue'
import { message } from 'ant-design-vue'

import { useTypedefStore } from '~/store/typedef'
import { useOptions } from '~/services/api/common'

import { Types } from '~/services/meta/types'

export default function useDeleteTypedefs(name: string) {
    const options: useOptions = {}
    options.asyncOptions = ref({
        immediate: false
    })

    const { data, error, isLoading, mutate, isReady } = Types.DeleteTypedefs(name, options)

    const typedefStore = useTypedefStore()

    watch(data, () => {
        typedefStore.removeClassificationByName(name)
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
