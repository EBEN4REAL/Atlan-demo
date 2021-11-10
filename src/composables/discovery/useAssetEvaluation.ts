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

    return { getAllowedActions, getEvaluations }
}
