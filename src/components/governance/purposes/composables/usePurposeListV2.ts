import { ref, watch } from 'vue'
import usePurposeService from './usePurposeService'

const usePurposeList = (params, options) => {
    const { list } = usePurposeService()

    const {
        data,
        isLoading,
        error,
        isReady,
        mutate
    } = list(params, options)


    const results = ref([])



    watch([data, isLoading], () => {
        if (data.value?.records)
            results.value = data.value.records
    })



    return {
        data,
        results,
        isLoading,
        error,
        isReady,
        mutate
    }
}

export default usePurposeList