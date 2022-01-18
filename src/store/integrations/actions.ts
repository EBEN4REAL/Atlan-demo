/* eslint-disable no-unused-vars */
import { State } from './state'

export interface Actions extends State {
    setAllIntegrationsList(list: any): void
    removeIntegration(id: string): void
    // getIntegration(alias: string, tenantLevel): object | undefined
}

const actions: Actions = {
    setAllIntegrationsList(list) {
        this.allIntegrations = list
    },
    removeIntegration(id) {
        this.allIntegrations = this.allIntegrations?.filter(i => i.id !== id) ?? []
    },
    // getIntegration(alias: string, tenantLevel: boolean) {
    //     if (!alias) {
    //         return undefined
    //     }
    //     const integrationLevel = tenantLevel ? "tenant" : "personal"
    //     return this.allIntegrations?.find(integration => integration.name.toLowerCase() === alias.toLowerCase() && integration.integrationLevel === integrationLevel)
    // }
}
export default actions
