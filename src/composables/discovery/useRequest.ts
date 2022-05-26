import { computed, Ref, watch } from 'vue'
import { getRequests } from '~/services/service/requests'
import useAddEvent from '~/composables/eventTracking/useAddEvent'

export function useRequest(
    guid,
    qfName,
    pagination: Ref,
    type,
    filterStatus = { value: {} }
) {
    let payloadFilter = {}
    if (type === 'Table') {
        payloadFilter = {
            $or: [
                { destinationGuid: guid },
                {
                    destinationQualifiedName: {
                        $like: `${qfName}%`,
                    },
                },
            ],
        }
    } else if (type === 'AtlasGlossary') {
        payloadFilter = {
            $or: [
                { sourceGuid: guid },
                { destinationGuid: guid },
                {
                    destinationQualifiedName: {
                        $like: `%${qfName}`,
                    },
                },
            ],
        }
    } else if (type === 'AtlasGlossaryTerm') {
        payloadFilter = {
            $or: [{ sourceGuid: guid }, { destinationGuid: guid }],
        }
    } else {
        payloadFilter = {
            destinationGuid: guid,
        }
    }
    const filterType =
        type === 'AtlasGlossaryTerm' ? 'sourceGuid' : 'destinationGuid'
    const params = computed(() => {
        const temp = {
            sort: '-createdAt',
            limit: pagination.value.limit,
            offset: pagination.value.offset,
            filter: { $and: [payloadFilter] },
        }
        if (Object.keys(filterStatus.value)?.length)
            temp.filter.$and.push({ ...filterStatus.value })
        return temp
    })
    const { data, mutate, error, isLoading, isValidating } = getRequests(params)
    watch(
        pagination,
        () => {
            mutate()
            useAddEvent('governance', 'requests', 'searched')
        },
        {
            flush: 'post',
            deep: true,
        }
    )
    return {
        data,
        mutate,
        error,
        isLoading,
        isValidating,
    }
}
