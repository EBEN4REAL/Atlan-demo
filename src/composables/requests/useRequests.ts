import { getRequests, actOnRequest } from '~/api/heracles/requests'
import { Ref, computed, watch } from 'vue'
import { RequestStatus } from '~/types/atlas/requests'

export interface RequestListFilters {
    status: RequestStatus[]
}

function generateRequestListParams(filters: RequestListFilters) {
    const params: Record<string, any> = {}
    for (const [key, value] of Object.entries(filters)) {
        params[key] = Array.isArray(value) ? { $in: value } : { $eq: value }
    }
    return { filter: params }
}

export function useRequestList(
    searchTerm: Ref<String>,
    filters: Ref<RequestListFilters>
) {
    // TODO: Call API when seachterm changes with debounce

    let params = computed(() => generateRequestListParams(filters.value))
    const { response, error, mutate, isLoading } = getRequests(params)

    watch(
        filters,
        () => {
            mutate()
        },
        { flush: 'post' }
    )

    return { response, error, isLoading }
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
