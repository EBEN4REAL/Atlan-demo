import { useStorage } from '@vueuse/core'
import { assetInterface } from '~/types/assets/asset.interface'
export interface State {
    selectedAsset: assetInterface
    activeFacetTab: string[]
    activeFacet: any
    preferences: any
    activePostFacet: any
}

export const state: State = {
    selectedAsset: {},
    activeFacetTab: useStorage('asset_activeFacetTab', []),
    preferences: useStorage('asset_preferences', {}),
    activeFacet: useStorage('asset_activeFacet', {}),
    activePostFacet: useStorage('asset_activePostFacet', {}),
}
