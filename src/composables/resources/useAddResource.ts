import { ref, watch, inject } from 'vue'
import { message } from 'ant-design-vue'
import { whenever } from '@vueuse/core'
import { Entity } from '~/services/meta/entity/index'
import { generateUUID } from '~/utils/helper/generator'
import { useCurrentUpdate } from '~/composables/discovery/useCurrentUpdate'

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
    const guid = ref()

    const updateList = inject('updateList')

    const newResource = () => {
        const { data, error, isLoading } = Entity.EntityUpdate(body, {})

        const {
            asset,
            mutate: mutateUpdate,
            isReady: isUpdateReady,
        } = useCurrentUpdate({
            id: guid,
        })

        watch(data, () => {
            if (data.value && !isLoading.value && !error.value) {
                message.success('Resource added!')
                guid.value = selectedAsset?.guid
                mutateUpdate()
            } else if (error.value && !isLoading.value) {
                message.error(
                    'Not able to add resource right now. Try again later!'
                )
            }
        })

        whenever(isUpdateReady, () => {
            updateList(asset.value)
        })

        return { data, error, isLoading }
    }
    return {
        newResource,
    }
}
