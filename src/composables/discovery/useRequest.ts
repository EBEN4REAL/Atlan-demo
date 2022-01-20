
import { computed } from 'vue'
import { getRequests } from '~/services/service/requests'

export function useRequest(guid) {
     const params = computed(() => ({
        limit: 100,
        filter: { destinationGuid: guid, status: 'active'},
    }))
    const { data, mutate, error, isLoading, isValidating } = getRequests(params)
    return {
      data, mutate, error, isLoading, isValidating
    }
}