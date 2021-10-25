import { State } from './state'

export interface Actions extends State {
    setTenant(value: any): void
}

export const actions: Actions = {
    setTenant(value) {
        this.displayName = value?.displayName
        this.displayNameHtml = value?.displayNameHtml
        this.smtpServer = value?.smtpServer
    },
}
