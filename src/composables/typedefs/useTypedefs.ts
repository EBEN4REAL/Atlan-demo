import LocalStorageCache from 'swrv/dist/cache/adapters/localStorage'
import { watch } from 'vue'

import { useTypedefStore } from '~/store/typedef'

import { Types } from '~/services/meta/types'

export default function useTypedefs() {
  const { data, isLoading, error, } = Types.GetTypedefs(
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

  watch([isLoading.value, error.value], ([newIsLoading, newError]) => {
    typedefStore.setIsLoading(newIsLoading)
    typedefStore.setError(newError)
  }, { deep: true })
  return {
    data,
  }
}
