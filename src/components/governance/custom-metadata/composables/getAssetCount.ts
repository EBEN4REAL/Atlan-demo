import { ref, watch } from 'vue'
import { Search } from '~/services/meta/search'
import { useTypedefStore } from '~/store/typedef'



const getAssetCount = (selectedBM) => {
    const typedefStore = useTypedefStore()
    const count = ref(0)


    const body = {
        "dsl": {
            "size": 50,
            "query": {
                "bool": {
                    "should": [
                        ...selectedBM.attributeDefs.map(a => ({
                            "exists": {
                                "field": a.name
                            }
                        }))
                    ]
                }
            }
        },
        attributes: typedefStore.getCustomMetadataListProjectionsByName(
            selectedBM.name
        ),
        suppressLogs: true
    }

    const {
        data,
        isLoading,
        isValidating,
        error,
        mutate,
        isReady
    } = Search.IndexSearch(body, { asyncOptions: { immediate: false } })
    watch(data, (v) => {
        count.value = v?.approximateCount || 0
    })

    return {
        isReady,
        mutate,
        data,
        error,
        count,
        isLoading,
        isValidating,
    }
}

export default getAssetCount