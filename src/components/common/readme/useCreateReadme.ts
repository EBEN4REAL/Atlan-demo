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
                name: `${selectedAsset?.displayText} Readme`,
                description: readmeContent,
            },
            relationshipAttributes: {
                asset: {
                    guid: selectedAsset?.guid,
                    typeName: selectedAsset?.typeName,
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
        console.log(data, error, isLoading)
        watch(data, () => {
            console.log(data)
        })
        return { data, error, isLoading }
    }
    return {
        createReadme,
    }
}
