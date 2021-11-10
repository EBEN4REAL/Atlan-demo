import { watch } from 'vue'

import { useTypedefStore } from '~/store/typedef'

import { Types } from '~/services/meta/types'

export default function useCreateTypedefs(body: Record<string, any>) {
    const { data, error, isLoading } = Types.CreateTypedefs(body)

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
        isLoading
    }
}
