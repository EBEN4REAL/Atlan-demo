import { ref, Ref, watch, computed, ComputedRef } from 'vue'
import { useAPIPromise, useAPIAsyncState } from '~/api/useAPI'
import { KeyMaps } from '~/api/keyMap'
import whoami from '../user/whoami'
import { assetInterface } from '~/types/assets/asset.interface'
import useBulkSelectOwners from '~/composables/asset/useBulkSelectOwners'
import useBulkSelectClassifications from './useBulkSelectClassifications'
import useBulkSelectTerms from './useBulkSelectTerms'
import useBulkUpdateStore from '~/store/bulkUpdate'

export default function useBulkSelect() {
    const selectedAssets: Ref<assetInterface[]> = ref([])
    const state: Ref<Record<string, string>> = ref({
        updateStatusOwners: '',
        linkClassifications: '',
        linkTerms: '',
    })
    const { username } = whoami()
    // state of the composable
    // `Existing` properties are computed for all selected lists and passed to the component for initialisation of respective state of each component (ex- status, owners)
    // `Updated` properties are refs, used to maintain a local copy of what changed - instead of calculating diffs bw existing properties whenever it changes/ for storing existing state in case the user tries to reset, we simply store the changed value in updated properties and use that for constructing the payload and locally updating the assets once the call is successful
    const store = useBulkUpdateStore()
    const updatedStatus: Ref<string> = ref('')
    const updatedStatusMessage: Ref<string> = ref('')

    /** STATUS */
    const updateSelectedAssets = (list: Ref<assetInterface[]>) => {
        selectedAssets.value = [...list.value]
    }
    const existingStatus = computed(() => {
        if (selectedAssets.value.length) {
            const assetStatusMap: Record<string, string> = {}
            selectedAssets.value.forEach((asset: assetInterface) => {
                assetStatusMap[asset.guid] = asset?.attributes?.assetStatus
                    ? asset.attributes.assetStatus
                    : 'is_null'
            })
            return assetStatusMap
        }
        return {}
    })
    const handleUpdateStatus = (
        { status, statusMessage },
        statusRef,
        existingStatusRef
    ) => {
        Object.keys(existingStatusRef.value).forEach((assetKey) => {
            // eslint-disable-next-line no-param-reassign
            existingStatusRef.value[assetKey] = status
        })
        // eslint-disable-next-line no-param-reassign
        statusRef.value = status
        updatedStatusMessage.value = statusMessage
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
    // Helper functions
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
            if (updatedStatus.value || updatedStatusMessage.value) {
                updatedAsset.attributes.assetStatus =
                    updatedStatus.value || updatedAsset.attributes.assetStatus
                updatedAsset.attributes.assetStatusMessage =
                    updatedStatus.value ||
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

        // if (didOwnerUsersChange || didOwnerGroupsChange) {
        //     requestPayloadAssetList = requestPayloadSkeleton.map((asset) => {
        //         const updatedAsset = { ...asset }

        //         updatedAsset.attributes.ownerUsers =
        //             existingOwnerUsers.value[asset.guid]
        //         return updatedAsset
        //     })
        // }
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
    const updateAssets = (assetList) => {
        // status and owners update can be done in a single call using bulk endpoint
        if (
            updatedStatus.value ||
            (updatedOwners.value && Object.keys(updatedOwners.value).length)
        ) {
            // call to bulk endpoint
            const requestPayload = getBulkUpdateRequestPayload(assetList)
            let updateStatusOwners = { status: 'loading', meta: {} }
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
                        updateStatusOwners = { status: 'success', meta: {} }
                        store.setUpdateStatus({
                            ...store.updateStatus,
                            updateStatusOwners,
                        })
                        // state.value.updateStatusOwners = 'success'
                    } else {
                        updateStatusOwners = { status: 'error', meta: {} }
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
            if (Object.keys(requestPayload).length) {
                let linkTerms = { status: 'loading', meta: {} }
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
                                linkTerms = { status: 'success', meta: {} }
                                store.setUpdateStatus({
                                    ...store.updateStatus,
                                    linkTerms,
                                })
                            })
                        } else {
                            linkTerms = { status: 'error', meta: {} }
                            store.setUpdateStatus({
                                ...store.updateStatus,
                                linkTerms,
                            })
                        }
                    }
                })
            }

            /** FOR ALPHA */
            // const requests = []
            // if (Object.keys(requestPayloadForEachTerm).length) {
            //     Object.keys(requestPayloadForEachTerm).forEach((termGuid) => {
            //         const linkTermPromise = useAPIPromise(
            //             KeyMaps.glossary.ASSIGN_TERM_LINKED_ASSETS({
            //                 termGuid,
            //             }),
            //             'POST',
            //             {
            //                 body: requestPayloadForEachTerm[termGuid],
            //             }
            //         )
            //         requests.push(linkTermPromise)
            //     })
            // }
            // if (requests.length) {
            //     try{
            //         // add loading state
            //         await Promise.all(requests);
            //     }
            //     catch(e){
            //         // handle error
            //     }
        }
        if (
            classifications.value &&
            Object.keys(classifications.value).length
        ) {
            // call to link classifications endpoint
            const requestPayload =
                getBulkClassificationUpdateRequestPayload(assetList)
            let linkClassifications = { status: 'loading', meta: {} }
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
                        linkClassifications = { status: 'success', meta: {} }
                        store.setUpdateStatus({
                            ...store.updateStatus,
                            linkClassifications,
                        })
                    } else {
                        linkClassifications = { status: 'error', meta: {} }
                        store.setUpdateStatus({
                            ...store.updateStatus,
                            linkClassifications,
                        })
                    }
                }
            })
        }

        watch(
            () => store.updateStatus,
            () => {
                if (store.getFinalStatus === 'loading')
                    store.setShowNotifcation(true)
                if (
                    store.getFinalStatus === 'success' ||
                    store.getFinalStatus === 'error'
                )
                    setTimeout(() => {
                        store.setUpdateStatus({
                            updateStatusOwners: { status: '', meta: {} },
                            linkTerms: { status: '', meta: {} },
                            linkClassifications: { status: '', meta: {} },
                        })
                        store.setBulkSelectedAssets([])
                        store.setShowNotifcation(false)
                    }, 4000)
            }
        )
    }

    return {
        updateSelectedAssets,
        existingStatus,
        updatedStatus,
        handleUpdateStatus,
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
        terms,
        resetTerms,
        initialiseLocalStateTerms,
        originalTerms,
        updateTerms,
        termFrequencyMap,
        state,
    }
}
