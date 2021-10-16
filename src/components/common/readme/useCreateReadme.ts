import { computed, ref, WritableComputedRef, watch, Ref } from 'vue'
import { useAPIAsyncState, useAPIPromise } from '~/services/api/useAPI'
import { KeyMaps } from '~/services/atlas/atlas_keyMaps'
import { generateUUID } from '~/utils/helper/generator'

export default function useUpdateReadme(selectedAsset, readmeContent) {
    const body = ref({
        entity: {
            typeName: 'Readme',
            attributes: {
                qualifiedName: generateUUID(),
                name: `${selectedAsset.value?.displayText} Readme`,
                description: readmeContent,
            },
            relationshipAttributes: {
                asset: {
                    guid: selectedAsset.value?.guid,
                    typeName: selectedAsset.value?.typeName,
                },
            },
        },
    })
    const createReadme = () => {
        const { data, error, isLoading } = useAPIAsyncState(
            KeyMaps.readme.CREATE_README,
            'POST',
            {
                body,
            }
        )
        watch(data, () => {
            selectedAsset.value.attributes.readme = {
                ...data.value.mutatedEntities.CREATE[0],
            }
        })
        return { data, error, isLoading }
    }
    return {
        createReadme,
    }
}
