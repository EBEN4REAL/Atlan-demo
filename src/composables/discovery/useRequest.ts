
import { computed, Ref, watch } from 'vue'
import { getRequests } from '~/services/service/requests'
import useAddEvent from '~/composables/eventTracking/useAddEvent'

export function useRequest(guid,  pagination: Ref, type, filterStatus = {value: {}}) {
    const payloadFilter = type === 'AtlasGlossaryTerm' || type === 'AtlasGlossary'? {
        '$or': [{sourceGuid: guid}, {destinationGuid: guid}]
    } : {
        destinationGuid: guid,
    }
    //  const filterType = type === 'AtlasGlossaryTerm' ? 'sourceGuid' :'destinationGuid'
     const params = computed(() => ({
        sort: '-createdAt',
        limit: pagination.value.limit,
        offset: pagination.value.offset,
        filter: {"$and": [filterStatus.value, payloadFilter]}, 
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
