
import { computed, Ref, watch } from 'vue'
import { getRequests } from '~/services/service/requests'
import useAddEvent from '~/composables/eventTracking/useAddEvent'

export function useRequest(guid,  pagination: Ref) {
     const params = computed(() => ({
        limit: pagination.value.limit,
        offset: pagination.value.offset,
        filter: { destinationGuid: guid, status: 'active'},
    }))
    const { data, mutate, error, isLoading, isValidating } = getRequests(params)
    watch(pagination, () => {
        mutate()
        useAddEvent('governance', 'requests', 'searched')
    }, {
        flush: 'post',
        deep: true,
    })
    return {
      data, mutate, error, isLoading, isValidating
    }
}