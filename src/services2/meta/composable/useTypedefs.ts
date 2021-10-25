import LocalStorageCache from 'swrv/dist/cache/adapters/localStorage'
import { watch } from 'vue'

import { useTypedefStore } from '~/store/typedef'

import { Typedefs } from '../typedefs'

export default function useTypedefs() {
    const { data } = Typedefs.GetTypedefs(
        {},
        {
            cacheKey: 'DEFAULT_TYPEDEFS',
            cacheOptions: {
                shouldRetryOnError: false,
                revalidateOnFocus: false,
                cache: new LocalStorageCache(),
                dedupingInterval: 1,
            },
        }
    )
    const typedefStore = useTypedefStore()
    watch(data, () => {
        typedefStore.setClassificationList(data.value?.classificationDefs || [])
        typedefStore.setCustomMetadata(data.value?.businessMetadataDefs || [])
        typedefStore.setEnumList(data.value?.enumDefs || [])
    })
    return {
        data,
    }
}
