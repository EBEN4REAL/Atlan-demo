import { watch, ref } from 'vue'

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
    
    return {
        data,
        error,
        isLoading,
        isReady,
        mutate
    }
}
