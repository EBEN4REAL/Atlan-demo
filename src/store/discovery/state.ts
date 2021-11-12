import { useStorage } from '@vueuse/core'
import { assetInterface } from '~/types/assets/asset.interface'
export interface State {
    selectedAsset: assetInterface
    activeFacetTab: string[]
    activeFacet: any
    preferences: any
}

export const state: State = {
    selectedAsset: useStorage('selectedAsset', {}),
    activeFacetTab: useStorage('activeFacetTab', []),
    preferences: useStorage('preferences', {}),
    activeFacet: useStorage('activeFacet', {}),
}
