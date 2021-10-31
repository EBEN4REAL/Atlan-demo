import { useStorage } from '@vueuse/core'
import { assetInterface } from '~/types/assets/asset.interface'
export interface State {
    selectedAsset: assetInterface
    activeFacetTab: string[]
    activeFacet: any
}

export const state: State = {
    selectedAsset: {},
    activeFacetTab: useStorage('activeFacetTab', []),
    activeFacet: useStorage('activeFacet', {}),
}
