import { assetInterface } from '~/types/assets/asset.interface'
export interface State {
    selectedAsset: assetInterface
}


export const state: State = {
    selectedAsset: {},
}
