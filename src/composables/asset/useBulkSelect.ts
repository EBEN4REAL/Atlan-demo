import { ref, Ref, watch } from 'vue'
import { useAPIAsyncState } from '~/api/useAPI'
import { KeyMaps } from '~/api/keyMap'
import whoami from '../user/whoami'
import { assetInterface } from '~/types/assets/asset.interface'
import useBulkSelectStatus from '~/composables/asset/useBulkSelectStatus'
import useBulkSelectOwners from '~/composables/asset/useBulkSelectOwners'
import useBulkSelectClassifications from './useBulkSelectClassifications'
import useBulkSelectTerms from './useBulkSelectTerms'
import useBulkUpdateStore from '~/store/bulkUpdate'
import { Components } from '~/api/atlas/client'

export interface LocalState {
    all: Components.Schemas.AtlasClassification[]
    partial: Components.Schemas.AtlasClassification[]
    removed: Components.Schemas.AtlasClassification[]
}

export default function useBulkSelect() {
    const selectedAssets: Ref<assetInterface[]> = ref([])
    const state: Ref<Record<string, string>> = ref({
        updateStatusOwners: '',
        linkClassifications: '',
        linkTerms: '',
    })
    const { username } = whoami()
    const store = useBulkUpdateStore()

    /** STATUS */
    const {
        updatedStatus,
        updatedStatusMessage,
        publishedChangeLog: publishedStatusChangeLog,
        didStatusUpdate,
        existingStatus,
        handleUpdateStatus,
    } = useBulkSelectStatus(selectedAssets)

    const updateSelectedAssets = (list: Ref<assetInterface[]>) => {
        selectedAssets.value = [...list.value]
    }

    /** OWNERS */
    const {
        updatedOwners,
        ownerUsersFrequencyMap,
        ownerGroupsFrequencyMap,
        existingOwnerUsers,
        existingOwnerGroups,
        handleUpdateOwners,
    } = useBulkSelectOwners(selectedAssets)

    /** CLASSIFICATIONS */
    const {
        classifications,
        resetClassifications,
        initialiseLocalState,
        originalClassifications,
        updateClassifications,
        classificationFrequencyMap,
        publishedChangeLog: publishedClassificationChangeLog,
        didClassificationsUpdate,
    } = useBulkSelectClassifications(selectedAssets)

    /** TERMS */
    const {
        terms,
        resetTerms,
        initialiseLocalState: initialiseLocalStateTerms,
        originalTerms,
        updateTerms,
        termFrequencyMap,
    } = useBulkSelectTerms(selectedAssets)

    /**  HELPER FUNCTIONS */
    const getBulkUpdateRequestPayload = (assetList) => {
        const requestPayloadSkeleton = assetList.map((asset) => {
            const payloadObj = {
                guid: asset.guid,
                typeName: asset.typeName,
                attributes: {
                    qualifiedName: asset?.attributes?.qualifiedName,
                    name: asset?.attributes?.name,
                    tenantId: asset.attributes?.tenantId,
                    assetStatusMessage: asset.attributes?.assetStatusMessage,
                    assetStatus: asset.attributes?.assetStatus,
                },
            }
            // parent glossary guid is mandatory for gtc updation
            if (
                asset?.typeName === 'AtlasGlossaryCategory' ||
                asset?.typeName === 'AtlasGlossaryTerm'
            ) {
                payloadObj.attributes.anchor = {
                    guid: asset?.attributes?.anchor?.guid,
                }
            }

            return payloadObj
        })
        let requestPayloadAssetList = []

        requestPayloadAssetList = requestPayloadSkeleton.map((asset) => {
            const updatedAsset = { ...asset }
            // Update status
            if (didStatusUpdate.value) {
                if (updatedStatus && updatedStatus.value)
                    updatedAsset.attributes.assetStatus =
                        updatedStatus.value ||
                        updatedAsset.attributes.assetStatus
                if (updatedStatusMessage && updatedStatusMessage.value)
                    updatedAsset.attributes.assetStatusMessage =
                        updatedStatusMessage.value ||
                        updatedAsset.attributes.assetStatusMessage
                updatedAsset.attributes.assetStatusUpdatedAt = Date.now()
                updatedAsset.attributes.assetStatusUpdatedBy = username.value
            }
            // Update owners
            const didOwnerUsersChange =
                updatedOwners.value?.addedOwnerUsers?.length ||
                updatedOwners.value?.removedOwnerUsers?.length

            // if updated properties are empty, it means that attribute didn't change
            const didOwnerGroupsChange =
                updatedOwners.value?.addedOwnerGroups?.length ||
                updatedOwners.value?.removedOwnerGroups?.length
            if (didOwnerUsersChange || didOwnerGroupsChange) {
                if (didOwnerUsersChange)
                    updatedAsset.attributes.ownerUsers =
                        existingOwnerUsers.value[asset.guid]
                if (didOwnerGroupsChange)
                    updatedAsset.attributes.ownerGroups =
                        existingOwnerGroups.value[asset.guid]
            }
            return updatedAsset
        })
        // Add flow for updating asset status message
        return { entities: requestPayloadAssetList }
    }
    const getBulkClassificationUpdateRequestPayload = (assetList) => {
        const requestPayload = {}
        assetList.forEach((asset) => {
            // TODO:Add option for propagate and removePropagationsOnEntityDelete
            const assetClassifications = classifications.value?.[
                asset.guid
            ].map((clsf) => ({
                typeName: clsf.typeName,
                attributes: {},
                propagate: false,
                removePropagationsOnEntityDelete: false,
            }))

            requestPayload[asset.guid] = {
                typeName: asset.typeName,
                attributes: {
                    qualifiedName: asset?.attributes?.qualifiedName,
                },
                classifications: assetClassifications,
            }
        })
        return { guidHeaderMap: requestPayload }
    }
    const getBulkTermUpdateRequestPayload = (assetList) => {
        // for removing, if assets.meanings don't have the term, skip remove API call for that -> to come later
        const requestPayload = {}
        const requestPayloadLocal = {}
        // a local mapping for quick reference of termDisplayText as well as guid, because we only send guid in the API but we need displayText for updating the asset locally once the API call is successful
        assetList.forEach((asset) => {
            const termsList = terms?.value?.[asset.guid] ?? []
            // if asset.meanings have term, don't add asset to payload
            // because this is an add API and not update API, we need to send only newly added terms
            const filteredTermsList = termsList?.filter(
                (term) =>
                    asset?.meanings.findIndex(
                        (assetTerm) =>
                            assetTerm.termGuid === (term.guid || term.termGuid)
                    ) === -1
            )
            filteredTermsList.forEach((term) => {
                if (requestPayload.hasOwnProperty(term.guid || term.termGuid)) {
                    requestPayload[term.guid || term.termGuid].push({
                        guid: asset.guid,
                    })
                    requestPayloadLocal[term.guid || term.termGuid].termInfo = {
                        displayText: term.displayText,
                    }
                    requestPayloadLocal[
                        term.guid || term.termGuid
                    ].entities.push({
                        guid: asset.guid,
                    })
                } else {
                    requestPayload[term.guid || term.termGuid] = [
                        { guid: asset.guid },
                    ]
                    requestPayloadLocal[term.guid || term.termGuid] = {
                        termInfo: {},
                        entities: [],
                    }
                    requestPayloadLocal[term.guid || term.termGuid].termInfo = {
                        displayText: term.displayText,
                    }
                    requestPayloadLocal[term.guid || term.termGuid].entities = [
                        { guid: asset.guid },
                    ]
                }
            })
        })
        return { requestPayload, requestPayloadLocal }
    }
    /**  MAIN UPDATE FUNCTION */
    const updateAssets = (assetList) => {
        // status and owners update can be done in a single call using bulk endpoint
        if (
            didStatusUpdate ||
            (updatedOwners.value && Object.keys(updatedOwners.value).length)
        ) {
            // call to bulk endpoint
            const requestPayload = getBulkUpdateRequestPayload(assetList)
            let updateStatusOwners = {
                status: 'loading',
                changeLog: {},
                didChange: true,
            }
            store.setUpdateStatus({ ...store.updateStatus, updateStatusOwners })
            const { data, error, isLoading } = useAPIAsyncState<any>(
                KeyMaps.asset.BULK_UPDATE_ASSETS,
                'POST',
                { body: requestPayload },
                { immediate: true, resetOnExecute: false }
            )
            watch([data, error, isLoading], () => {
                if (isLoading.value === false) {
                    if (error.value === undefined) {
                        assetList.forEach((asset) => {
                            const updatedAttributes =
                                requestPayload.entities.find(
                                    (entity) => entity.guid === asset.guid
                                )?.attributes
                            // eslint-disable-next-line no-param-reassign
                            asset.attributes = {
                                ...asset.attributes,
                                ...(updatedAttributes || {}),
                            }
                        })
                        updateStatusOwners = {
                            status: 'success',
                            changeLog: {},
                            didChange: true,
                        }
                        store.setUpdateStatus({
                            ...store.updateStatus,
                            updateStatusOwners,
                        })
                        // state.value.updateStatusOwners = 'success'
                    } else {
                        updateStatusOwners = {
                            status: 'error',
                            changeLog: {},
                            didChange: true,
                        }
                        store.setUpdateStatus({
                            ...store.updateStatus,
                            updateStatusOwners,
                        })
                        // state.value.updateStatusOwners = 'error'
                    }
                }
            })
        }
        if (terms.value && Object.keys(terms.value).length) {
            // call to link terms endpoint
            const { requestPayload, requestPayloadLocal } =
                getBulkTermUpdateRequestPayload(assetList)
            // below is the check to see if terms changed, if requestPayload has no keys that means there are no NEW terms to link and we need not make the request
            if (Object.keys(requestPayload).length) {
                // TOFO: add changelog
                const linkTerms = {
                    status: 'loading',
                    didChange: true,
                    changeLog: {},
                }
                store.setUpdateStatus({ ...store.updateStatus, linkTerms })
                const { data, error, isLoading } = useAPIAsyncState<any>(
                    KeyMaps.glossary.BULK_LINK_TERMS,
                    'POST',
                    { body: requestPayload },
                    { immediate: true, resetOnExecute: false }
                )
                watch([data, error, isLoading], () => {
                    if (isLoading.value === false) {
                        if (error.value === undefined) {
                            assetList.forEach((asset) => {
                                const newTerms = []
                                Object.keys(requestPayload).forEach(
                                    (termGuid) => {
                                        newTerms.push({
                                            termGuid,
                                            displayText:
                                                requestPayloadLocal?.termGuid
                                                    ?.termInfo?.displayText,
                                        })
                                    }
                                )
                                asset.meanings = [
                                    ...asset?.meanings,
                                    ...newTerms,
                                ]
                                const linkTerms = {
                                    status: 'success',
                                    didChange: true,
                                    changeLog: {},
                                }
                                store.setUpdateStatus({
                                    ...store.updateStatus,
                                    linkTerms,
                                })
                            })
                        } else {
                            const linkTerms = {
                                status: 'error',
                                didChange: true,
                                changeLog: {},
                            }
                            store.setUpdateStatus({
                                ...store.updateStatus,
                                linkTerms,
                            })
                        }
                    }
                })
            }
        }
        if (
            didClassificationsUpdate.value &&
            classifications.value &&
            Object.keys(classifications.value).length
        ) {
            // call to link classifications endpoint
            const requestPayload =
                getBulkClassificationUpdateRequestPayload(assetList)
            let linkClassifications = {
                status: 'loading',
                didChange: didClassificationsUpdate.value,
                changeLog: { ...publishedClassificationChangeLog.value },
            }
            store.setUpdateStatus({
                ...store.updateStatus,
                linkClassifications,
            })
            const { data, error, isLoading } = useAPIAsyncState<any>(
                KeyMaps.classification.BULK_LINK_CLASSIFICATION,
                'POST',
                { body: requestPayload },
                { immediate: true, resetOnExecute: false }
            )
            watch([data, error, isLoading], () => {
                if (isLoading.value === false) {
                    if (error.value === undefined) {
                        assetList.forEach((asset) => {
                            const updatedClassificationsLocal =
                                requestPayload.guidHeaderMap[asset.guid]
                            // eslint-disable-next-line no-param-reassign
                            asset.classifications = {
                                ...updatedClassificationsLocal?.classifications,
                            }
                        })
                        linkClassifications = {
                            status: 'success',
                            didChange: didClassificationsUpdate.value,
                            changeLog: {
                                ...publishedClassificationChangeLog.value,
                            },
                        }
                        store.setUpdateStatus({
                            ...store.updateStatus,
                            linkClassifications,
                        })
                    } else {
                        linkClassifications = {
                            status: 'error',
                            didChange: didClassificationsUpdate.value,
                            changeLog: {
                                ...publishedClassificationChangeLog.value,
                            },
                        }
                        store.setUpdateStatus({
                            ...store.updateStatus,
                            linkClassifications,
                        })
                    }
                }
            })
            // store.setBulkMode(false)
            // store.setShowNotifcation(true)
        }
    }
    /** WATCHERS */

    // Handles making notification toast visible; other part i.e to make it go away is handled in bulkNotification component itself
    // This logic is split because the watcher below hides the bulkSidebar component and hence this composable instance is destroyed - so the part of watcher that listens to success/error state of the API call doesn't execute - hence we have moved that part to the notification component which takes care of hiding itself once the api calls are completed
    watch(
        () => store.updateStatus,
        () => {
            if (store.getFinalStatus === 'loading') {
                store.setShowNotifcation(true)
                // to get out of the bulk mode once user clicks on make changes
                store.setBulkMode(false)
            }
        }
    )

    return {
        updateSelectedAssets,
        existingStatus,
        updatedStatus,
        updatedStatusMessage,
        handleUpdateStatus,
        publishedStatusChangeLog,
        ownerUsersFrequencyMap,
        ownerGroupsFrequencyMap,
        existingOwnerUsers,
        existingOwnerGroups,
        updatedOwners,
        handleUpdateOwners,
        updateAssets,
        classifications,
        resetClassifications,
        initialiseLocalState,
        originalClassifications,
        updateClassifications,
        classificationFrequencyMap,
        publishedClassificationChangeLog,
        terms,
        resetTerms,
        initialiseLocalStateTerms,
        originalTerms,
        updateTerms,
        termFrequencyMap,
        state,
    }
}
