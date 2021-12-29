import { GettersTree } from 'pinia'
import { State } from './state'

export interface Getters {
    getList(state: State): any[]
    getConnectionList(): (id: string) => string[]
}

export const getters: GettersTree<State> & Getters = {
    getList(state: State) {
        return state.list
    },
    getConnectionList(state: State) {
        return (id) => {
            const found = state.list.find((item) => item.id === id)
            return found?.metadataPolicies.map((i) => i.connectionId) || []
        }
    },
}
