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
}

export const state: State = {
    isAuthenticated: false,
    hasFailed: false,
    isPending: false,
    token: '',
    decodedToken: {},
    name: '',
    firstName: '',
    lastName: '',
    email: '',
    id: '',
    username: '',
    createdAt: new Date(),
    roles: [] as string[],
    permissions: [] as string[],
}
