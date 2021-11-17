import { Ref, ref, watch } from 'vue'
import { Entity } from '~/services/meta/entity/index'

import { BasicSearchAttributes, AssetAttributes, SavedQueryAttributes, SQLAttributes } from '~/constant/projection'

function constructRequest(guid: string, assetType: string) {
    const finalParams = new URLSearchParams()

    const attributes =
        [...BasicSearchAttributes, ...AssetAttributes, ...SavedQueryAttributes, ...SQLAttributes]


    const paramsObj: any = {
        limit: 1000,
        offset: 0,
        relation: assetType,
        includeClassificationAttributes: true,
        guid,
        excludeDeletedEntities: true,
        includeSubClassifications: true,
        includeSubTypes: true
    }

    attributes.forEach((val: string) => {
        finalParams.append('attributes', val)
    })

    Object.keys(paramsObj).forEach((key) => {
        finalParams.append(key, paramsObj[key])
    })

    return finalParams
}

function fetchRelationAssets(id: string, assetType: string) {

    const list = ref([])

    const params = constructRequest(id, assetType)

    const { data,
        mutate,
        error,
        isReady,
        isLoading } = Entity.fetchRelatedAssets(params, {})

    watch(id, (newId, oldId) => {
        if (newId !== oldId) mutate()
    })

    watch(data, () => {
        if (data.value?.entities) {
            list.value = data.value?.entities
        } else {
            list.value = []
        }
    })

    return {
        list,
        isReady,
        error,
        isLoading,
    }
}

function useEntityRelationships(id: string) {
    const relationshipAssets = ref([])

    const { data, error, isLoading } = Entity.GetEntity(id)

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