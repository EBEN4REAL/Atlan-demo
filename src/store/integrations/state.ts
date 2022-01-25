export interface Integration {
    name: string,
    id: string,
    integrationLevel?: string
}
export interface State {
    allIntegrations: Integration[],
}

export const state: State = {
    allIntegrations: [],
}
