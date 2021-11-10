import { ref, watch } from 'vue'
import { Entity } from '~/services/meta/entity/index'
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
        const { data, error, isLoading } = Entity.EntityUpdate(body, {})

        return { data, error, isLoading }
    }
    return {
        createReadme,
    }
}
