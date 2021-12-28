import { Ref, ref, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import usePurposeService from './usePurposeService'

const usePurposeList = (options) => {
    const { list } = usePurposeService()
    const params = ref(new URLSearchParams())
    const filter: Ref<object> = ref({})
    const searchText = ref('')

    const {
        data,
        isLoading,
        error,
        isReady,
        mutate
    } = list(params, options)


    const results = ref([])


    const handleSearch = useDebounceFn(() => {
        if (searchText.value) {
            filter.value = {
                ...filter.value,
                displayName: { $ilike: `%25${searchText.value}%25` },
            }
        } else delete filter.value.displayName
        params.value.set('filter', JSON.stringify(filter.value))
        mutate()
    }, 700)


    watch([data, error], (a, b) => {
        if (data.value?.records)
            results.value = data.value.records
        else results.value = []
    })




    return {
        searchText,
        filter,
        handleSearch,
        params,
        data,
        results,
        isLoading,
        error,
        isReady,
        mutate
    }
}

export default usePurposeList