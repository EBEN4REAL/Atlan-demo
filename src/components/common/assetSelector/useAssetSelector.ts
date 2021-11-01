import { ref, watch } from "vue"
// dont import from discovery
import { useBody } from "~/composables/discovery/useBody"
import { assetInterface } from "~/types/assets/asset.interface"
import useIndexSearch from "~/composables/discovery/useIndexSearch"

const useAssetSelector = ({ dependentKey, typeName }, emit) => {

    const value = ref('')

    const searchText = ref('')

    const offset = ref(0)
    const limit = ref(10)

    const defaultBody = ref({})

    const generateBody = () => {
        const dsl = useBody(
            searchText?.value,
            offset?.value,
            limit?.value,
            {
                typeName: typeName.value
            }

        )

        defaultBody.value = {
            dsl
        }

        console.log({ dsl }, typeName)
    }

    const localKey = ref(dependentKey?.value)

    generateBody()

    const {
        data,
        refresh,
        isLoading,
        isValidating,
        aggregationMap,
        approximateCount,
        cancelRequest,
    } = useIndexSearch<assetInterface>(defaultBody, localKey, false, false, 1)


    const list = ref<assetInterface[]>([])

    watch(data, () => {
        if (offset?.value > 0) {
            if (data.value?.entities) {
                list.value.push(...data.value?.entities)
            }
        } else if (data.value?.entities) {
            list.value = [...data?.value?.entities].map(e => ({ data: e, key: e.displayText, label: e.displayText, value: e.guid, id: e.displayText }))
        } else {
            list.value = []
        }
    })

    const quickChange = () => {
        generateBody()
        cancelRequest()
        localKey.value = `dirty_${Date.now().toString()}`
    }

    const handleSearch = (v) => {
        searchText.value = v
        quickChange()
        refresh()
    }
    const handleChange = (v) => {
        emit("select", v)
        console.log(v)
    }




    return { value, handleSearch, handleChange, list, loading: isLoading }
}

export default useAssetSelector;