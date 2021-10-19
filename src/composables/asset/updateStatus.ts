import { computed, ref, WritableComputedRef, watch, Ref } from 'vue'
import updateAsset from '../utils/updateAsset'
import whoami from '../user/whoami'
import { assetInterface } from '~/types/assets/asset.interface'

export default function updateAssetStatus(selectedAsset: Ref<assetInterface>) {
    const { username } = whoami()
    const certificateStatus: { [key: string]: any } = ref({})
    const isCompleted = ref(false)
    const isLoading = ref(false)
    const body: { [key: string]: any } = ref({})

    const statusId: WritableComputedRef<string> = computed({
        get: () =>
            selectedAsset.value?.attributes?.certificateStatus ||
            'is_null'
        ,
        set: (newValue: string) => {
            certificateStatus.value.id = newValue
            body.value = getBody()
        },
    })
    const statusMessage: WritableComputedRef<string> = computed({
        get: () => selectedAsset.value?.attributes?.assetStatusMessage,
        set: (newValue: string) => {
            certificateStatus.value.message = newValue
            body.value = getBody()
        },
    })

    const getBody = () => ({
        entities: [
            {
                guid: selectedAsset.value.guid,
                typeName: selectedAsset.value.typeName,
                attributes: {
                    qualifiedName:
                        selectedAsset.value.attributes?.qualifiedName,
                    name: selectedAsset.value.attributes?.name,
                    certificateStatus: certificateStatus.value.id,
                    assetStatusMessage: certificateStatus.value.message,
                    certificateUpdatedAt: Date.now(),
                    certificateUpdatedBy: username,
                    tenantId: selectedAsset.value.attributes?.tenantId,
                    anchor: selectedAsset.value.attributes?.anchor,
                },
            },
        ],
    })

    const update = () => {
        isLoading.value = true
        execute()
    }

    const { state, execute, isReady, error } = updateAsset(body, {
        immediate: false,
        resetOnExecute: true,
    })

    watch(isReady, () => {
        if (!error.value && state && isReady.value) {
            isLoading.value = false
            isCompleted.value = false
            selectedAsset.value.attributes.certificateStatus =
                certificateStatus.value.id
            selectedAsset.value.attributes.assetStatusMessage =
                certificateStatus.value.message
            selectedAsset.value.attributes.certificateUpdatedAt = Date.now()
            selectedAsset.value.attributes.certificateUpdatedBy =
                username as unknown as string
            selectedAsset.value.attributes.__modifiedBy =
                username as unknown as string
            selectedAsset.value.attributes.__modificationTimestamp = Date.now()
        }
    })

    const handleCancel = () => {
        isCompleted.value = false
        isLoading.value = false
    }

    return {
        handleCancel,
        statusId,
        statusMessage,
        state,
        update,
        isReady,
        error,
        isCompleted,
        isLoading,
    }
}
