import { ref, Ref, watch, computed } from 'vue'
import useIndexSearch from './useIndexSearch'
import { assetInterface } from '~/types/assets/asset.interface'
import { useBody } from './useBody'

import { AssetRelationAttributes } from '~/constant/projection'
import useAssetInfo from './useAssetInfo'

export function useRelations(selectedAsset) {
    const defaultBody = ref({})

    const { assetTypeRelations } = useAssetInfo()
    const defaultAttributes = ref(assetTypeRelations(selectedAsset.value))
    const relationAttributes = ref([...AssetRelationAttributes])

    const generateBody = () => {
        const dsl = useBody(
            '',
            0,
            1,
            { guid: selectedAsset.value.guid },
            {},
            [],
            {}
        )
        defaultBody.value = {
            dsl,
            attributes: defaultAttributes?.value,
            relationAttributes: relationAttributes?.value,
        }
    }

    const localKey = ref(selectedAsset.value.guid)

    generateBody()
    const { data, isLoading, error, isReady } = useIndexSearch<assetInterface>(
        defaultBody,
        localKey,
        false,
        false,
        1
    )

    const guidList = ref<assetInterface[]>([])

    watch(data, () => {
        if (data.value?.entities?.length > 0) {
            Object.keys(data.value?.entities[0]?.attributes).forEach((el) => {
                const element = data.value?.entities[0]?.attributes[el]
                if (
                    element &&
                    element.length !== 0 &&
                    assetTypeRelations(selectedAsset.value)?.includes(el)
                ) {
                    if (Array.isArray(element)) {
                        element?.forEach((entity) =>
                            guidList.value.push(entity.guid)
                        )
                    } else {
                        guidList.value.push(element.guid)
                    }
                }
            })
        }
    })

    return {
        isLoading,
        data,
        error,
        guidList,
        isReady,
    }
}
