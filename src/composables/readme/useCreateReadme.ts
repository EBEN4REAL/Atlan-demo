import { ref, watch } from 'vue'
import { useAPI } from '~/services/api/useAPI'
import { map } from '~/services/meta/lineage/key'
import { generateUUID } from '~/utils/helper/generator'
import { message } from 'ant-design-vue'

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
        const { data, error, isLoading } = useAPI(
            map.CREATE_README,
            'POST',
            {
                body,
            }, {}
        )
        watch(data, () => {
            selectedAsset.value.attributes.readme = {
                ...data.value.mutatedEntities.CREATE[0],
            }
            message.success('Readme saved!')
        })
        return { data, error, isLoading }
    }
    return {
        createReadme,
    }
}
