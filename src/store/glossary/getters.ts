import { GettersTree } from 'pinia'
import { State } from './state'

export interface Getters {
    getGlossaryByQualifiedName(state: State): (qf: string) => any
}

export const getters: GettersTree<State> & Getters = {
    getGlossaryByQualifiedName(state: State) {
        return (qf) =>
            state.list?.find((item) => item.attributes.qualifiedName === qf)
    },
}
