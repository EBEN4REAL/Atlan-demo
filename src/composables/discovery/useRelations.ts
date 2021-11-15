import { Ref, ref, watch } from 'vue'
import { Entity } from '~/services/meta/entity/index'

import { BasicSearchAttributes, AssetAttributes, SavedQueryAttributes, SQLAttributes, AssetRelationAttributes } from '~/constant/projection'

function fetchRelationAssets(id: string, assetType: string) {
    const body: any = {
        limit: 1000,
        offset: 0,
        relation: assetType,
        includeClassificationAttributes: true,
        guid: id,
        excludeDeletedEntities: true,
        includeSubClassifications: true,
        includeSubTypes: true,
        attributes: [...BasicSearchAttributes, ...AssetAttributes, ...SavedQueryAttributes, ...SQLAttributes],
        relationAttributes: [...AssetRelationAttributes]
    }
    const { data,
        mutate,
        error,
        isReady,
        isLoading } = Entity.fetchRelatedAssets(body, {})

    watch(id, (newId, oldId) => {
        if (newId !== oldId) mutate()
    })

    return {
        list: data,
        isReady,
        error,
        isLoading,
    }
}

function useEntityRelationships(guid) {
    const relationshipAssets = ref([])

    const { data, error, isLoading } = Entity.GetEntity(guid)

    watch([data, error], () => {
        if (data.value && error.value == undefined) {
            Object.keys(data.value?.entity?.relationshipAttributes).forEach(
                (el) => {
                    const element =
                        data.value?.entity?.relationshipAttributes[el]
                    if (element && element?.length !== 0 && element.typeName !== "Schema")
                        relationshipAssets.value.push({
                            displayText: el,
                            length: element?.length || 1,
                        })
                }
            )
            console.log(relationshipAssets.value)
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