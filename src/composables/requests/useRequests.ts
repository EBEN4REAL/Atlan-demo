import { Ref, computed, watch, ref } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { getRequests, actOnRequest } from '~/services/service/requests'
import { RequestStatus } from '~/types/atlas/requests'
import useAddEvent from '~/composables/eventTracking/useAddEvent'

export interface RequestListFilters {
    status: RequestStatus
}

function generateRequestListFilters(
    searchTerm: String,
    filters: RequestListFilters
) {
    const filter: Record<string, any> = {}
    if (searchTerm) {
        filter.$or = [
            { destinationQualifiedName: { $ilike: `%${searchTerm}%` } },
        ]
    }
    for (const [key, value] of Object.entries(filters)) {
        if (value?.length ?? value)
            // Check if the value is valid or the length in case of array
            filter[key] = (Array.isArray(value) && key !== '$or') ? { $in: value } : value
    }
    return filter
}

export function useRequestList(
    searchTerm: Ref<String>,
    filters: Ref<RequestListFilters>,
    pagination: Ref
) {
    const params = computed(() => ({
        limit: pagination.value.limit,
        offset: pagination.value.offset,
        filter: generateRequestListFilters(searchTerm.value, filters.value),
        sort: '-createdAt',
    }))
    // const { response, error, mutate, isLoading } = getRequests(params)
    const { data, mutate, error, isLoading, isValidating } = getRequests(params)

    const debouncedMutation = useDebounceFn(() => {
        mutate()
        useAddEvent('governance', 'requests', 'searched')
    }, 400)

    watch([filters, searchTerm], debouncedMutation, {
        flush: 'post',
        deep: true,
    })

    return { response: data, error, isLoading, mutate }
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
