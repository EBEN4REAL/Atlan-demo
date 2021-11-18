import { useStorage } from '@vueuse/core'

export interface State {
    displayName: string
    displayNameHtml: string
    smtpServer: any
    identityProviders: any
    loginWithEmailAllowed: boolean
    identityProviderMappers: any
    announcementTitle: string
    announcementDescription: string
    announcementType: string
    // need to send the whole tenant in updateTenant Request
    tenantRaw: any
}

export const state: State = {
    displayName: useStorage('tenant_displayName', ''),
    displayNameHtml: useStorage('tenant_displayNameHtml', ''),
    loginWithEmailAllowed: false,
    smtpServer: {},
    identityProviders: [],
    identityProviderMappers: [],
    announcementTitle: '',
    announcementDescription: '',
    announcementType: '',
    tenantRaw: {},
}
