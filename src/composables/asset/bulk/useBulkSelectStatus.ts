import { ref, Ref, computed, ComputedRef, watch } from 'vue'
import { assetInterface } from '~/types/assets/asset.interface'

export default function useBulkSelectOwners(selectedAssets) {
    const updatedStatus: Ref<string> = ref('')
    const updatedStatusMessage: Ref<string> = ref('')
    const publishedChangeLog: Ref<Record<string, string>> = ref({
        to: '',
        from: '',
        updatedStatusMessage: '',
    })
    const didStatusUpdate: ComputedRef<boolean> = computed(
        () =>
            !!(
                (publishedChangeLog.value.to &&
                    publishedChangeLog.value.to !==
                        publishedChangeLog.value.from) ||
                updatedStatusMessage.value
            )
    )
    watch(didStatusUpdate, () => {
        console.log('JEPKE', didStatusUpdate.value)
    })
    const existingStatus: ComputedRef<Record<string, string>> = computed(() => {
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
        updatedStatusMessageRef,
        publishedChangeLogRef,
        changeLog
    ) => {
        statusRef.value = status
        updatedStatusMessageRef.value = statusMessage
        publishedChangeLogRef.value = { ...changeLog.value }
    }
    return {
        updatedStatus,
        updatedStatusMessage,
        didStatusUpdate,
        existingStatus,
        handleUpdateStatus,
        publishedChangeLog,
    }
}
