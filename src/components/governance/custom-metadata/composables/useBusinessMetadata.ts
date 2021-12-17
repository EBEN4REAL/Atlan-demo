import { ref, watch, toRaw, computed } from 'vue'
import LocalStorageCache from 'swrv/dist/cache/adapters/localStorage'
import { DEFAULT_ATTRIBUTE, DEFAULT_BM } from '~/constant/businessMetadataTemplate'
// import { generateUUID } from '~/utils/helper/generator'
import { useTypedefStore } from '~/store/typedef'
import { Types } from '~/services/meta/types'


// Types
interface attributeDefs {
  name: string
  options: { displayName: string }
}
interface BMMap {
  options: { displayName: string }
  name: string
  attributeDefs: [
    {
      name: string
      options: { displayName: string }
    }
  ]
}
interface BMObject {
  error?: null | object
  data?: {
    attributeDefs: attributeDefs[]
    name: string
  } | null
}

export default function useBusinessMetadata() {
  // * Get all available BMs and save on store
  const store = useTypedefStore()


  // * Data
  const currentBmId = ref('')
  const searchText = ref('')

  const finalBusinessMetadataList = computed(() => store.getCustomMetadataList)
  const isLoading = computed(() => store.isLoading)
  const error = computed(() => store.error)

  const selectedId = computed<string>({
    get: () => currentBmId.value || finalBusinessMetadataList.value?.[0]?.guid,
    set: (val) => {
      console.log("check");

      currentBmId.value = val
    },
  })


  const selectedBm = computed(() => {
    if (!selectedId.value)
      return finalBusinessMetadataList.value?.length && finalBusinessMetadataList.value[0]
    return finalBusinessMetadataList.value?.find(
      (cmObj) => cmObj.guid === selectedId.value
    )
  }
  )

  const handleSelectBm = (item: any) => {
    selectedBm.value = item
  }

  /**
   * @desc if an existing bm is being updated, set updated bm to
   */
  const onUpdate = (bm: { guid: string } | null) => {
  }



  const handleAfterArchive = () => {
    console.log('handleAfterArchive')
  }
  const searchedBusinessMetadataList = computed(() => {
    if (searchText.value) {
      return finalBusinessMetadataList.value.filter((bm) =>
        bm.displayName.toUpperCase().includes(searchText.value.toUpperCase())
      )
    }
    return finalBusinessMetadataList
  })

  /**
   * @param {Object} BmObject -  final BM object ready for updating
   * @desc - checks for invalid/ missing data, also handles missing name key
   */
  const validatePayload = (BmObject: {
    name: string
    description: string
    options: { displayName: string }
    guid: string
    attributeDefs: object & {}
  }) => {
    const temp: BMObject = {
      error: null,
      data: null,
    }
    temp.data = JSON.parse(JSON.stringify(BmObject))
    if (!temp.data.description.length) temp.data.description = '-'
    if (!temp.data.options.displayName) {
      temp.error = {
        data: { errorMessage: 'Custom Metadata name cannot be empty' },
      }
      return temp
    }
    // * if creating new BM append displayName to name,
    if (!temp.data.name) temp.data.name = temp.data.options.displayName
    if (temp.data && temp.data.attributeDefs.length) {
      // eslint-disable-next-line
      for (let i = 0; i < temp.data.attributeDefs.length; i++) {
        delete temp.data.attributeDefs[i].id
        const attribute = temp.data.attributeDefs[i]
        if (!attribute.options.displayName) {
          temp.error = {
            data: {
              errorMessage: 'Attribute names cannot be empty',
            },
          }
          return temp
        }
        if (!attribute.name) {
          // * if creating new BM attribtue <> append displayName to name,
          temp.data.attributeDefs[i].name =
            attribute.options.displayName
        }
        // eslint-disable-next-line no-prototype-builtins
        if (temp.data.attributeDefs[i].hasOwnProperty('isNew')) {
          delete temp.data.attributeDefs[i].isNew
        }
        // if (temp.data.attributeDefs[i].hasOwnProperty("isEditing")) {
        //     delete temp.data.attributeDefs[i].isEditing;
        // }
      }
    }
    return temp
  }

  const sortedSearchedBM = computed(() => {
    const list = searchText.value
      ? searchedBusinessMetadataList.value
      : finalBusinessMetadataList.value

    const sortedList = list.sort((listA: any, listB: any) => {
      const a = listA.displayName.toLowerCase()
      const b = listB.displayName.toLowerCase()
      if (a < b) {
        return -1
      }
      if (a > b) {
        return 1
      }
      return 0
    })
    return sortedList
  })



  // Utility functions 
  const getDefaultAttributeTemplate = () =>
    // const uuid4 = generateUUID()
    // TODO changes when UUID4 support
    ({ ...DEFAULT_ATTRIBUTE })
  // return { ...DEFAULT_ATTRIBUTE, name: uuid4 };



  return {
    selectedId,
    error,
    isLoading,
    finalBusinessMetadataList,
    getDefaultAttributeTemplate,
    handleAfterArchive,
    handleSelectBm,
    onUpdate,
    searchText,
    searchedBusinessMetadataList,
    selectedBm,
    validatePayload,
    sortedSearchedBM,
  }
}
