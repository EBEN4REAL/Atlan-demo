import { computed, ref, WritableComputedRef, watch, Ref } from 'vue'
import mitt from 'mitt'
import updateAsset from '../utils/updateAsset'
import whoami from '../user/whoami'
import { assetInterface } from '~/types/assets/asset.interface'

export default function updateDescription(selectedAsset: Ref<assetInterface>) {
    const { username } = whoami()

    const localDescription = ref('')
    const isCompleted = ref(false)
    const body = ref({})
    const isLoading = ref(false)

    const getBody = () => ({
        entities: [
            {
                guid: selectedAsset.value.guid,
                typeName: selectedAsset.value.typeName,
                attributes: {
                    qualifiedName:
                        selectedAsset.value.attributes?.qualifiedName,
                    name: selectedAsset.value.attributes?.name,
                    userDescription: localDescription.value,
                    shortDescription: localDescription.value,
                    tenantId: selectedAsset.value.attributes?.tenantId,
                },
            },
        ],
    })
    const description: WritableComputedRef<string> = computed({
        get: () =>
            selectedAsset.value?.attributes?.userDescription ||
            selectedAsset.value?.attributes?.description || 
            selectedAsset.value?.attributes?.shortDescription,
        set: (newValue: string) => {
            localDescription.value = newValue
            body.value = getBody()
        },
    })
    const { state, execute, isReady, error } = updateAsset(body, {
        immediate: false,
    })

    const update = () => {
        isLoading.value = true
        execute()
    }

    watch(state, () => {
        if (!error.value && state && isReady.value) {
            isLoading.value = false
            isCompleted.value = false
            selectedAsset.value.attributes.userDescription =
                localDescription.value
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
        description,
        state,
        execute,
        isReady,
        error,
        isCompleted,
        handleCancel,
        update,
        isLoading,
    }
}
