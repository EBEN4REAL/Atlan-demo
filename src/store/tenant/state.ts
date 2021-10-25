export interface State {
    displayName: string
    displayNameHtml: string
    smtpServer: any
    identityProviders: any
    identityProviderMappers: any
}

export const state: State = {
    displayName: '',
    displayNameHtml: '',
    smtpServer: {},
    identityProviders: [],
    identityProviderMappers: [],
}
