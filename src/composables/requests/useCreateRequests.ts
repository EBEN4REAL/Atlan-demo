import { Ref, computed, watch, ref } from 'vue'
import { createBulkRequest } from '~/services/service/requests'
import { useDebounceFn } from '@vueuse/core'
import { message } from 'ant-design-vue'
import useAddEvent from '~/composables/eventTracking/useAddEvent'

interface requestPayload {
    requestType: String
    approvalType?: String
    entityType?: String
    id?: String
    sourceType?: String
    destinationQualifiedName?: String
    destinationGuid?: String
    sourceGuid?: String
    sourceQualifiedName?: String
    destinationAttribute?: String
    destinationValue?: String
    payload?: any
}
interface params {
    assetGuid?: String
    assetQf?: String
    assetType?: String
    requestType?: String
    terms?: Array<any>
    certificate?: String
    classifications?: Array<String>
    userDescription?: String
    ownerUsers?: Array<any>
    ownerGroups?: Array<any>
    glossaryPayload?: any
}
interface eventPayload {
    request_type:
        | 'term'
        | 'userDescription'
        | 'classification'
        | 'certificateStatus'
        | 'ownerUser'
        | 'ownerGroup'
        | ''
    asset_type: String
    count: Number
    action: 'add' | 'remove' | 'edit' | ''
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
    glossaryPayload,
}: params) {
    const requests = ref<requestPayload[]>([])
    const eventPayload = ref<eventPayload>({
        request_type: '',
        asset_type: assetType,
        count: 0,
        action: '',
    })
    const constructPayload = () => {
        if (terms?.length) {
            eventPayload.value.request_type = 'term'
            eventPayload.value.count = terms?.length ?? 0
            eventPayload.value.action = 'add'

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
            eventPayload.value.request_type = 'certificateStatus'
            eventPayload.value.action = 'edit'
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
            eventPayload.value.request_type = 'classification'
            eventPayload.value.action = 'add'
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
            eventPayload.value.request_type = 'userDescription'
            eventPayload.value.action = 'edit'
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
            if (ownerUsers?.length) {
                eventPayload.value.request_type = 'ownerUsers'
                eventPayload.value.action = 'add'
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
                eventPayload.value.request_type = 'ownerGroups'
                eventPayload.value.action = 'add'
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
        if (requestType === 'create_glossary') {
            requests.value.push({
                requestType: 'create_glossary',
                approvalType: 'single',
                entityType: 'Glossary',
                sourceType: 'static',
                id: glossaryPayload?.name,
                payload: glossaryPayload,
            })
        }
        if (requestType === 'create_term') {
            requests.value.push({
                requestType: 'create_term',
                approvalType: 'single',
                entityType: 'AtlasGlossaryTerm',
                sourceType: 'static',
                id: glossaryPayload?.attributes?.name,
                payload: glossaryPayload,
            })
        }
        if (requestType === 'create_category') {
            requests.value.push({
                requestType: 'create_category',
                approvalType: 'single',
                entityType: 'AtlasGlossaryCategory',
                sourceType: 'static',
                id: glossaryPayload?.attributes?.name,
                payload: glossaryPayload,
            })
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
            if (eventPayload.value?.request_type)
                useAddEvent(
                    'governance',
                    'requests',
                    'created',
                    eventPayload.value
                )
        }
    })
    return { response: data, error, isLoading, mutate, isReady }
}
