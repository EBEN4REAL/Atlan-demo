import { GettersTree } from 'pinia'
import { State } from './state'

export interface Getters {
    checkPermission(state: State): (key: string) => boolean
    checkPermissions(state: State): (keys: string[]) => Record<string, boolean>
}


export const getters: GettersTree<State> & Getters = {
    checkPermission(state){
        const check = (key: string) => {
            return !!state.permissions.find((permission) => permission === key)
        }
        
        return check;
    },
    checkPermissions(state){        
        const check = (keys: string[]) => {
            const permissions = {};
            keys.forEach((key) => {
                permissions[key] =  !!state.permissions.find((permission) => permission === key)
            })

            return permissions;
        }
        return check;
    }

}