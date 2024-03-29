import { Ref, computed, watch, ref } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { getRequests, actOnRequest } from '~/services/service/requests'
import { RequestStatus } from '~/types/atlas/requests'
import useAddEvent from '~/composables/eventTracking/useAddEvent'
import whoami from '~/composables/user/whoami'
import { useAuthStore } from '~/store/auth'
import { RequestAttributes } from '~/types/atlas/requests'

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
    console.log(filters)
    for (const [key, value] of Object.entries(filters)) {
        if (value?.length ?? value)
            // Check if the value is valid or the length in case of array
            filter[key] =
                Array.isArray(value) && key !== '$or' ? { $in: value } : value
    }
    const payload = { $and: [{ isDuplicate: false }] }
    if (Object.keys(filter)?.length) {
        payload.$and.push({
            ...filter,
        })
    }

    return payload
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
        if (searchTerm.value) useAddEvent('governance', 'requests', 'searched')
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

export function handleAccessForRequestAction(request: RequestAttributes) {
    let hasAccess = false
    const { username, groups, user } = whoami()

    const approverGroups = request?.requestApproverGroups || []
    const approverUsers = request?.requestApproverUsers || []
    const approverRoles = request?.requestApproverRoles || []

    const authStore = useAuthStore()

    const rolesArray = authStore?.roles?.map((el) => el?.id)
    const decentralizedRolesArray = authStore?.decentralizedRoles?.map(
        (el) => el?.roleId
    )

    approverGroups.forEach((el) => {
        if (groups.value?.includes(el)) hasAccess = true
    })

    if (approverUsers.includes(username.value)) hasAccess = true

    approverRoles.forEach((el) => {
        if (rolesArray?.includes(el)) hasAccess = true
        decentralizedRolesArray?.forEach((i) => {
            if (el?.includes(i)) hasAccess = true
        })
    })
    return { hasAccess }
}
