import { State } from './state'

export interface Actions extends State {
    setTenant(value: any): void
    setSMTPConfig(value: any): void
}

export const actions: Actions = {
    setTenant(value) {
        this.displayName = value?.displayName
        this.displayNameHtml = value?.displayNameHtml
        this.smtpServer = value?.smtpServer
        this.identityProviderMappers = value?.identityProviders
        this.identityProviders = value?.identityProviders
    },
    setSMTPConfig(payload) {
        this.smtpServer = payload
    },
}
