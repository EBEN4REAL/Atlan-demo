/* eslint-disable no-underscore-dangle */
/* eslint-disable arrow-body-style */

import { assetInterface } from '~/types/assets/asset.interface'

import { useAuthStore } from '~/store/auth'
import useAssetInfo from '~/composables/discovery/useAssetInfo'

// import { formatDateTime } from '~/utils/date'

// import { getCountString, getSizeString } from '~/composables/asset/useFormat'

export default function useAssetEvaluate() {
    const authStore = useAuthStore()
    const { isGTC } = useAssetInfo()

    const getEvaluations = (asset: assetInterface) => {
        return authStore.evaluations.filter((i) => i.entityGuid === asset.guid)
    }

    const getAllowedActions = (asset: assetInterface) => {
        return authStore.evaluations
            .filter((i) => i.entityGuid === asset.guid && i.allowed)
            .map((i) => i.action)
    }

    const getAssetEvaluationsBody = (asset: assetInterface) => {
        if (isGTC(asset)) {
            const { typeName } = asset

            const evaluateObject = [
                {
                    typeName: asset?.typeName,
                    entityGuid: asset?.guid,
                    action: 'ENTITY_UPDATE',
                },
                {
                    typeName: asset?.typeName,
                    entityGuid: asset?.guid,
                    action: 'ENTITY_DELETE',
                },
                {
                    typeName: asset?.typeName,
                    entityGuid: asset?.guid,
                    action: 'ENTITY_UPDATE_BUSINESS_METADATA',
                    businessMetadata: '*',
                },
                {
                    typeName: asset?.typeName,
                    entityGuid: asset?.guid,
                    action: 'ENTITY_ADD_CLASSIFICATION',
                    classification: '*',
                },
                {
                    typeName: asset?.typeName,
                    entityGuid: asset?.guid,
                    action: 'ENTITY_REMOVE_CLASSIFICATION',
                    classification: '*',
                },
                {
                    action: 'RELATIONSHIP_ADD',
                    relationShipTypeName: 'asset_readme',
                    entityGuidEnd1: asset?.guid,
                    entityTypeEnd1: asset?.typeName,
                    entityIdEnd2: '*',
                    entityTypeEnd2: 'Readme',
                },
                {
                    action: 'RELATIONSHIP_ADD',
                    relationShipTypeName: 'asset_links',
                    entityGuidEnd1: asset?.guid,
                    entityTypeEnd1: asset?.typeName,
                    entityIdEnd2: '*',
                    entityTypeEnd2: 'Link',
                },
                /** create and link term to a glossary check, if
                 *  check passes for the glossary then 
                 * user can create & link term to any category 
                 * inside this glossary */
                {
                    "action": "RELATIONSHIP_ADD",
                    "relationShipTypeName": "AtlasGlossaryTermAnchor",
                    entityGuidEnd1: asset?.guid,
                    entityTypeEnd1: asset?.typeName,
                    "entityIdEnd2": "*",
                    "entityTypeEnd2": "AtlasGlossaryTerm"
                },
                /** create and link category to a glossary check, if
              *  check passes for the glossary then 
              * user can create & link category to any category 
              * inside this glossary */
                {
                    "action": "RELATIONSHIP_ADD",
                    "relationShipTypeName": "AtlasGlossaryCategoryAnchor",
                    entityGuidEnd1: asset?.guid,
                    entityTypeEnd1: asset?.typeName,
                    "entityIdEnd2": "*",
                    "entityTypeEnd2": "AtlasGlossaryCategory"
                }

            ]

            if (typeName === 'AtlasGlossaryTerm')
                evaluateObject.push({
                    action: 'RELATIONSHIP_ADD',
                    relationShipTypeName: 'AtlasGlossarySemanticAssignment',
                    entityGuidEnd1: asset?.guid,
                    entityTypeEnd1: 'AtlasGlossaryTerm',
                    entityIdEnd2: '*',
                    entityTypeEnd2: '*',
                })

            return evaluateObject
        }
        return [
            {
                typeName: asset?.typeName,
                entityGuid: asset?.guid,
                action: 'ENTITY_UPDATE',
            },
            {
                typeName: asset?.typeName,
                entityGuid: asset?.guid,
                action: 'ENTITY_ADD_CLASSIFICATION',
                classification: '*',
            },
            {
                typeName: asset?.typeName,
                entityGuid: asset?.guid,
                action: 'ENTITY_REMOVE_CLASSIFICATION',
                classification: '*',
            },
            {
                action: 'RELATIONSHIP_ADD',
                relationShipTypeName: 'AtlasGlossarySemanticAssignment',
                entityIdEnd1: '*',
                entityTypeEnd1: 'AtlasGlossaryTerm',
                entityGuidEnd2: asset?.guid,
                entityTypeEnd2: asset?.typeName,
            },
            {
                action: 'RELATIONSHIP_REMOVE',
                relationShipTypeName: 'AtlasGlossarySemanticAssignment',
                entityIdEnd1: '*',
                entityTypeEnd1: 'AtlasGlossaryTerm',
                entityGuidEnd2: asset?.guid,
                entityTypeEnd2: asset?.typeName,
            },
            {
                action: 'RELATIONSHIP_ADD',
                relationShipTypeName: 'asset_readme',
                entityGuidEnd1: asset?.guid,
                entityTypeEnd1: asset?.typeName,
                entityIdEnd2: '*',
                entityTypeEnd2: 'Readme',
            },
            {
                action: 'RELATIONSHIP_ADD',
                relationShipTypeName: 'asset_links',
                entityGuidEnd1: asset?.guid,
                entityTypeEnd1: asset?.typeName,
                entityIdEnd2: '*',
                entityTypeEnd2: 'Link',
            },
            {
                typeName: asset?.typeName,
                entityGuid: asset?.guid,
                action: 'ENTITY_UPDATE_BUSINESS_METADATA',
                businessMetadata: '*',
            },
        ]
    }

    return { getAllowedActions, getEvaluations, getAssetEvaluationsBody }
}
