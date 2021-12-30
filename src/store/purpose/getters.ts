import { GettersTree } from 'pinia'
import { State } from './state'

export interface Getters {
    getList(state: State): any[]
}

export const getters: GettersTree<State> & Getters = {
    getList(state: State) {
        return state.list
    },
}
