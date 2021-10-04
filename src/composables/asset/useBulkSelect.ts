import { ref, Ref, watch, computed, ComputedRef } from 'vue'
import { useAPIAsyncState } from '~/api/useAPI'
import { KeyMaps } from '~/api/keyMap'
import whoami from '../user/whoami'
import { assetInterface } from '~/types/assets/asset.interface'
import useBulkSelectOwners from '~/composables/asset/useBulkSelectOwners'

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
                assetStatusMap[asset.guid] =
                    asset?.attributes?.assetStatus ?? 'is_null'
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

    // Helper function
    const getBulkUpdateRequestPayload = (assetList) => {
        const requestPayloadSkeleton = assetList.map((asset) => ({
            guid: asset.guid,
            typeName: asset.typeName,
            attributes: {
                qualifiedName: asset?.attributes?.qualifiedName,
                name: asset?.attributes?.name,
                tenantId: asset.attributes?.tenantId,
                assetStatusMessage: asset.attributes?.assetStatusMessage,
                assetStatus: asset.attributes?.assetStatus,
            },
        }))
        let requestPayloadAssetList = []
        if (updatedStatus.value || updatedStatusMessage.value) {
            requestPayloadAssetList = requestPayloadSkeleton.map((asset) => {
                const updatedAsset = { ...asset }
                updatedAsset.attributes.assetStatus =
                    updatedStatus.value || updatedAsset.attributes.assetStatus
                updatedAsset.attributes.assetStatusMessage =
                    updatedStatus.value ||
                    updatedAsset.attributes.assetStatusMessage
                updatedAsset.attributes.assetStatusUpdatedAt = Date.now()
                updatedAsset.attributes.assetStatusUpdatedBy = username.value
                return updatedAsset
            })
        }
        // Add flow for updating asset status message
        // Add flow for updating owners
        return { entities: requestPayloadAssetList }
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
                            // eslint-disable-next-line no-param-reassign
                            asset.attributes.assetStatus = updatedStatus.value
                            // eslint-disable-next-line no-param-reassign
                            asset.attributes.assetStatusMessage =
                                updatedStatus.value
                            // eslint-disable-next-line no-param-reassign
                            asset.attributes.assetStatusUpdatedAt = Date.now()
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
            updatedClassifications.value &&
            Object.keys(updatedClassifications.value).length
        ) {
            // call to link classifications endpoint
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
    }
}
