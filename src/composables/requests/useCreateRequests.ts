import { Ref, computed, watch, ref } from 'vue'
import { createBulkRequest } from '~/services/service/requests'
import { useDebounceFn } from '@vueuse/core'
import { message } from 'ant-design-vue'
import useAddEvent from '~/composables/eventTracking/useAddEvent'

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
    requestType?: String
    terms?: Array<any>
    certificate?: String
    classifications?: Array<String>
    userDescription?: String
    ownerUsers?: Array<any>
    ownerGroups?: Array<any>
}
interface eventPayload {
    request_type: String
    asset_type: String
    count: Number
}
export function useCreateRequests({
    assetGuid,
    assetQf,
    assetType,
    requestType,
    terms = [],
    certificate = '',
    classifications = [],
    userDescription = '',
    ownerUsers = [],
    ownerGroups = [],
}: params) {
    const requests = ref<requestPayload[]>([])
    const eventPayload = ref<eventPayload>({
        request_type: 'attribute',
        asset_type: assetType,
        count: 0,
    })
    const constructPayload = () => {
        if (terms?.length) {
            eventPayload.value.request_type = 'term_link'
            eventPayload.value.count = terms?.length ?? 0

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
            eventPayload.value.request_type = 'certificate_update'
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
            eventPayload.value.request_type = 'attach_classification'
            eventPayload.value.count = classifications?.length
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
        if (requestType === 'userDescription') {
            eventPayload.value.request_type = 'description_update'
            requests.value.push({
                requestType: 'attribute',
                approvalType: 'single',
                destinationAttribute: 'userDescription',
                id: assetGuid,
                destinationGuid: assetGuid,
                destinationQualifiedName: assetQf,
                destinationValue: userDescription,
                entityType: assetType,
                sourceType: 'static',
            })
        }
        if (requestType === 'ownerUsers') {
            eventPayload.value.request_type = 'ownerUsers_update'
            if (ownerUsers?.length) {
                ownerUsers.forEach((el) => {
                    requests.value.push({
                        requestType: 'attribute',
                        approvalType: 'single',
                        destinationAttribute: 'ownerUsers',
                        id: assetGuid,
                        destinationGuid: assetGuid,
                        destinationQualifiedName: assetQf,
                        destinationValue: el,
                        entityType: assetType,
                        sourceType: 'static',
                    })
                })
            }
            if (ownerGroups.length) {
                eventPayload.value.request_type = 'ownerGroups_update'
                ownerGroups.forEach((el) => {
                    requests.value.push({
                        requestType: 'attribute',
                        approvalType: 'single',
                        destinationAttribute: 'ownerGroups',
                        id: assetGuid,
                        destinationGuid: assetGuid,
                        destinationQualifiedName: assetQf,
                        destinationValue: el,
                        entityType: assetType,
                        sourceType: 'static',
                    })
                })
            }
        }
        console.log(requests.value)
    }
    constructPayload()
    if (!requests.value?.length) {
        message.error(`Empty request!`)
        return
    }
    const { data, mutate, error, isLoading, isValidating, isReady } =
        createBulkRequest({
            requests: requests?.value,
        })

    watch(isReady, () => {
        if (isReady.value) {
            useAddEvent('governance', 'requests', 'created', eventPayload.value)
        }
    })
    return { response: data, error, isLoading, mutate, isReady }
}
