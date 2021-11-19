/* eslint-disable import/prefer-default-export */
import { defineStore } from 'pinia'
import { state } from './state'
import { actions } from './actions'
import { getters } from './getters'

export const useTenantStore = defineStore({
    // name of the store
    // it is used in devtools and allows restoring state
    id: 'tenant',
    // a function that returns a fresh state
    state: () => state,
    // optional getters
    getters,
    // optional actions
    actions,
})
