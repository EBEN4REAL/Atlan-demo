import { computed, ref, watch } from 'vue'
import updateAsset from '~/composables/utils/updateAsset'

export default function useUpdateReadme(selectedAsset, readmeContent) {
    const isCompleted = ref(false)
    const isLoading = ref(false)
    const body = ref()

    const getBody = () => ({
        entities: [
            {
                guid: selectedAsset.guid,
                typeName: selectedAsset.typeName,
                attributes: {
                    qualifiedName:
                        selectedAsset?.attributes?.qualifiedName ||
                        selectedAsset.uniqueAttributes?.qualifiedName,
                    name: selectedAsset.attributes?.name,
                    description: readmeContent,
                },
            },
        ],
    })
    const readme = computed({
        get: () => selectedAsset?.attributes?.readme?.attributes?.description,
        set: (newValue: string) => {
            body.value = getBody()
        },
    })
    const { state, execute, isReady, error } = updateAsset(body, {
        immediate: false,
    })
    const update = () => {
        body.value = getBody()
        isLoading.value = true
        execute()
    }

    watch(state, () => {
        isLoading.value = false
    })

    return {
        isCompleted,
        isLoading,
        update,
        readme,
    }
}
