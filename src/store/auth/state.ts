import { useStorage } from '@vueuse/core'

export interface State {
    isAuthenticated: boolean
    hasFailed: boolean
    isPending: boolean
    token: string
    decodedToken: any
    username: string
    roles: string[]
    name: string
    createdAt: Date
    email: string
    firstName: string
    lastName: string
    id: string
    permissions: string[]
    evaluations: any
    secondaryEvaluations: any
    decentralizedRoles: {
        level: string
        roleId: string
        privelage: string
    }[]
    personas: { id: string; name: string }[]
    purposes: { id: string; name: string }[]
}

export const state: State = {
    isAuthenticated: false,
    hasFailed: false,
    isPending: false,
    token: '',
    decodedToken: {},
    name: useStorage('name', ''),
    firstName: useStorage('firstName', ''),
    lastName: useStorage('lastName', ''),
    email: useStorage('email', ''),
    id: useStorage('id', ''),
    username: useStorage('username', ''),
    createdAt: new Date(),
    roles: useStorage('roles', []),
    permissions: useStorage('permissions', []),
    evaluations: [],
    secondaryEvaluations: [],
    decentralizedRoles: [],
    personas: useStorage('personas', []),
    purposes: useStorage('purposes', []),
}
