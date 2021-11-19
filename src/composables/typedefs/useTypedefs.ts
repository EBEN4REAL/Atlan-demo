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

  const fillStore = (theData, where) => {
    console.log('store filled', where);

    typedefStore.setClassificationList(theData?.classificationDefs || [])
    typedefStore.setCustomMetadata(theData?.businessMetadataDefs || [])
    typedefStore.setEnumList(theData?.enumDefs || [])
  }

  if (data.value) fillStore(data.value, 'root') // if cached then set data
  watch(data, (newValue) => {
    console.log(newValue);

    fillStore(newValue, 'after update')
  })



  watch([isLoading, error], ([newIsLoading, newError], [oldisLoading, oldError]) => {
    typedefStore.setIsLoading(newIsLoading)
    typedefStore.setError(newError)
  }, { deep: true })
  return {
    data,
  }
}
