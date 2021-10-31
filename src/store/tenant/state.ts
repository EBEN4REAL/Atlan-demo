import { useStorage } from '@vueuse/core'

export interface State {
    displayName: string
    displayNameHtml: string
    smtpServer: any
    identityProviders: any
    loginWithEmailAllowed: boolean
    identityProviderMappers: any
}

export const state: State = {
    displayName: useStorage('tenant_displayName', ''),
    displayNameHtml: useStorage('tenant_displayNameHtml', ''),
    loginWithEmailAllowed: false,
    smtpServer: {},
    identityProviders: [],
    identityProviderMappers: [],
}
