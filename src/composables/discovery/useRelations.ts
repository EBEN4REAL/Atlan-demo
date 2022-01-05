import { Entity } from '~/services/meta/entity/index'
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
    const {
        data,
        isLoading,
        isValidating,
        aggregationMap,
        mutate,
        cancelRequest,
        error,
        isReady,
    } = useIndexSearch<assetInterface>(defaultBody, localKey, false, false, 1)

    const asset = ref<assetInterface[]>([])
    watch(data, () => {
        if (data.value?.entities?.length > 0) {
            asset.value = data?.value?.entities[0]
        }
    })

    return {
        aggregationMap,
        isValidating,
        isLoading,
        data,
        fetch,
        cancelRequest,
        mutate,
        error,
        asset,
        isReady,
    }
}

/* function useEntityRelationships(id: string) {
    const relationshipAssets = ref([])

    const { data, error, isLoading } = Entity.GetEntity(id)

    watch([data, error], () => {
        if (data.value && error.value == undefined) {
            Object.keys(data.value?.entity?.relationshipAttributes).forEach(
                (el) => {
                    const element =
                        data.value?.entity?.relationshipAttributes[el]
                    if (
                        element &&
                        element?.length !== 0 &&
                        element.typeName !== 'Schema'
                    )
                        relationshipAssets.value.push({
                            displayText: el,
                            length: element?.length || 1,
                        })
                }
            )
        } else {
            // if data not found
            console.log(
                error.value,
                '------ failed to fetch entity data------ '
            )
        }
    })
    return { relationshipAssetTypes: relationshipAssets, isLoading }
}

export const useRelations = { fetchRelationAssets, useEntityRelationships }
 */
