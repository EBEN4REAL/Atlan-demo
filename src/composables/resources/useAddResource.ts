import { ref, watch } from 'vue'
import { useAPI } from '~/services/api/useAPI'
import { map } from '~/services/meta/entity/key'
import { generateUUID } from '~/utils/helper/generator'
import { message } from 'ant-design-vue'

export default function useAddResource(selectedAsset, link, linkTitle) {
    const body = ref({
        entity: {
            typeName: 'Link',
            attributes: {
                qualifiedName: generateUUID(),
                name: linkTitle,
                link: link,
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
        const { data, error, isLoading } = useAPI(
            map.ADD_RESOURCE,
            'POST',
            {
                body,
            }, {}
        )
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
