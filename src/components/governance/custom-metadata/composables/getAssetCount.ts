import { ref, watch } from 'vue'
import { Search } from '~/services/meta/search'
import { useTypedefStore } from '~/store/typedef'



const getAssetCount = (selectedBM) => {
    const typedefStore = useTypedefStore()
    const assets = ref([])

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
        assets.value = data?.value?.entities || []
    })

    return {
        isReady,
        assets,
        mutate,
        error,
        isLoading,
        isValidating,
    }
}

export default getAssetCount