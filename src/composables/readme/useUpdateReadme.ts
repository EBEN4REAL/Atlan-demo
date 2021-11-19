import { computed, ref, watch } from 'vue'
import { message } from 'ant-design-vue'
import { Entity } from '~/services/meta/entity/index'

export default function useUpdateReadme(selectedAsset, readmeContent) {
    const body = ref()

    const getBody = () => ({
        entities: [
            {
                guid: selectedAsset?.guid,
                typeName: selectedAsset?.typeName,
                attributes: {
                    qualifiedName:
                        selectedAsset?.attributes?.qualifiedName ||
                        selectedAsset?.uniqueAttributes?.qualifiedName,
                    name: selectedAsset?.attributes?.name,
                    description: readmeContent,
                },
            },
        ],
    })

    const update = () => {
        body.value = getBody()
        const { data, error, isLoading } = Entity.BulkUpdate(body, {})
        watch(data, () => {
            selectedAsset.value.attributes.readme = {
                ...data.value.mutatedEntities.UPDATE[0],
            }
            message.success('Readme updated!')
        })
        return { data, error, isLoading }
    }

    return {
        update,
    }
}
