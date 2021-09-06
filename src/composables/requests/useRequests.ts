import { getRequests, actOnRequest } from '~/api/heracles/requests'
import { IRequestActionBody } from '~/types/atlas/requests'
import { AsyncStateOptions } from '@vueuse/core'
import { Ref } from 'vue'

export function useRequestList(searchTerm: Ref<String>) {
    const { response, error } = getRequests()
    return { response, error }
}

// Change it to use some inbuilt request object
export function takeAction(
    requestId: string,
    body: Ref<IRequestActionBody> | IRequestActionBody,
    options?: AsyncStateOptions
) {
    return actOnRequest(requestId, body, options)
}
