/* eslint-disable no-underscore-dangle */
/* eslint-disable arrow-body-style */

import { assetInterface } from '~/types/assets/asset.interface'

import { useAuthStore } from '~/store/auth'

// import { formatDateTime } from '~/utils/date'

// import { getCountString, getSizeString } from '~/composables/asset/useFormat'

export default function useAssetEvaluate() {
    const authStore = useAuthStore()

    const getEvaluations = (asset: assetInterface) => {
        return authStore.evaluations.filter((i) => i.entityGuid === asset.guid)
    }

    const getAllowedActions = (asset: assetInterface) => {
        return authStore.evaluations
            .filter((i) => i.entityGuid === asset.guid && i.allowed)
            .map((i) => i.action)
    }

    const getAssetEvaluationsBody = (asset: assetInterface) => {
        return [
            {
                typeName: asset.typeName,
                entityGuid: asset.guid,
                action: 'ENTITY_UPDATE',
            },
            {
                typeName: asset.typeName,
                entityGuid: asset.guid,
                action: 'ENTITY_ADD_CLASSIFICATION',
                classification: '*',
            },
            {
                typeName: asset.typeName,
                entityGuid: asset.guid,
                action: 'ENTITY_REMOVE_CLASSIFICATION',
                classification: '*',
            },
            {
                action: 'RELATIONSHIP_ADD',
                relationShipTypeName: 'AtlasGlossarySemanticAssignment',
                entityIdEnd1: '*',
                entityTypeEnd1: 'AtlasGlossaryTerm',
                entityGuidEnd2: asset.guid,
                entityTypeEnd2: asset.typeName,
            },
            {
                action: 'RELATIONSHIP_REMOVE',
                relationShipTypeName: 'AtlasGlossarySemanticAssignment',
                entityIdEnd1: '*',
                entityTypeEnd1: 'AtlasGlossaryTerm',
                entityGuidEnd2: asset.guid,
                entityTypeEnd2: asset.typeName,
            },
            {
                typeName: asset.typeName,
                entityGuid: asset.guid,
                action: 'ENTITY_UPDATE_BUSINESS_METADATA',
                businessMetadata: '*',
            },
        ]
    }

    return { getAllowedActions, getEvaluations, getAssetEvaluationsBody }
}
