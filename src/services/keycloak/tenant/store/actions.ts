import { Ref } from 'vue'
import { Components } from '~/api/auth/client'
import { Getters } from './getters'
import { State } from './state'

export interface Actions extends State, Getters {
    fetch(): void
    setIsAuthenticated(isAuthenticated: boolean, parsedToken: any): void
    updateSmtpConfig(payload: Object): void
    setData(tenant: Components.Schemas.RealmRepresentation): void
    refreshImage(): void
}

export const actions: Actions = {
    setIsAuthenticated(isAuthenticated, parsedToken) {
        this.isAuthenticated = isAuthenticated
        this.token = parsedToken
    },
    updateSmtpConfig(payload) {
        this.tenant = {
            ...this.tenant,
            smtpServer: payload,
        }
    },
    setData(tenant) {
        this.tenant = tenant
    },
    refreshImage() {
        this.logoUrlKey += 1
    },
    fetch() {
        // const {
        //   data, error
        // } = Search.BasicSearch();
        // console.log(data.value);
        // console.log(error);
        // this.list = data.value as ConnectionType[]
    },
}
