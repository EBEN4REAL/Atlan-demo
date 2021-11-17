import { watch } from 'vue'

import { useTypedefStore } from '~/store/typedef'

import { Types } from '~/services/meta/types'


const typeMap = (type) => {
  switch (type) {
    case 'ENUM':
      return {
        def: "",
        storeActionKey: ""
      }
    case 'BUSINESS_METADATA':
      return {
        def: "businessMetadataDefs",
        storeActionKey: ""
      }
    default:
      return null
  }
}



export default function useUpdateTypedefs(payload, type) {
  const { data, error, isLoading } = Types.updateCustomMetadata(
    {
      businessMetadataDefs: [payload],
    },
    {
      options: {
        params: { type: 'BUSINESS_METADATA' },
      },
    }
  )

  const typedefStore = useTypedefStore()

  watch(data, () => {
    if (data.value?.classificationDefs?.length) {
      typedefStore.appendClassificationList(data.value?.classificationDefs)
    }
  })
  return {
    data,
    error,
    isLoading
  }
}
