import { defineStore } from 'pinia'
import { state } from './state'
import actions from './actions'
import getters from './getters'

export const useWorkflowStore = defineStore('workflowsV2', {
    state: () => state,
    getters,
    actions,
})
