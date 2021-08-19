import { computed, ref, WritableComputedRef, watch, Ref } from 'vue'
import updateAsset from '../utils/updateAsset'
import whoami from '../user/whoami'
import { assetInterface } from '~/types/assets/asset.interface'

export default function updateAssetStatus(selectedAsset: Ref<assetInterface>) {
    const { username } = whoami()
    const assetStatus: { [key: string]: any } = ref({})
    const isCompleted = ref(false)
    const isLoading = ref(false)
    const body: { [key: string]: any } = ref({})

    const statusId: WritableComputedRef<string> = computed({
        get: () =>
            assetStatus.value.id ||
            selectedAsset.value?.attributes?.assetStatus ||
            'is_null',
        set: (newValue: string) => {
            assetStatus.value.id = newValue
            body.value = getBody()
        },
    })
    const statusMessage: WritableComputedRef<string> = computed({
        get: () => selectedAsset.value?.attributes?.assetStatusMessage,
        set: (newValue: string) => {
            assetStatus.value.message = newValue
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
                    assetStatus: assetStatus.value.id,
                    assetStatusMessage: assetStatus.value.message,
                    assetStatusUpdatedAt: Date.now(),
                    assetStatusUpdatedBy: username,
                    tenantId: selectedAsset.value.attributes?.tenantId,
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
            selectedAsset.value.attributes.assetStatus = assetStatus.value.id
            selectedAsset.value.attributes.assetStatusMessage =
                assetStatus.value.message
            selectedAsset.value.attributes.assetStatusUpdatedAt = Date.now()
            selectedAsset.value.attributes.assetStatusUpdatedBy =
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
