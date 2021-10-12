import { GettersTree } from 'pinia'
import { State } from './state'

export interface Getters {
    checkPermission(state: State): (key: string) => boolean
}


export const getters: GettersTree<State> & Getters = {
    checkPermission(state){
        const check = (key: string) => {
            return !!state.permissions.find((permission) => permission === key)
        }
        
        return check;
    }
}
