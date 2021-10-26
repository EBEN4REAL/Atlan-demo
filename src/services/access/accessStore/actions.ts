import { StateTree } from 'pinia'

export interface Actions extends StateTree {
    setPermissions(permissions: string[]): void
    setRoles(roles: {id: string; name: string}[]): void
}

export const actions: Actions = {
    setPermissions(permissions) {
        this.permissions = permissions
    },
    setRoles(roles){
        this.roles = roles
    }
}
