import { useStorage } from '@vueuse/core'

export interface State {
    displayName: string
    smtpServer: any
    identityProviders: any
    loginWithEmailAllowed: boolean
    identityProviderMappers: any
    announcementTitle: string
    announcementMessage: string
    announcementType: string
    announcementUpdatedAt: string
    announcementUpdatedBy: string
    // need to send the whole tenant in updateTenant Request
    tenantRaw: any
    logo: string,
}

export const state: State = {
    logo: `${window.location.origin}/api/service/avatars/_logo_`,
    displayName: useStorage('tenant_displayName', ''),
    loginWithEmailAllowed: false,
    smtpServer: {},
    identityProviders: [],
    identityProviderMappers: [],
    announcementTitle: '',
    announcementMessage: '',
    announcementType: '',
    announcementUpdatedAt: '',
    announcementUpdatedBy: '',
    tenantRaw: {},
}
