import { ref, computed, watch } from 'vue'
import { useBody } from '~/composables/discovery/useBody'
import useIndexSearch from '~/composables/discovery/useIndexSearch'
import { assetInterface } from '~/types/assets/asset.interface'

export default function useFetchAssetList({
    queryText,
    offset,
    limit,
    facets,
    isCache,
    dependentKey,
    attributes,
}) {
    const defaultBody = ref({})
    const generateBody = () => {
        const dsl = useBody(
            queryText?.value,
            offset?.value,
            limit?.value,
            facets?.value
        )
        defaultBody.value = {
            dsl,
            attributes: attributes?.value,
        }
    }
    generateBody()
    const localKey = ref(dependentKey?.value)

    const {
        data,
        refresh,
        isLoading,
        aggregationMap,
        approximateCount,
        cancelRequest,
        error,
        isValidating,
    } = useIndexSearch<assetInterface>(
        defaultBody,
        localKey,
        isCache?.value,
        false,
        1
    )

    const list = ref<assetInterface[]>([])
    watch(data, () => {
        if (offset?.value > 0) {
            if (data.value?.entities) {
                list.value.push(...data.value?.entities)
            }
        } else if (data.value?.entities) {
            list.value = [...data?.value?.entities]
        } else {
            list.value = []
        }
    })
    const totalCount = computed(() => approximateCount.value)
    const isLoadMore = computed(() => {
        if (totalCount.value > list?.value?.length) {
            return true
        }
        return false
    })
    const quickChange = () => {
        generateBody()
        cancelRequest()
        if (localKey.value) {
            localKey.value = `dirty_${Date.now().toString()}`
        } else {
            refresh()
        }
    }
    const updateList = (asset) => {
        console.log('assset', asset)
        const index = list.value.findIndex((i) => i.guid === asset.guid)
        console.log('assset', index)
        if (index > -1) {
            list.value[index] = asset
        }
    }

    return {
        list,
        isLoading,
        error,
        updateList,
        quickChange,
        isLoadMore,
        aggregationMap,
        isValidating,
    }
}
