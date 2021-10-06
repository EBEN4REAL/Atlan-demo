import { ref, Ref, watch, computed, ComputedRef } from 'vue'
import { useAPIAsyncState } from '~/api/useAPI'
import { KeyMaps } from '~/api/keyMap'
import whoami from '../user/whoami'
import { assetInterface } from '~/types/assets/asset.interface'
import useBulkSelectOwners from '~/composables/asset/useBulkSelectOwners'
import useBulkSelectClassifications from './useBulkSelectClassifications'

export default function useBulkSelect() {
    const selectedAssets: Ref<assetInterface[]> = ref([])
    const { username } = whoami()
    // state of the composable
    // `Existing` properties are computed for all selected lists and passed to the component for initialisation of respective state of each component (ex- status, owners)
    // `Updated` properties are refs, used to maintain a local copy of what changed - instead of calculating diffs bw existing properties whenever it changes/ for storing existing state in case the user tries to reset, we simply store the changed value in updated properties and use that for constructing the payload and locally updating the assets once the call is successful
    const updatedStatus: Ref<string> = ref('')
    const updatedStatusMessage: Ref<string> = ref('')
    const updatedTerms: Ref<Record<string, string>> = ref({})
    const updatedClassifications: Ref<Record<string, string>> = ref({})
    /** STATUS */
    const updateSelectedAssets = (list: Ref<assetInterface[]>) => {
        selectedAssets.value = [...list.value]
    }
    watch(selectedAssets, () => {
        console.log('OOO', selectedAssets.value)
    })
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
    // Helper function
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
    const updateAssets = (assetList) => {
        // status and owners update can be done in a single call using bulk endpoint
        if (
            updatedStatus.value ||
            (updatedOwners.value && Object.keys(updatedOwners.value).length)
        ) {
            // call to bulk endpoint
            const requestPayload = getBulkUpdateRequestPayload(assetList)
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
                        // } else {
                        //     message.error({
                        //         content: `Bulk update failed, please try again.`,
                        //     })
                        // }
                    }
                }
            })
        }
        if (updatedTerms.value && Object.keys(updatedTerms.value).length) {
            // call to link terms endpoint
        }
        if (
            classifications.value &&
            Object.keys(classifications.value).length
        ) {
            // call to link classifications endpoint
            const requestPayload =
                getBulkClassificationUpdateRequestPayload(assetList)
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
                        // } else {
                        //     message.error({
                        //         content: `Bulk update failed, please try again.`,
                        //     })
                        // }
                    }
                }
            })
        }
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
    }
}
