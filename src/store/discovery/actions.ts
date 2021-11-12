import { State } from './state'

export interface Actions extends State {
    setSelectedAsset(value: any): void
    setActivePanel(value: any): void
    setPreferences(value: any): void
    setActiveFacet(value: any): void
}

export const actions: Actions = {
    setSelectedAsset(value) {
        this.selectedAsset = value
    },
    setActivePanel(value) {
        this.activeFacetTab = value
    },
    setActiveFacet(value) {
        this.activeFacet = value
    },
    setPreferences(value) {
        this.preferences = value
    },
}
export default actions
