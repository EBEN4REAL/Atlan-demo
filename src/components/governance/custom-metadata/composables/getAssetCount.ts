import { computed, ref, watch } from 'vue'
import { metadataLinkedAssetsAttributes } from '~/constant/projection'
import { Search } from '~/services/meta/search'
import { useTypedefStore } from '~/store/typedef'



const getAssetCount = (selectedBM) => {
    const typedefStore = useTypedefStore()
    const assets = ref([])
    const count = ref(0)
    const offset = ref(0)
    const size = 5

    const body = computed(() => ({
        "dsl": {
            size,
            "from": offset.value,
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
        attributes: [
            ...typedefStore.getCustomMetadataListProjectionsByName(selectedBM.name, true),
            ...metadataLinkedAssetsAttributes],
        suppressLogs: true
    }))

    const {
        data,
        isLoading,
        isValidating,
        error,
        mutate,
        isReady
    } = Search.IndexSearch(body, { asyncOptions: { immediate: false } })
    watch(data, (v) => {
        if (offset.value > 0)
            assets.value.push(...(data?.value?.entities || []))
        else
            assets.value = data?.value?.entities || []
        count.value = data.value?.approximateCount || 0
    })

    const isLoadMore = computed(() => {
        if (!data.value) return false
        return assets.value.length < count.value
    })

    const handleLoadMore = async () => {
        offset.value += size
        await mutate()
    }

    const removeAsset = (id) => {
        assets.value = assets.value.filter(
            (asset) => asset?.guid !== id
        )
        offset.value -= 1
        count.value -= 1
    }

    return {
        count,
        removeAsset,
        isLoadMore,
        handleLoadMore,
        isReady,
        assets,
        mutate,
        error,
        isLoading,
        isValidating,
    }
}

export default getAssetCount