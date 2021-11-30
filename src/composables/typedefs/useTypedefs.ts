import LocalStorageCache from 'swrv/dist/cache/adapters/localStorage'
import { watch, ref } from 'vue'

import { useTypedefStore } from '~/store/typedef'

import { Types } from '~/services/meta/types'

export default function useTypedefs() {
  const { data, isLoading, error, mutate } = Types.GetTypedefs(
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
    typedefStore.setClassificationList(theData?.classificationDefs || [])
    typedefStore.setCustomMetadata(theData?.businessMetadataDefs || [])
    typedefStore.setEnumList(theData?.enumDefs || [])
  }

  if (data.value) fillStore(data.value, 'root') // if cached then set data
  const initalValidation = ref(false) // to void changing store each time mutate happens like the next watch below
  watch(data, (newValue) => {
    if (initalValidation.value) return
    fillStore(newValue, 'after update')
    initalValidation.value = true
  }
  )

  // used to force a revalidation after an update, this is a fix for bug when revlidation on page refresh takes too long
  watch(() => typedefStore.forceRevalidate, (newValue, oldValue) => {
    if (newValue !== oldValue)
      mutate()
  })


  watch([isLoading, error], ([newIsLoading, newError], [oldisLoading, oldError]) => {
    typedefStore.setIsLoading(newIsLoading)
    typedefStore.setError(newError)
  }, { deep: true })
  return {
    data,
  }
}
