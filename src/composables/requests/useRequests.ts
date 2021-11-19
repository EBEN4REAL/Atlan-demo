import { getRequests, actOnRequest } from '~/services/service/requests'
import { Ref, computed, watch } from 'vue'
import { RequestStatus } from '~/types/atlas/requests'
import { useDebounceFn } from '@vueuse/core'

export interface RequestListFilters {
    status: RequestStatus
}

function generateRequestListParams(
    searchTerm: String,
    filters: RequestListFilters
) {
    const params: Record<string, any> = {}
    if (searchTerm) {
        params['$or'] = [
            { destination_qualified_name: { $ilike: `%${searchTerm}%` } },
        ]
    }
    for (const [key, value] of Object.entries(filters)) {
        if (value?.length ?? value)
            // Check if the value is valid or the length in case of array
            params[key] = Array.isArray(value) ? { $in: value } : value
    }
    return { filter: params }
}

export function useRequestList(
    searchTerm: Ref<String>,
    filters: Ref<RequestListFilters>
) {
    let params = computed(() =>
        generateRequestListParams(searchTerm.value, filters.value)
    )
    // const { response, error, mutate, isLoading } = getRequests(params)
    const { data, mutate, error, isLoading, isValidating } =
        getRequests<T>(params)
    console.log(data, error)

    const debouncedMutation = useDebounceFn(() => {
        console.log(searchTerm)
        mutate()
    }, 400)

    watch([filters, searchTerm], debouncedMutation, {
        flush: 'post',
        deep: true,
    })

    return { response: data, error, isLoading }
}

export function approveRequest(id: string, message?: string) {
    return actOnRequest(id, {
        action: 'approved',
        message,
    })
}

export function declineRequest(id: string, message?: string) {
    return actOnRequest(id, {
        action: 'rejected',
        message,
    })
}
