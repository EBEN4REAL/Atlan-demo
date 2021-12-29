import { State } from './state'

export interface Actions extends State {
    setSelectedAsset(value: any): void
    setActivePanel(value: any): void
    setPreferences(value: any): void
    setActiveFacet(value: any): void
    setActivePostFacet(value: any): void
    setGlobalState(value: any): void
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
    setActivePostFacet(value) {
        this.activePostFacet = value
    },
    setGlobalState(value) {
        console.log('set global state', value)
        this.globalState = value
    },
}
export default actions
