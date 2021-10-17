export interface State {
    permissions: string[]
    roles: {name: string; id: string}[];
}

export const state: State = {
    roles: [],
    permissions: []
}
