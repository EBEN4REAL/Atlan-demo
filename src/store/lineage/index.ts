import { defineStore } from 'pinia'
import { state } from './state'
import { actions } from './actions'
import { getters } from './getters'

const useLineageStore = defineStore({
    id: 'lineage',
    state: () => state,
    getters,
    actions,
})

export default useLineageStore
