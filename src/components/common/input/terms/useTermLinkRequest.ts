import { Ref, computed, watch, ref } from 'vue'
import { createBulkRequest } from '~/services/service/requests'
import { useDebounceFn } from '@vueuse/core'

interface requestPayload {
    requestType: String
    approvalType: String
    entityType: String
    id: String
    sourceType: String
    destinationQualifiedName: String
    destinationGuid: String
    sourceGuid: String
    sourceQualifiedName: String
}
interface params {
    assetGuid: String
    assetQf: String
    assetType: String
    terms: Array<any>
}
export function useTermLinkRequest({
    assetGuid,
    assetQf,
    assetType,
    terms = [],
}: params) {
    const requests = ref<requestPayload[]>([])
    const constructPayload = () => {
        terms?.forEach((element) => {
            requests.value.push({
                requestType: 'term_link',
                approvalType: 'single',
                entityType: assetType,
                id: assetGuid,
                sourceType: 'atlas',
                destinationQualifiedName: assetQf,
                destinationGuid: assetGuid,
                sourceGuid: element?.guid,
                sourceQualifiedName:
                    element?.uniqueAttributes?.qualifiedName ??
                    element?.attributes?.qualifiedName,
            })
        })
        console.log(requests.value)
    }
    constructPayload()
    const { data, mutate, error, isLoading, isValidating, isReady } =
        createBulkRequest({
            requests: requests?.value,
        })

    return { response: data, error, isLoading, mutate, isReady }
}
