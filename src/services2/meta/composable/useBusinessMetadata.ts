import LocalStorageCache from 'swrv/dist/cache/adapters/localStorage'
import { watch } from 'vue'

import { useClassificationStore } from '~/store/classification'

import { Typedefs } from '../typedefs'

export default function useBusinessMetadata() {
    const { data } = Typedefs.GetTypedefs(
        {
            type: 'BUSINESS_METADATA',
        },
        {
            cacheKey: 'DEFAULT_CLASSIFICATIONS',
            cache: {
                shouldRetryOnError: false,
                revalidateOnFocus: false,
                cache: new LocalStorageCache(),
                dedupingInterval: 1,
            },
        }
    )
    const classificationStore = useClassificationStore()
    watch(data, () => {
        classificationStore.setList(data.value?.classificationDefs || [])
    })
    return {
        data,
    }
}
