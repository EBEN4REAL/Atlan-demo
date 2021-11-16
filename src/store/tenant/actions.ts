import { State } from './state'

export interface Actions extends State {
    setTenant(value: any): void
    setSMTPConfig(value: any): void
}

export const actions: Actions = {
    setTenant(value) {
        console.log('value', value)
        this.displayName = value?.displayName
        this.displayNameHtml = value?.displayNameHtml
        this.smtpServer = value?.smtpServer
        this.identityProviderMappers = value?.identityProviders
        this.identityProviders = value?.identityProviders
        this.loginWithEmailAllowed = value?.loginWithEmailAllowed
        this.announcementTitle = value?.attributes?.announcementTitle
        this.announcementDescription =
            value?.attributes?.announcementDescription
        this.announcementType = value?.attributes?.announcementType
        this.tenantRaw = { ...value }
        console.log(this.loginWithEmailAllowed)
    },
    setSMTPConfig(payload) {
        this.smtpServer = payload
    },

}
