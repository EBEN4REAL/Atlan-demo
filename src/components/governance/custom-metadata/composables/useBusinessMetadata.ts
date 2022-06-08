import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { DEFAULT_ATTRIBUTE, DEFAULT_BM } from '~/constant/businessMetadataTemplate'
import { useTypedefStore } from '~/store/typedef'
import { applicableTypeList } from '~/composables/custommetadata/useApplicableTypes'


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
  const router = useRouter()


  // * Data
  const currentBmId = ref('')
  const searchText = ref('')

  const finalBusinessMetadataList = computed(() => store.getCustomMetadataList)
  const isLoading = computed(() => store.isLoading)
  const error = computed(() => store.error)

  const selectedId = computed<string>({
    get: () => currentBmId.value,
    set: (val) => {
      currentBmId.value = val
    },
  })

  const select = (id) => {
    selectedId.value = id
    router.replace(`/governance/custom-metadata/${id}`)
  }

  const resetSelection = () => {
    if (
      finalBusinessMetadataList.value?.length &&
      finalBusinessMetadataList.value[0]?.guid
    )
      select(finalBusinessMetadataList.value[0].guid)
  }

  const selectedBm = computed(
    () => {
      const bm = finalBusinessMetadataList.value?.find(
        (cmObj) => cmObj.guid === selectedId.value
      )
      return bm
    }
  )



  const handleSelectBm = (item: any) => {
    selectedBm.value = item
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
  const getDefaultAttributeTemplate = () => {
    const applicableEntityTypesOptions = applicableTypeList()
    const template = JSON.parse(JSON.stringify(DEFAULT_ATTRIBUTE))
    template.options.customApplicableEntityTypes = applicableEntityTypesOptions.reduce(
      (acc, item) => {
        const allChilds = [...acc]
        item.children.forEach(c => {
          if (c?.children)
            allChilds.push(...c.children.map(a => a.value))

          else
            allChilds.push(c.value)
        })
        return allChilds
      },
      []
    )
    return template
  }



  return {
    select,
    selectedId,
    error,
    isLoading,
    finalBusinessMetadataList,
    getDefaultAttributeTemplate,
    handleAfterArchive,
    handleSelectBm,
    searchText,
    searchedBusinessMetadataList,
    selectedBm,
    resetSelection,
    validatePayload,
    sortedSearchedBM,
  }
}
