import { ref, watch } from 'vue'
import { message } from 'ant-design-vue'
import { Entity } from '~/services/meta/entity/index'
import { generateUUID } from '~/utils/helper/generator'

export default function useAddResource(selectedAsset, link, linkTitle) {
    const body = ref({
        entity: {
            typeName: 'Link',
            attributes: {
                qualifiedName: generateUUID(),
                name: linkTitle,
                link,
            },
            relationshipAttributes: {
                asset: {
                    guid: selectedAsset?.guid,
                    typeName: selectedAsset?.typeName,
                },
            },
        },
    })
    const newResource = () => {
        const { data, error, isLoading } = Entity.EntityUpdate(body, {})

        watch(data, () => {
            if (data.value && !isLoading.value && !error.value) {
                selectedAsset.attributes.links.push({ ...data.value.mutatedEntities.CREATE[0] })
                message.success('Resource added!')
            }
            else if (error.value && !isLoading.value) {
                message.error('Not able to add resource right now. Try again later!')
            }
        }
        )
        return { data, error, isLoading }
    }
    return {
        newResource,
    }
}
