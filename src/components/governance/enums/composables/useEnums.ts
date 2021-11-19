import useSWRV from 'swrv'
import { computed, ref } from 'vue'
import { getAPIPath, fetcher } from '~/services/api/common'
import { useTypedefStore } from '~/store/typedef'
import enumDef from '../enum.interface'
import useTypedefData from '~/composables/typedefs/useTypedefData'
import { mutate } from 'swrv'


const serviceAlias = 'meta'
const enumTypedef = 'ENUM'

export default function useEnums() {
  const store = useTypedefStore()
  const isLoading = computed(() => store.isLoading)


  // data
  const currentEnumId = ref('')
  const searchText = ref('')

  const { enumList } = useTypedefData()

  const selectedId = computed<string>({
    get: () => currentEnumId.value || enumList.value?.[0]?.guid,
    set: (val) => {
      currentEnumId.value = val
    },
  })

  const selectedEnum = computed({
    get: () =>
      enumList.value?.find(
        (enumObj) => enumObj.guid === selectedId.value
      ),
    set: (updatedEnum) => {
      if (updatedEnum) {
        const idx = enumList.value.findIndex(
          (enumObj) => enumObj.guid === updatedEnum.guid
        )
        enumList.value[idx] = updatedEnum
      }
    },
  })

  function addToList(newEnum: enumDef) {
    store.appendEnumList([newEnum])
    currentEnumId.value = newEnum.guid
    // const newEnumList = [newEnum, ...enumList.value]
    // mutate('DEFAULT_TYPEDEFS',() => ({ enumDefs: newEnumList })) // TODO findout how to update swrv store
  }

  const searchedEnumList = computed(() => {
    if (searchText.value) {
      return enumList.value.filter((bm) =>
        bm.name.toUpperCase().includes(searchText.value.toUpperCase())
      )
    }
    return enumList.value
  })


  return {
    selectedId,
    enumList,
    selectedEnum,
    addToList,
    isLoading,
    searchText,
    searchedEnumList,
  }
}
