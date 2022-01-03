import { defineStore } from 'pinia'
import { state } from './state'
import actions from './actions'
import getters from './getters'

const useAssetStore = defineStore({
    // name of the store
    // it is used in devtools and allows restoring state
    id: 'asset',
    // a function that returns a fresh state
    state: () => state,
    getters,
    // optional actions
    actions,
})
export default useAssetStore
