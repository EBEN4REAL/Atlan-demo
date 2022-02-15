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
    sourceGuid?: String
    sourceQualifiedName?: String
    destinationAttribute?: String
    destinationValue?: String
    payload?: any
}
interface params {
    assetGuid: String
    assetQf: String
    assetType: String
    terms?: Array<any>
    certificate?: String
    classifications?: Array<String>
}
export function useCreateRequests({
    assetGuid,
    assetQf,
    assetType,
    terms = [],
    certificate = '',
    classifications = [],
}: params) {
    const requests = ref<requestPayload[]>([])
    const constructPayload = () => {
        if (terms?.length) {
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
        }
        if (certificate !== '') {
            requests.value.push({
                requestType: 'attribute',
                approvalType: 'single',
                destinationAttribute: 'certificateStatus',
                id: assetGuid,
                destinationGuid: assetGuid,
                destinationQualifiedName: assetQf,
                destinationValue: certificate,
                entityType: assetType,
                sourceType: 'static',
            })
        }
        if (classifications?.length) {
            classifications.forEach((classification) => {
                requests.value.push({
                    requestType: 'attach_classification',
                    id: assetGuid,
                    approvalType: 'single',
                    sourceType: 'atlas',
                    entityType: assetType,
                    destinationGuid: assetGuid,
                    destinationQualifiedName: assetQf,
                    payload: {
                        typeName: classification?.typeName,
                        propagate: classification?.propagate,
                        removePropagationsOnEntityDelete: false,
                        validityPeriods: [],
                    },
                })
            })
        }
        console.log(requests.value)
    }
    constructPayload()
    const { data, mutate, error, isLoading, isValidating, isReady } =
        createBulkRequest({
            requests: requests?.value,
        })

    return { response: data, error, isLoading, mutate, isReady }
}
