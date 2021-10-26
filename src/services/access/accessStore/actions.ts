import { StateTree } from 'pinia'

export interface Actions extends StateTree {
    setPermissions(permissions: string[]): void
    setRoles(roles: {id: string; name: string}[]): void
}

export const actions: Actions = {
    setPermissions(permissions) {
        this.permissions = [...permissions, 'UPDATE_GLOSSARY', 'UPDATE_TERM', 'UPDATE_CATEGORY', 'CREATE_GLOSSARY', 'CREATE_TERM', 'CREATE_CATEGORY'];
    },
    setRoles(roles){
        this.roles = roles
    }
}
