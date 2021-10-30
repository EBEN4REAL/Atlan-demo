import { useStorage } from '@vueuse/core'

export interface State {
    displayName: string
    displayNameHtml: string
    smtpServer: any
    identityProviders: any
    identityProviderMappers: any
}

export const state: State = {
    displayName: useStorage('tenant_displayName', ''),
    displayNameHtml: useStorage('tenant_displayNameHtml', ''),
    smtpServer: {},
    identityProviders: [],
    identityProviderMappers: [],
}
