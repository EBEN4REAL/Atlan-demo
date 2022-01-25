import { State } from './state'

export interface Actions extends State {
    setTenant(value: any): void
    setSMTPConfig(value: any): void
    setLogo(value: string): void
}

export const actions: Actions = {
    setTenant(value) {
        console.log('tenant value', value)
        this.displayName = value?.displayName
        this.smtpServer = value?.smtpServer
        this.identityProviderMappers = value?.identityProviderMappers
        this.identityProviders = value?.identityProviders
        this.loginWithEmailAllowed = value?.loginWithEmailAllowed
        this.announcementTitle = value?.attributes?.announcementTitle
        this.announcementMessage = value?.attributes?.announcementMessage
        this.announcementType = value?.attributes?.announcementType
        this.announcementUpdatedAt = value?.attributes?.announcementUpdatedAt
        this.announcementUpdatedBy = value?.attributes?.announcementUpdatedBy
        this.tenantRaw = { ...value }
        console.log(this.loginWithEmailAllowed)
    },
    setSMTPConfig(payload) {
        this.smtpServer = payload
    },
    setLogo(url) {
        this.logo = url
    }
}
