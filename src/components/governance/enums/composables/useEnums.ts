import useSWRV from 'swrv'
import { computed, ref } from 'vue'
import { getAPIPath, fetcher } from '~/services/api/common'

import enumDef from '../enum.interface'

const serviceAlias = 'meta'
const enumTypedef = 'ENUM'

export default function useEnums() {
  const { data: enumListResponse, mutate, error } = useSWRV(
    [getAPIPath(serviceAlias, '/types/typedefs'), { type: enumTypedef }],
    fetcher,
    { revalidateOnFocus: false }
  )

  const loadingState = computed(() => ({
    pending: enumListResponse.value === undefined && !error.value,
    error: enumListResponse.value === undefined && error.value
  })
  )

  // data
  const currentEnumId = ref('')
  const searchText = ref('')

  const enumListData = computed<enumDef[]>(
    () => enumListResponse.value?.enumDefs || []
  )

  const selectedId = computed<string>({
    get: () => currentEnumId.value || enumListData.value?.[0]?.guid,
    set: (val) => {
      currentEnumId.value = val
    },
  })

  const selectedEnum = computed({
    get: () =>
      enumListData.value?.find(
        (enumObj) => enumObj.guid === selectedId.value
      ),
    set: (updatedEnum) => {
      if (updatedEnum) {
        const idx = enumListData.value.findIndex(
          (enumObj) => enumObj.guid === updatedEnum.guid
        )
        enumListData.value[idx] = updatedEnum
      }
    },
  })

  function addToList(newEnum: enumDef) {
    const newEnumList = [newEnum, ...enumListData.value]
    mutate(() => ({ enumDefs: newEnumList }))
    currentEnumId.value = newEnum.guid
  }

  const searchedEnumList = computed(() => {
    if (searchText.value) {
      return enumListData.value.filter((bm) =>
        bm.name.toUpperCase().includes(searchText.value.toUpperCase())
      )
    }
    return enumListData
  })

  const sortedSearchedEnum = computed(() => {
    const list = searchText.value
      ? searchedEnumList.value
      : enumListData.value

    const sortedList = list.sort((listA: any, listB: any) => {
      const a = listA.name.toLowerCase()
      const b = listB.name.toLowerCase()
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

  return {
    selectedId,
    enumListData,
    selectedEnum,
    refetchEnumList: mutate,
    addToList,
    loadingState,
    searchText,
    sortedSearchedEnum
  }
}
